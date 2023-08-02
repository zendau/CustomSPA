import { IVDOMElement } from "../interfaces/IVDOMElement";
import { Emmiter } from "./Emitter";
import { reactiveNodes, reactiveProxy } from "./reactivity";
import getObjectFromPath from "./utils/getObjectFromPath";

enum patchNode {
  PATCH_VALUE = "PATCH_VALUE",
  PATCH_CLASS = "PATCH_CLASS",
  PATCH_STYLE = "PATCH_STYLE",
}

export default class RenderVDOM {
  private componentScript!: Record<string, any>;
  private static isRenderSubscribe = false;
  private emitter!: Emmiter;

  constructor(script: Record<string, any>) {
    this.componentScript = script;

    this.emitter = Emmiter.getInstance();

    if (!RenderVDOM.isRenderSubscribe) {
      this.emitter.subscribe("render:update", this.updateNodes);

      RenderVDOM.isRenderSubscribe = true;
    }
  }

  public render(root: HTMLElement | null, vdom: IVDOMElement) {
    if (!root) return;

    const isEmptyTag = !!vdom.tag;

    const componentElementIndex = Object.keys(this.componentScript).indexOf(
      vdom.tag
    );
    if (componentElementIndex !== -1) {
      this.emitter.emit(
        "app:setupComponent",
        this.componentScript[vdom.tag],
        root
      );

      return;
    }

    let el: HTMLElement;

    if (isEmptyTag) {
      el = document.createElement(vdom.tag);
    } else {
      el = root;
    }

    if (vdom.props.id) {
      el.id = vdom.props.id;
    }

    if (vdom.props.class) {
      el.classList.add(...vdom.props.class);
    }

    if (vdom.props.value) {
      if (Array.isArray(vdom.props.value)) {
        const reactiveData = getObjectFromPath(
          this.componentScript,
          vdom.props.value[0]
        );

        const nodes = reactiveNodes.get(reactiveData);

        if (nodes) {
          nodes.push([patchNode.PATCH_VALUE, el]);
        }

        el.innerHTML = reactiveData;
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
    if (isEmptyTag) root.appendChild(el);
  }

  public updateNodes(obj: any, value: any) {
    const proxy = reactiveProxy.get(obj);
    const nodes: any[] = reactiveNodes.get(proxy);

    if (!nodes) return;

    nodes.forEach(([type, node]) => {
      if (type === patchNode.PATCH_VALUE) {
        node.textContent = value;
      }
    });
  }
}
