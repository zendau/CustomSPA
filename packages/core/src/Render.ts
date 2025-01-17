import { SPA } from "./SPA";
import { IVDOMElement } from "./interfaces/IVDOMElement";
import { reactiveNodes } from "./reactivity";
import {
  PatchNodeType,
  insertVDOMType,
  reactiveGetter,
  reactiveNode,
} from "./interfaces/typeNodes";
import { ComponentProps, IComponent } from "./interfaces/componentType";
import removeArrayObject from "./utils/removeArrayObject";
import getRandomValue from "./utils/getRandomValue";
import { ComponentThree } from "./ComponentThree";
import { inject } from "./apiInject";

export default class RenderVDOM {
  private componentProps?: Partial<IComponent>;
  private componentThreeData!: ComponentThree;
  private _componentId!: string;
  private componentName!: string;

  constructor(
    componentName: string,
    componentId: string | null,
    componentThreeData: ComponentThree,
    componentProps?: Partial<IComponent>
  ) {
    this.componentProps = componentProps;
    this.componentThreeData = componentThreeData;

    this._componentId = componentId ?? "";
    this.componentName = componentName;
  }

  private getTagValue(tagData: string, el: HTMLElement) {
    const reactiveRegex = /\{([^}]+)\}/g;
    const store = inject("store");

    const checkSplit = tagData.split(reactiveRegex);

    if (checkSplit.length === 1) {
      const textNode = document.createTextNode(tagData);
      el.appendChild(textNode);
      return;
    }

    const checkReactive = tagData
      .match(reactiveRegex)!
      .map((item) => item.slice(1, -1));

    for (let reactiveData of checkSplit) {
      if (!reactiveData) continue;
      if (reactiveData === "children") {
        if (this.componentProps?.data && this.componentProps.data["children"]) {
          const childVDOM = this.componentProps.data["children"];

          this.insertVDOM(childVDOM, el, "append");
        }

        continue;
      }

      let reactiveVariable: string | undefined = reactiveData;

      let reactiveProvider: reactiveGetter = () => {};

      const isReactive = checkReactive.indexOf(reactiveData);

      let nodes = null;

      if (this.componentProps?.data && isReactive !== -1) {
        if (reactiveData.includes(".")) {
          const dotReactiveData = reactiveData.split(".");
          reactiveProvider = (() => {
            const test = { ...this.componentProps?.data };
            return function () {
              if (!test) return;
              return dotReactiveData.reduce(
                (prev, curr) => prev[curr],
                test
              ) as unknown as string | undefined;
            };
          })();
          try {
            reactiveVariable = dotReactiveData.reduce(
              (prev, curr) => prev[curr],
              this.componentProps.data
            ) as unknown as string | undefined;
          } catch {
            reactiveVariable = undefined;
          }

          reactiveData = dotReactiveData[0];

          let propsReactiveData = this.componentProps.data[reactiveData];

          if (store) {
            if (store === propsReactiveData && dotReactiveData[1]) {
              propsReactiveData = propsReactiveData[dotReactiveData[1]]?.state;
            } else if (Object.values(store).includes(propsReactiveData)) {
              propsReactiveData = propsReactiveData?.state;
            }
          }
          nodes = reactiveNodes.get(propsReactiveData);
        } else {
          reactiveVariable = this.componentProps.data[reactiveData];
          reactiveProvider = () => this.componentProps?.data?.[reactiveData];

          if (
            reactiveVariable &&
            Object.prototype.hasOwnProperty.call(reactiveVariable, "_root")
          ) {
            nodes = reactiveNodes.get((reactiveVariable as any)["_root"]);
          } else {
            nodes = reactiveNodes.get(reactiveVariable as unknown as object);
          }
        }
      }

      if (
        !reactiveVariable &&
        this.componentProps?.data &&
        !this.componentProps.data.hasOwnProperty(reactiveData)
      ) {
        console.error(`unknown reactive value ${reactiveData} in ${tagData}`);
        return;
      }

      const textNode = document.createTextNode(reactiveVariable + "");

      if (nodes) {
        nodes.push([
          PatchNodeType.PATCH_VALUE,
          textNode,
          this.componentName,
          reactiveProvider,
        ]);
      }

      el.appendChild(textNode);
    }
  }

  public insertVDOM(
    vdom: IVDOMElement,
    node: HTMLElement,
    type: insertVDOMType
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
    } else if (type === "replace") {
      node.replaceChildren(...tempContainer.children);
    }
  }

  public render(vdom: IVDOMElement, root: HTMLElement) {
    if (!root) return;

    const isEmptyTag = !vdom.tag;

    if (vdom.slot) {
      console.log("RENDER SLOT", vdom.slot);
    }

    if (this.componentProps?.components) {
      const ifReactive =
        vdom.props.if !== undefined
          ? this.componentProps.data![vdom.props.if]
          : undefined;

      const componentElementIndex = Object.keys(
        this.componentProps.components
      ).indexOf(vdom.tag);
      if (componentElementIndex !== -1) {
        vdom.componentId = getRandomValue();

        let ifNodes = ifReactive ? reactiveNodes.get(ifReactive) : undefined;

        if (ifNodes) {
          ifNodes.push([
            PatchNodeType.PATCH_IF_COMPONENT,
            `${vdom.tag}:${vdom.componentId}`,
            this.componentName,
          ]);
        }

        if (ifReactive?._isRef === true && ifReactive?.value === false) return;
        const checkReactionProps = () => {
          const props = vdom.props.componentProps;

          const newProps: any = {};

          if (!props || !this.componentProps?.data) return;

          Object.keys(props).forEach((key) => {
            const propValue = props[key];

            if (this.componentProps!.data!.hasOwnProperty(propValue)) {
              newProps[key] = this.componentProps?.data![propValue];
            }
          });

          if (this.componentProps!.data!.hasOwnProperty("key")) {
            newProps["key"] = this.componentProps.data["key"];
          }

          return newProps;
        };

        const props = checkReactionProps();

        SPA.setupComponent(
          this.componentProps?.components[vdom.tag],
          root,
          vdom.componentId,
          "append",
          this.componentThreeData,
          props as ComponentProps
        );

        return;
      }
    }

    let el: HTMLElement;

    if (!isEmptyTag) {
      el = document.createElement(vdom.tag);

      el.dataset.c = this._componentId;

      if (!Array.isArray(vdom.el)) {
        vdom.el = el;
      }

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

    if (vdom.props.href) {
      (el as HTMLAnchorElement).href = vdom.props.href;
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
          this.componentName,
        ]);

      if (ifReactive?._isRef === true && ifReactive?.value === false) return;
    }

    if (vdom.props.value) {
      this.getTagValue(vdom.props.value, el);
    }

    if (vdom.props.events && this.componentProps?.data) {
      Object.entries(vdom.props.events).forEach(([event, action]) => {
        if (!this.componentProps!.data![action]) {
          console.error(`not found script action ${action}`);
        } else {
          el.addEventListener(event, this.componentProps!.data![action]);
        }
      });
    }

    if (vdom.props.for) {
      root.childNodes[root.childNodes.length - 1].remove();

      const reactiveFor =
        this.componentProps?.data![vdom.props.for.at(-1) as string];

      const nodes = reactiveNodes.get(reactiveFor);

      const createdForNodes: HTMLElement[] = [];


      reactiveFor.forEach((data: any, index: number) => {
        if (vdom.children && vdom.children.length > 0) {
          const forNode = el.cloneNode() as HTMLElement;

          const key = vdom.props.for![0];

          if (!this.componentProps) this.componentProps = { data: {} };
          if (!this.componentProps.data) this.componentProps.data = {};

          vdom.children.forEach((child) => {
            this.componentProps!.data![key] = data;
            this.componentProps!.data!["key"] = index;
            this.render(child, forNode);
          });

          createdForNodes.push(forNode);

          root.appendChild(forNode);

          delete this.componentProps.data[key];
        }
      });
      if (createdForNodes.length > 0) {
        vdom.el = createdForNodes;
      }

      if (!nodes || !vdom.el) {
        console.error(
          `Wrong nodes array - ${nodes} or undefined dom element - ${vdom.el}`
        );
        return;
      }

      nodes.push([PatchNodeType.PATCH_FOR, vdom.el, this.componentName]);

      return;
    }
    if (vdom.children && vdom.children.length > 0) {
      vdom.children.forEach((child) => this.render(child, el));
    }
  }

  get componentId(): string {
    return this._componentId;
  }
}
