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
import {
  clearNodes,
  findNeighborVDOMComponent,
  findNeighborVDOMNode,
} from "./utils/domUtils";
import debounce from "./utils/debounce";

export class SPA {
  public static root: HTMLElement;
  private emitter!: Emmiter;
  public static components = new Map<string, ICreatedComponent>();

  constructor(root: HTMLElement | null, mainComponent: FnComponent) {
    if (!root) return;

    SPA.root = root;
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
    componentId: string,
    componentProps?: ComponentProps
  ) {
    const [template, props] = component(componentProps);
    const componentName = component.name;

    if (props.onBeforeMounted) {
      props.onBeforeMounted();
    }

    const parser = new Parser(template, props);
    const render = new RenderVDOM(componentName, componentId, props);
    const vdom = parser.genereteVDOM() as IVDOMElement;

    render.insertVDOM(vdom, root, "append");

    if (props.onMounted) {
      props.onMounted();
    }

    function ttt(children: IVDOMElement[] | undefined) {
      if (!children) return;

      if (children.length === 1) return ttt(children[0].children);

      children.forEach((child) => {
        const component = SPA.components.get(
          `${child.tag}:${child.componentId}`
        );

        if (component) {
          component.vdom.parentComponent = `${componentName}:${componentId}`;
        }
      });
    }

    ttt(vdom.children);

    SPA.components.set(`${componentName}:${componentId}`, {
      vdom,
      onUpdate: props.onUpdate,
      onBeforeUpdate: props.onBeforeUpdate,
      onUnmounted: props.onUnmounted,
      rerender: (node) => {
        if (props.onBeforeMounted) {
          props.onBeforeMounted();
        }

        render.insertVDOM(
          node.vdom,
          node.lastNeighborNode[1],
          node.lastNeighborNode[0]
        );
        if (props.onMounted) {
          props.onMounted();
        }
      },
    });

    console.log(SPA.components);
  }

  public static updateNodes(obj: object, value: any) {
    const proxy = reactiveProxy.get(obj);
    if (!proxy) {
      console.error(`proxy object not found ${obj}`);
      return;
    }

    const nodes = reactiveNodes.get(proxy);

    if (!nodes) return;

    console.log("#######", nodes);

    nodes.forEach(([type, node, componentName]) => {
      const updatedComponent = SPA.components.get(componentName);

      if (!updatedComponent) {
        console.error(`component - ${componentName} is not found`);
        return;
      }

      if (updatedComponent?.onBeforeUpdate) {
        updatedComponent.onBeforeUpdate();
      }

      if (type === PatchNodeType.PATCH_VALUE && node instanceof Text) {
        node.data = value;
      } else if (
        type === PatchNodeType.PATCH_IF_NODE &&
        node instanceof HTMLElement
      ) {
        if (value) {
          const insertNode = findNeighborVDOMNode(updatedComponent.vdom, node);

          if (!insertNode) return;

          updatedComponent.rerender(insertNode);
        } else {
          node.remove();

          if (updatedComponent.onUnmounted) {
            updatedComponent.onUnmounted();
          }
        }
      } else if (
        type === PatchNodeType.PATCH_IF_COMPONENT &&
        typeof node === "string"
      ) {
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
          const insertNode = findNeighborVDOMComponent(
            updatedComponent.vdom,
            node
          );

          if (!insertNode) return;

          component.rerender(insertNode);
        } else {
          clearNodes(component.vdom.children![0].children);
          if (component.onUnmounted) {
            component.onUnmounted();
          }
        }
      } else if (
        type === PatchNodeType.PATCH_FOR &&
        node instanceof Object &&
        "tag" in node &&
        Array.isArray(node.el)
      ) {
        node.el.forEach((item) => item.remove());

        const insertNode = findNeighborVDOMNode(
          updatedComponent.vdom,
          node.el[0]
        );

        if (!insertNode) return;

        console.log("!!!@!@", insertNode, SPA.components);

        updatedComponent.rerender(insertNode);
      }

      if (updatedComponent?.onUpdate) {
        updatedComponent.onUpdate();
      }
    });
  }

  private mount(component: FnComponent) {
    this.setupComponent(component, SPA.root, "");
  }
}

export const updateNodes = debounce(SPA.updateNodes, 100);
