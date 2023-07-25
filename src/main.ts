import "./style.css";
import htmlParser from "./parser";
import { IVDOMElement } from "./interfaces/IVDOMElement";

function testEvent() {
  console.log("click test");
}

const vDOME: IVDOMElement = {
  tag: "div",
  class: ["box"],
  children: [
    {
      value: "test element",
      tag: "p",
      class: ["red"],
    },
  ],
  dataset: {
    count: 5,
  },
  events: [["click", testEvent]],
};

function render(root: HTMLElement | null, vdome: IVDOMElement) {
  if (!root) return;

  const el = document.createElement(vdome.tag);

  if (vdome.id) {
    el.id = vdome.id;
  }

  if (vdome.class) {
    el.classList.add(...vdome.class);
  }

  if (vdome.value) {
    el.innerText = vdome.value;
  }

  if (vdome.children) {
    vdome.children.forEach((child) => render(el, child));
  }

  if (vdome.events) {
    vdome.events.forEach((event) => {
      el.addEventListener(event[0], event[1]);
    });
  }

  root.appendChild(el);
}

const appRoot = document.getElementById("app");
render(appRoot, vDOME);
const resParse = htmlParser();
console.log("resParse", resParse);
