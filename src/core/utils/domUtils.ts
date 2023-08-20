import {
  lastNeighborNode,
  lastVDOMElement,
} from "@core/interfaces/componentType";
import { SPA } from "../SPA";
import { IVDOMElement } from "../interfaces/IVDOMElement";

export function clearNodes(nodes?: IVDOMElement[]) {
  if (!nodes) return;

  nodes.forEach((node) => {
    if (node.el) {
      node.el.remove();
    } else {
      if (SPA.components.has(`${node.tag}:${node.componentId}`)) {
        const component = SPA.components.get(`${node.tag}:${node.componentId}`);

        if (!component) {
          console.error(`component - ${node} is not found`);
          return;
        }

        clearNodes(component.vdom.children![0].children);

        if (component.onUnmounted) {
          component.onUnmounted();
        }
      }
    }
  });
}

// function qqq(parentVDOM: IVDOMElement, prevVDOM: IVDOMElement) {
//   if (!parentVDOM || !parentVDOM.children) return;

//   const prevIndex = parentVDOM.children.indexOf(prevVDOM);

//   for (let i = prevIndex - 1; i >= 0; i--) {
//     const child = parentVDOM.children[i];

//     if (child === parentVDOM) continue;

//     if (child.el && document.contains(child.el)) return child.el;
//   }

//   if (parentVDOM.parentVDOM) {
//     return qqq(parentVDOM.parentVDOM, parentVDOM);
//   }
// }

function findNeighborNode(vdom: IVDOMElement, pos?: number): lastNeighborNode {
  debugger;
  if (!vdom || !vdom.children) return ["append", SPA.root]; // temp

  if (typeof pos === "undefined") pos = vdom.children.length;

  for (let i = pos - 1; i >= 0; i--) {
    const child = vdom.children[i];

    if (child.el && document.contains(child.el)) return ["after", child.el];
  }

  for (let i = pos + 1; i < vdom.children.length; i++) {
    const child = vdom.children[i];

    if (child.el && document.contains(child.el)) return ["before", child.el];
  }

  return ["append", SPA.root];
}

export function findNeighborVDOMComponent(
  vdom: IVDOMElement | undefined,
  findNode: string
) {
  if (!vdom || !vdom.children) return;

  const [tag, componentId] = findNode.split(":");

  for (let i = 0; i < vdom.children.length; i++) {
    let child = vdom.children[i];

    if (child.tag === tag) {
      if (
        child.componentId &&
        child.componentId === componentId &&
        SPA.components.has(`${child.tag}:${child.componentId}`)
      ) {
        child = SPA.components.get(`${child.tag}:${child.componentId}`)!.vdom;
      }
      const lastNeighborNode = findNeighborNode(vdom, i);
      return { lastNeighborNode, vdom: child };
    }
  }
  return findNeighborVDOMComponent(vdom.children[0], findNode);
}

export function findNeighborVDOMNode(
  vdom: IVDOMElement | undefined,
  findNode: HTMLElement
): lastVDOMElement | undefined {
  if (!vdom || !vdom.children) return;

  for (let i = 0; i < vdom.children.length; i++) {
    let child = vdom.children[i];

    if (child.el === findNode) {
      const lastNeighborNode = findNeighborNode(vdom, i);
      return { lastNeighborNode, vdom: child };
    }

    if (child.children) {
      const resData: lastVDOMElement | undefined = findNeighborVDOMNode(
        vdom.children[0],
        findNode
      );

      if (resData) {
        return resData;
      }
    }
  }
}
