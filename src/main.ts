import "./style.css";
import htmlParser from "./core/parser";
import { IVDOMElement } from "./interfaces/IVDOMElement";
import { reactiveProxy, reactiveNodes, reactivity } from "./core/reactivity";
import { FnComponent } from "./interfaces/componentData";
import App from "./app/components/App";
import Parser from "./core/parser";
import RenderVDOM from "./core/render";

class SPA {
  private root!: HTMLElement;
  private parser!: Parser;
  private render!: RenderVDOM;

  constructor(root: HTMLElement | null, mainComponent: FnComponent) {
    if (!root) return;

    this.root = root;

    this.mount(mainComponent);
  }

  private mount(component: FnComponent) {
    const [template, script] = component();
    this.parser = new Parser(template);

    const vdom = this.parser.genereteVDOM() as IVDOMElement;
    this.render = new RenderVDOM(script);
    this.render.render(this.root, vdom);

    console.log("test", vdom, script);
  }
}

const appRoot = document.getElementById("app");

const app = new SPA(appRoot, App);

// function testEvent() {
//   console.log("click test");
// }

// const componentData: Record<string, any> = {
//   testEvent,
// };

// const vDOME: IVDOMElement = {
//   tag: "div",
//   class: ["box"],
//   children: [
//     {
//       value: "test element",
//       tag: "p",
//       class: ["red"],
//     },
//   ],
//   dataset: {
//     count: 5,
//   },
//   events: { click: "testEvent" },
// };

// render(appRoot, vDOME);
// const resParse = htmlParser();
// console.log("resParse", resParse);
// const testReactivity: any = reactivity(vDOME);
// console.log("121313", reactiveNodes, reactiveProxy);
// testReactivity.children[0].value = "12331";
// console.log("test", testReactivity);
// reactivity({ a: "test" });
