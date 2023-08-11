import { IVDOMElement } from "@core/interfaces/IVDOMElement";
import {
  ComponentProps,
  FnComponent,
  ICreatedComponent,
} from "@core/interfaces/componentType";
import Parser from "@core/Parser";
import RenderVDOM from "@core/Render";
import { Emmiter } from "@core/Emitter";
import { reactiveNodes, reactiveProxy } from "./reactivity";
import { PatchNodeType } from "./interfaces/typeNodes";

export default class SPA {
  private root!: HTMLElement;
  private emitter!: Emmiter;
  private static components = new Map<string, ICreatedComponent>();

  constructor(root: HTMLElement | null, mainComponent: FnComponent) {
    if (!root) return;

    this.root = root;
    this.emitter = Emmiter.getInstance();
    this.emitter.subscribe(
      "app:setupComponent",
      this.setupComponent.bind(this)
    );

    this.mount(mainComponent);
  }

  private setupComponent(
    component: FnComponent,
    root: HTMLElement,
    componentProps?: ComponentProps
  ) {
    const [template, props] = component(componentProps);
    const componentName = component.name;

    if (props.onBeforeMounted) {
      props.onBeforeMounted();
    }

    const parser = new Parser(template, props);
    const render = new RenderVDOM(componentName, props);
    const vdom = parser.genereteVDOM() as IVDOMElement;

    render.render(root, vdom);

    if (props.onMounted) {
      props.onMounted();
    }

    SPA.components.set(componentName, {
      vdom,
      onUpdate: props.onUpdate,
      onBeforeUpdate: props.onBeforeUpdate,
      onUnmounted: props.onUnmounted,
      rerender: () => {
        if (props.onBeforeMounted) {
          props.onBeforeMounted();
        }
        render.render(root, vdom);
        if (props.onMounted) {
          props.onMounted();
        }
      },
    });
  }

  public static updateNodes(obj: object, value: any) {
    const proxy = reactiveProxy.get(obj);

    if (!proxy) {
      console.error(`proxy object not found ${obj}`);
      return;
    }

    const nodes = reactiveNodes.get(proxy);

    if (!nodes) return;

    nodes.forEach(([type, node, componentName]) => {
      const updatedComponent = SPA.components.get(componentName);

      if (updatedComponent?.onBeforeUpdate) {
        updatedComponent.onBeforeUpdate();
      }

      if (type === PatchNodeType.PATCH_VALUE && node instanceof Text) {
        node.data = value;
      } else if (type === PatchNodeType.PATCH_IF) {
        if (!node && typeof node !== "string") {
          console.error(
            `component name - ${node} is not valid. Must be string value`
          );
          return;
        }
        const component = SPA.components.get(node as string);

        if (!component) {
          console.error(`component - ${node} is not found`);
          return;
        }

        if (value) {
          component.rerender();
        } else {
          clearNodes(component.vdom.children![0].children);
          if (component.onUnmounted) {
            component.onUnmounted();
          }
        }
      }

      if (updatedComponent?.onUpdate) {
        updatedComponent.onUpdate();
      }

      function clearNodes(nodes?: IVDOMElement[]) {
        if (!nodes) return;

        nodes.forEach((node) => {
          if (node.el) {
            node.el.remove();
          } else {
            if (SPA.components.has(node.tag)) {
              const component = SPA.components.get(node.tag);

              if (!component) {
                console.error(`component - ${node} is not found`);
                return;
              }

              clearNodes(component.vdom.children![0].children);

              if (component.onUnmounted) {
                component.onUnmounted();
              }
            }
          }
        });
      }
    });
  }

  private mount(component: FnComponent) {
    this.setupComponent(component, this.root);
  }
}
