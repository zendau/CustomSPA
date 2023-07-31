import { IVDOMElement } from "../interfaces/IVDOMElement";

function run(component: any) {


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
      Object.entries(vdome.events).forEach(([event, action]) => {
        if (!script[action]) {
          console.error();
        } else {
          el.addEventListener(event, script[action]);
        }
      });
    }

    root.appendChild(el);
  }
}
