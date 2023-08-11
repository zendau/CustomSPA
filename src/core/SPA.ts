import { IVDOMElement } from "@core/interfaces/IVDOMElement";
import {
  ComponentData,
  ComponentProps,
  FnComponent,
} from "@core/interfaces/componentType";
import Parser from "@core/Parser";
import RenderVDOM from "@core/Render";
import { Emmiter } from "@core/Emitter";
import { reactiveNodes, reactiveProxy } from "./reactivity";
import { patchNode } from "./interfaces/typeNodes";

export default class SPA {
  private root!: HTMLElement;
  private parser!: Parser;
  private render!: RenderVDOM;
  private emitter!: Emmiter;
  private static components = new Map();

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

    const parser = new Parser(template, props);
    const render = new RenderVDOM(props);
    const vdom = parser.genereteVDOM() as IVDOMElement;

    render.render(root, vdom);

    SPA.components.set(component.name, {
      vdom,
      rerender: () => {
        render.render(root, vdom);
      },
    });

    // console.log("THIS");

    // function handleElementRemoval(mutationsList: any, observer: any) {
    //   console.log("mutationsList", observer, mutationsList, root);
    //   mutationsList.forEach((mutation: any) => {
    //     if (mutation.type === "childList" && mutation.removedNodes.length > 0) {
    //       // Здесь можно выполнить нужные действия при удалении элемента
    //       console.log("DOM-элемент был удален:", mutation.removedNodes[0]);
    //     }
    //   });
    // }
    // const observer = new MutationObserver(handleElementRemoval);

    // // Наблюдаем за изменениями в DOM-дереве
    // const options = { childList: true, subtree: true };
    // observer.observe(root, options);
  }

  public static updateNodes(obj: any, value: any) {
    const proxy = reactiveProxy.get(obj);

    if (!proxy) {
      console.error(`proxy object not found ${obj}`);
      return;
    }

    const nodes = reactiveNodes.get(proxy);

    if (!nodes) return;

    function clear(nodes: any) {
      nodes.forEach((node: any) => {
        if (node.el) {
          node.el.remove();
        } else {
          if (SPA.components.has(node.tag)) {
            clear(SPA.components.get(node.tag).vdom.children[0].children);
          }
        }
      });
    }

    nodes.forEach(([type, node]) => {
      if (type === patchNode.PATCH_VALUE && node instanceof Text) {
        node.data = value;
      } else if (type === patchNode.PATCH_IF) {
        if (value) {
          console.log("ADD");
          SPA.components.get(node).rerender();
        } else {
          clear(SPA.components.get(node).vdom.children[0].children);
        }
      }
    });
  }

  private mount(component: FnComponent) {
    const nodes = this.setupComponent(component, this.root);
    // this.root.append(...nodes);
  }
}
