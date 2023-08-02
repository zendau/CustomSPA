import "./style.css";
import { IVDOMElement } from "./interfaces/IVDOMElement";
import { FnComponent } from "./interfaces/componentData";
import App from "./app/components/App";
import Parser from "./core/Parser";
import RenderVDOM from "./core/Render";
import { Emmiter } from "./core/Emitter";

class SPA {
  private root!: HTMLElement;
  private parser!: Parser;
  private render!: RenderVDOM;
  private emitter!: Emmiter;

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

  private setupComponent(component: FnComponent, root: HTMLElement) {
    const [template, script] = component();

    this.parser = new Parser(template, script);
    this.render = new RenderVDOM(script);
    const vdom = this.parser.genereteVDOM() as IVDOMElement;
    this.render.render(root, vdom);
  }

  private mount(component: FnComponent) {
    this.setupComponent(component, this.root);
  }
}

const appRoot = document.getElementById("app");

new SPA(appRoot, App);

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
// testReactivity.children[0].value = "12331";
// console.log("test", testReactivity);
// reactivity({ a: "test" });
