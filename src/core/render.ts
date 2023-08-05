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
      this.emitter.subscribe("render:update", this.updateNodes.bind(this));

      RenderVDOM.isRenderSubscribe = true;
    }
  }

  private getTagValue(tagData: string, el: HTMLElement) {
    const reactiveRegex = /\{([^}]+)\}/g;

    const checkSplite = tagData.split(reactiveRegex);

    if (checkSplite.length === 1) {
      const textNode = document.createTextNode(tagData);
      el.appendChild(textNode);
      return;
    }

    const checkReactive = tagData
      .match(reactiveRegex)!
      .map((item) => item.slice(1, -1));

    for (const reactiveData of checkSplite) {
      if (!reactiveData) continue;
      let reactiveVariable = reactiveData;

      const isReactive = checkReactive.indexOf(reactiveData);

      if (isReactive !== -1) {
        reactiveVariable = this.componentScript[reactiveData];
      }

      if (!reactiveVariable) {
        console.error(`unknown reactive value ${reactiveData} in ${tagData}`);
        return;
      }
      const textNode = document.createTextNode(reactiveVariable);

      const nodes = reactiveNodes.get(reactiveVariable);

      if (nodes) {
        nodes.push([patchNode.PATCH_VALUE, textNode]);
      }

      // tagData = tagData.replace(reactiveData, reactiveProxy);

      el.appendChild(textNode);
    }
    // const reactiveRegex = /\{([^}]+)\}/g;
    // const checkReactive = tagData.match(reactiveRegex);

    // if (!checkReactive) return tagData;

    // checkReactive.forEach((reactiveData) => {
    //   const reactiveVariable = reactiveData.slice(1, -1);

    //   const reactiveProxy = this.componentScript[reactiveVariable];

    //   if (!reactiveProxy) {
    //     console.error(
    //       `unknown reactive value ${reactiveVariable} in ${tagData}`
    //     );
    //     return;
    //   }

    //   const nodes = reactiveNodes.get(reactiveProxy);

    //   if (nodes && el) {
    //     nodes.push([patchNode.PATCH_VALUE, el, tagData, reactiveVariable]);
    //   }

    //   tagData = tagData.replace(reactiveData, reactiveProxy);
    // });

    // return tagData;
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
        root,
        vdom.props.componentProps
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
      debugger;

      this.getTagValue(vdom.props.value, el);
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

    console.log("NODES", nodes);
    debugger;
    if (!nodes) return;

    nodes.forEach(([type, node, oldValue]) => {
      if (type === patchNode.PATCH_VALUE) {
        node.data = value;
      }
    });
  }
}
