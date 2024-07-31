import { IVDOMElement } from "./interfaces/IVDOMElement";
import {
  ComponentProps,
  FnComponent,
  ICreatedComponent,
} from "./interfaces/componentType";
import Parser from "./Parser";
import RenderVDOM from "./Render";
import { deepComputed, reactiveNodes, reactiveProxy } from "./reactivity";
import { PatchNodeType, insertVDOMType } from "./interfaces/typeNodes";
import {
  clearNodes,
  findNeighborVDOMComponent,
  findNeighborVDOMNode,
} from "./utils/domUtils";
import debounce from "./utils/debounce";
import removeArrayObject from "./utils/removeArrayObject";
import { IExternalModule } from "./interfaces/IExternalModule";
import { ComponentThree } from "./ComponentThree";
import { componentController } from "./apiInject";

export class SPA {
  public static root: HTMLElement;
  public static components = new Map<string, ICreatedComponent>();
  private modules = new Map<string, IExternalModule>();
  private rootComponent!: FnComponent;

  constructor(rootComponent: FnComponent) {
    this.rootComponent = rootComponent;
    componentController.addComponentToThee(rootComponent.name, null);
  }

  public static setupComponent(
    component: FnComponent,
    root: HTMLElement,
    componentId: string | null,
    type: insertVDOMType,
    theeComponent: ComponentThree | null,
    componentProps?: ComponentProps
  ) {
    const componentTheeData = insertComponentToTree(
      theeComponent,
      component.name
    );

    const [body, props] = component(componentProps);

    const parser = new Parser(body.template, props);

    const componentName = componentId
      ? `${component.name}:${componentId}`
      : component.name;

    const render = new RenderVDOM(
      componentName,
      componentId,
      componentTheeData,
      props
    );
    const vdom = parser.genereteVDOM() as IVDOMElement;

    render.insertVDOM(vdom, root, type);

    applyStyles(body.style, render.componentId);

    if (props?.onBeforeMounted) {
      debounce(props.onBeforeMounted, 100);
    }

    if (props?.onMounted) {
      debounce(props.onMounted, 100);
    }

    setParentComponent(vdom.children, componentName);

    SPA.components.set(componentName, {
      vdom,
      onUpdate: debounce(props?.onUpdate, 100),
      onBeforeUpdate: debounce(props?.onBeforeUpdate, 100),
      onUnmounted: debounce(props?.onUnmounted, 100),
      rerender: (node) => {
        if (props?.onBeforeMounted) {
          debounce(props.onBeforeMounted, 100);
        }

        render.insertVDOM(
          node.vdom,
          node.lastNeighborNode[1],
          node.lastNeighborNode[0]
        );
        if (props?.onMounted) {
          debounce(props.onMounted, 100);
        }
      },
    });
  }

  public static updateNodes(obj: object, value: any, target?: object) {
    deepUpdate(obj, target);
    const proxy = reactiveProxy.get(target ?? obj);
    if (!proxy) {
      console.error(`proxy object not found ${obj}`);
      return;
    }

    const nodes = reactiveNodes.get(proxy);

    if (!nodes) return;

    for (const item of [...nodes]) {
      const [type, node, componentName, reactiveProvider] = item;

      const updatedComponent = SPA.components.get(componentName);

      if (!updatedComponent) {
        console.error(`component - ${componentName} is not found`);
        continue;
      }

      if (updatedComponent?.onBeforeUpdate) {
        updatedComponent.onBeforeUpdate();
      }

      // Patch Node value
      if (type === PatchNodeType.PATCH_VALUE && node instanceof Text) {

        let updatedReactiveValue = value;

        try {
          if (reactiveProvider) {
            updatedReactiveValue = reactiveProvider();

            if (
              Object.prototype.hasOwnProperty.call(
                updatedReactiveValue,
                "_root"
              )
            ) {
              updatedReactiveValue = updatedReactiveValue["_root"]();
            }
          }
        } catch (e) {
          console.log("e", e);
        }

        node.data = updatedReactiveValue;
      }
      // Patch IF Node
      else if (
        type === PatchNodeType.PATCH_IF_NODE &&
        node instanceof HTMLElement
      ) {
        if (value) {
          const insertNode = findNeighborVDOMNode(updatedComponent.vdom, node);

          if (!insertNode) continue;

          updatedComponent.rerender(insertNode);
          removeArrayObject(nodes, item);
        } else {
          node.remove();

          if (updatedComponent.onUnmounted) {
            updatedComponent.onUnmounted();
          }
        }
      }
      // Patch IF Component
      else if (
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
      }
      // Patch For Node
      else if (type === PatchNodeType.PATCH_FOR) {

        let forNode = null;

        if (Array.isArray(node)) {
          forNode = node[0];
          node.forEach((item) => item.remove());
        } else {
          forNode = node;
        }

        const insertNode = findNeighborVDOMNode(
          updatedComponent.vdom,
          forNode as any
        );

        if (!insertNode) continue;

        updatedComponent.rerender(insertNode);
        removeArrayObject(nodes, item);
      }

      if (updatedComponent?.onUpdate) {
        updatedComponent.onUpdate();
      }
    }
  }

  public mount(root: HTMLElement | null) {
    if (!root) return;
    SPA.root = root;

    let component = this.rootComponent;

    const router = this.modules.get("router");

    if (router && router.currentRoute) {
      const route = router.currentRoute;
      component = route.component;
    }

    SPA.setupComponent(component, root, null, "append", null);
  }

  public appProvideData(key: string, data: any) {
    componentController.currentNode?.addProvideValue(key, data);
  }

  public use(name: string, module: IExternalModule) {
    this.modules.set(name, module);
    module.init(this);

    return this;
  }
}

function insertComponentToTree(
  theeComponent: ComponentThree | null,
  componentName: string
) {
  let componentTheeData;

  if (theeComponent) {
    componentTheeData = componentController.addComponentToThee(
      componentName,
      theeComponent
    );
  } else {
    componentTheeData = componentController.currentNode;
  }

  if (!componentTheeData) {
    throw new Error("Error when rendering root element");
  }

  return componentTheeData;
}

function applyStyles(styleData: string | undefined, componentId: string) {
  if (styleData) {
    const styleElement = document.createElement("style");

    const style = styleData.replace("scoped", `data-c='${componentId}'`);

    styleElement.innerHTML = style;
    styleElement.id = componentId;
    document.head.appendChild(styleElement);
  }
}

function setParentComponent(
  children: IVDOMElement[] | undefined,
  componentName: string
) {
  if (!children) return;

  if (children.length === 1)
    return setParentComponent(children[0].children, componentName);

  children.forEach((child) => {
    const component = SPA.components.get(`${child.tag}:${child.componentId}`);

    if (component) {
      component.vdom.parentComponent = componentName;
    }
  });
}

function deepUpdate(obj: object, target: object | undefined) {
  if (deepComputed.has(obj)) {
    const computedValues = deepComputed.get(obj);

    if (computedValues) {
      for (let item of computedValues) {
        if (!item) continue;

        if (item[0] && item[0] === target) {
          SPA.updateNodes(item[1], item[1]());
        }
      }
    }
  }
}

export const updateNodes = SPA.updateNodes;
