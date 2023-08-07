import { IVDOMElement } from "@core/interfaces/IVDOMElement";
import { Emmiter } from "@core/Emitter";
import { reactiveNodes, reactiveProxy } from "@core/reactivity";
import { patchNode } from "@core/interfaces/typeNodes";
import { IComponent } from "@core/interfaces/componentType";

export default class RenderVDOM {
  private componentProps?: Partial<IComponent>;
  private static isRenderSubscribe = false;
  private emitter!: Emmiter;

  constructor(componentProps?: Partial<IComponent>) {
    this.componentProps = componentProps;

    this.emitter = Emmiter.getInstance();

    if (!RenderVDOM.isRenderSubscribe) {
      this.emitter.subscribe("render:update", this.updateNodes.bind(this));

      RenderVDOM.isRenderSubscribe = true;
    }
  }

  private getTagValue(tagData: string, el: HTMLElement) {
    const reactiveRegex = /\{([^}]+)\}/g;

    const checkSplit = tagData.split(reactiveRegex);

    if (checkSplit.length === 1) {
      const textNode = document.createTextNode(tagData);
      el.appendChild(textNode);
      return;
    }

    const checkReactive = tagData
      .match(reactiveRegex)!
      .map((item) => item.slice(1, -1));

    for (const reactiveData of checkSplit) {
      if (!reactiveData) continue;
      let reactiveVariable = reactiveData;

      debugger;
      const isReactive = checkReactive.indexOf(reactiveData);

      if (this.componentProps?.data && isReactive !== -1) {
        reactiveVariable = this.componentProps.data[reactiveData];
      }

      if (!reactiveVariable) {
        console.error(`unknown reactive value ${reactiveData} in ${tagData}`);
        return;
      }
      const textNode = document.createTextNode(reactiveVariable);

      const nodes = reactiveNodes.get(reactiveVariable as unknown as object);

      if (nodes) {
        nodes.push([patchNode.PATCH_VALUE, textNode]);
      }

      el.appendChild(textNode);
    }
  }

  public render(root: HTMLElement | null, vdom: IVDOMElement) {
    if (!root) return;

    const isEmptyTag = !!vdom.tag;

    if (this.componentProps?.components) {
      const componentElementIndex = Object.keys(
        this.componentProps.components
      ).indexOf(vdom.tag);
      if (componentElementIndex !== -1) {
        this.emitter.emit(
          "app:setupComponent",
          this.componentProps?.components[vdom.tag],
          root,
          vdom.props.componentProps
        );

        return;
      }
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
      this.getTagValue(vdom.props.value, el);
    }

    if (vdom.children) {
      vdom.children.forEach((child) => this.render(el, child));
    }

    if (vdom.props.events && this.componentProps?.data) {
      Object.entries(vdom.props.events).forEach(([event, action]) => {
        if (!this.componentProps!.data![action]) {
          console.error(`not found script action ${action}}`);
        } else {
          el.addEventListener(event, this.componentProps!.data![action]);
        }
      });
    }
    if (isEmptyTag) root.appendChild(el);
  }

  public updateNodes(obj: any, value: any) {
    const proxy = reactiveProxy.get(obj);

    if (!proxy) {
      console.error(`proxy object not found ${obj}`);
      return;
    }

    const nodes = reactiveNodes.get(proxy);

    if (!nodes) return;

    nodes.forEach(([type, node]) => {
      if (type === patchNode.PATCH_VALUE) {
        node.data = value;
      }
    });
  }
}
