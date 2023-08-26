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
import { PatchNodeType, insertVDOMType } from "./interfaces/typeNodes";
import {
  clearNodes,
  findNeighborVDOMComponent,
  findNeighborVDOMNode,
} from "./utils/domUtils";
import debounce from "./utils/debounce";
import { ExternalModuleInterface } from "./libs/router";
import removeArrayObject from "./utils/removeArrayObject";

export class SPA {
  [x: string]: any;
  public static root: HTMLElement;
  private emitter!: Emmiter;
  public static components = new Map<string, ICreatedComponent>();
  private modules = new Map<string, ExternalModuleInterface>();
  private rootComponent!: FnComponent;

  constructor(rootComponent: FnComponent) {
    this.rootComponent = rootComponent;

    this.emitter = Emmiter.getInstance();
    this.emitter.subscribe(
      "app:setupComponent",
      this.setupComponent.bind(this)
    );
  }

  private setupComponent(
    component: FnComponent,
    root: HTMLElement,
    componentId: string | null,
    type: insertVDOMType,
    componentProps?: ComponentProps
  ) {
    const [template, props] = component(componentProps);
    const componentName = componentId
      ? `${component.name}:${componentId}`
      : component.name;

    if (props?.onBeforeMounted) {
      props.onBeforeMounted();
    }

    const parser = new Parser(template, props);

    const render = new RenderVDOM(componentName, props);
    const vdom = parser.genereteVDOM() as IVDOMElement;

    render.insertVDOM(vdom, root, type);

    if (props?.onMounted) {
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
          component.vdom.parentComponent = componentName;
        }
      });
    }

    ttt(vdom.children);

    SPA.components.set(componentName, {
      vdom,
      onUpdate: props?.onUpdate,
      onBeforeUpdate: props?.onBeforeUpdate,
      onUnmounted: props?.onUnmounted,
      rerender: (node) => {
        if (props?.onBeforeMounted) {
          props.onBeforeMounted();
        }

        render.insertVDOM(
          node.vdom,
          node.lastNeighborNode[1],
          node.lastNeighborNode[0]
        );
        if (props?.onMounted) {
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

    for (const item of [...nodes]) {
      debugger;

      const [type, node, componentName] = item;

      const updatedComponent = SPA.components.get(componentName);

      if (!updatedComponent) {
        console.error(`component - ${componentName} is not found`);
        continue;
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

          if (!insertNode) continue;

          updatedComponent.rerender(insertNode);
          removeArrayObject(nodes, item)
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
          continue;
        }
        const component = SPA.components.get(node as string);

        if (!component) {
          console.error(`component - ${node} is not found`);
          continue;
        }

        if (value) {
          const insertNode = findNeighborVDOMComponent(
            updatedComponent.vdom,
            node
          );

          if (!insertNode) continue;

          component.rerender(insertNode);
        } else {
          clearNodes(component.vdom.children![0].children);
          if (component.onUnmounted) {
            component.onUnmounted();
          }
        }
      } else if (type === PatchNodeType.PATCH_FOR && Array.isArray(node)) {
        node.forEach((item) => item.remove());

        const insertNode = findNeighborVDOMNode(updatedComponent.vdom, node[0]);

        if (!insertNode) continue;

        console.log("!!!@!@", insertNode, SPA.components);

        updatedComponent.rerender(insertNode);
        removeArrayObject(nodes, item)
      }

      if (updatedComponent?.onUpdate) {
        updatedComponent.onUpdate();
      }
    }
  }

  public mount(root: HTMLElement | null) {
    if (!root) return;

    SPA.root = root;

    if (this.modules.has("router")) {
      console.log("HAS ROUTER");
    }

    this.setupComponent(this.rootComponent, root, null, "append");
  }

  public use(name: string, module: ExternalModuleInterface) {
    this.modules.set(name, module);
    module.init(this);

    return this;
  }
}

export const updateNodes = debounce(SPA.updateNodes, 100);
