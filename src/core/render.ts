import { IVDOMElement } from "@core/interfaces/IVDOMElement";
import { Emmiter } from "@core/Emitter";
import { reactiveNodes } from "@core/reactivity";
import { PatchNodeType, insertVDOMTypes } from "@core/interfaces/typeNodes";
import { IComponent } from "@core/interfaces/componentType";

export default class RenderVDOM {
  private componentProps?: Partial<IComponent>;
  private emitter!: Emmiter;
  private componentName!: string;
  private componentId: string;

  constructor(
    componentName: string,
    componentId: string,
    componentProps?: Partial<IComponent>
  ) {
    this.componentProps = componentProps;
    this.componentName = componentName;

    this.componentId = componentId;

    this.emitter = Emmiter.getInstance();
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
      let reactiveVariable: string | undefined = reactiveData;

      const isReactive = checkReactive.indexOf(reactiveData);

      let nodes = null;

      if (this.componentProps?.data && isReactive !== -1) {
        if (reactiveData.includes(".")) {
          const dotReactiveData = reactiveData.split(".");

          reactiveVariable = dotReactiveData.reduce(
            (prev, curr) => prev[curr],
            this.componentProps.data
          ) as unknown as string | undefined;

          nodes = reactiveNodes.get(
            this.componentProps.data[dotReactiveData[0]]
          );
        } else {
          reactiveVariable = this.componentProps.data[reactiveData];

          nodes = reactiveNodes.get(reactiveVariable as unknown as object);
        }
      }

      if (!reactiveVariable) {
        console.error(`unknown reactive value ${reactiveData} in ${tagData}`);
        return;
      }
      const textNode = document.createTextNode(reactiveVariable);

      if (nodes) {
        nodes.push([
          PatchNodeType.PATCH_VALUE,
          textNode,
          `${this.componentName}:${this.componentId}`,
        ]);
      }

      el.appendChild(textNode);
    }
  }

  public insertVDOM(
    vdom: IVDOMElement,
    node: HTMLElement,
    type: insertVDOMTypes
  ) {
    const tempContainer = document.createElement("div");

    this.render(vdom, tempContainer);

    if (type === "append") {
      Array.from(tempContainer.children).forEach((child) =>
        node.appendChild(child)
      );
    } else if (type === "after") {
      for (let i = tempContainer.children.length - 1; i >= 0; i--) {
        const child = tempContainer.children[i];

        node.after(child);
      }
    } else if (type === "before") {
      for (let i = tempContainer.children.length - 1; i >= 0; i--) {
        const child = tempContainer.children[i];

        node.before(child);
      }
    }
  }

  public render(vdom: IVDOMElement, root: HTMLElement) {
    if (!root) return;

    const isEmptyTag = !vdom.tag;

    if (this.componentProps?.components) {
      const ifReactive =
        vdom.props.if !== undefined
          ? this.componentProps.data![vdom.props.if]
          : undefined;

      const componentElementIndex = Object.keys(
        this.componentProps.components
      ).indexOf(vdom.tag);
      if (componentElementIndex !== -1) {
        const componentId = window.crypto.randomUUID();
        vdom.componentId = componentId;

        let ifNodes = ifReactive ? reactiveNodes.get(ifReactive) : undefined;

        if (ifNodes)
          ifNodes.push([
            PatchNodeType.PATCH_IF_COMPONENT,
            `${vdom.tag}:${vdom.componentId}`,
            `${this.componentName}:${this.componentId}`,
          ]);

        if (ifReactive?._isRef === true && ifReactive?.value === false) return;

        this.emitter.emit(
          "app:setupComponent",
          this.componentProps?.components[vdom.tag],
          root,
          componentId,
          vdom.props.componentProps
        );

        return;
      }
    }

    let el: HTMLElement;

    if (!isEmptyTag) {
      el = document.createElement(vdom.tag);
      vdom.el = el;

      root.appendChild(el);
    } else {
      el = root;
    }

    if (vdom.props.id) {
      el.id = vdom.props.id;
    }

    if (vdom.props.class) {
      el.classList.add(...vdom.props.class);
    }

    if (vdom.props.if) {
      const ifReactive =
        vdom.props.if !== undefined
          ? this.componentProps!.data![vdom.props.if]
          : undefined;

      let ifNodes = ifReactive ? reactiveNodes.get(ifReactive) : undefined;

      if (ifNodes && vdom.el)
        ifNodes.push([
          PatchNodeType.PATCH_IF_NODE,
          vdom.el,
          `${this.componentName}:${this.componentId}`,
        ]);

      if (ifReactive?._isRef === true && ifReactive?.value === false) return;
    }

    if (vdom.props.value) {
      this.getTagValue(vdom.props.value, el);
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

    if (vdom.props.for) {
      const reactiveFor =
        this.componentProps?.data![vdom.props.for.at(-1) as string];

      const nodes = reactiveNodes.get(reactiveFor);
      const createdForNodes: HTMLElement[] = [];

      reactiveFor.forEach((data: any) => {
        if (vdom.children && vdom.children.length > 0) {
          const forNode = el.cloneNode() as HTMLElement;

          const key = vdom.props.for![0];

          if (!this.componentProps) this.componentProps = { data: {} };
          if (!this.componentProps.data) this.componentProps.data = {};

          this.componentProps.data[key] = data;

          vdom.children.forEach((child) => this.render(child, forNode));

          createdForNodes.push(forNode);

          root.appendChild(forNode);

          delete this.componentProps.data[key];
        }
      });

      if (nodes) {
        nodes.push([
          PatchNodeType.PATCH_FOR,
          createdForNodes,
          `${this.componentName}:${this.componentId}`,
        ]);
      }

      return;
    }
    if (vdom.children && vdom.children.length > 0) {
      vdom.children.forEach((child) => this.render(child, el));
    }
  }
}
