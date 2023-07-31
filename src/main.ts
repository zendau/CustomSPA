import "./style.css";
import htmlParser from "./core/parser";
import { IVDOMElement } from "./interfaces/IVDOMElement";
import { reactiveProxy, reactiveNodes, reactivity } from "./core/reactivity";

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

// const appRoot = document.getElementById("app");
// render(appRoot, vDOME);
// const resParse = htmlParser();
// console.log("resParse", resParse);
// const testReactivity: any = reactivity(vDOME);
// console.log("121313", reactiveNodes, reactiveProxy);
// testReactivity.children[0].value = "12331";
// console.log("test", testReactivity);
// reactivity({ a: "test" });
