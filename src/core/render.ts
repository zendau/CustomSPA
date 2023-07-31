import { IVDOMElement } from "../interfaces/IVDOMElement";
import { reactiveNodes, reactiveProxy } from "./reactivity";
import stringObjectFileds from "./utils/stringObjectFields";

enum patchNode {
  PATCH_VALUE = "PATCH_VALUE",
  PATCH_CLASS = "PATCH_CLASS",
  PATCH_STYLE = "PATCH_STYLE",
}

export default class RenderVDOM {
  private componentScript!: Record<string, any>;

  constructor(script: object) {
    this.componentScript = script;
  }

  public render(root: HTMLElement | null, vdom: IVDOMElement) {
    if (!root) return;

    const el = document.createElement(vdom.tag);

    if (vdom.props.id) {
      el.id = vdom.props.id;
    }

    if (vdom.props.class) {
      el.classList.add(...vdom.props.class);
    }

    if (vdom.props.value) {
      if (Array.isArray(vdom.props.value)) {
        el.innerHTML = stringObjectFileds(
          this.componentScript,
          vdom.props.value[0]
        );
      } else {
        el.innerText = vdom.props.value;
      }
    }

    if (vdom.children) {
      vdom.children.forEach((child) => this.render(el, child));
    }

    if (vdom.props.events) {
      Object.entries(vdom.props.events).forEach(([event, action]) => {
        if (!this.componentScript[action]) {
          console.error(`not found script action ${action}}`);
        } else {
          el.addEventListener(event, this.componentScript[action]);
        }
      });
    }

    root.appendChild(el);
  }

  public updateNodes(obj: any, value: any) {
    const proxy = reactiveProxy.get(obj);
    const nodes: any[] = reactiveNodes.get(proxy);
    console.log("obj", obj, proxy, nodes);

    if (!nodes) return;

    nodes.forEach(([type, node]) => {
      if (type === patchNode.PATCH_VALUE) {
        node.textContent = value;
      }
    });
  }
}
