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
      if (Array.isArray(node.el)) {
        node.el.forEach((el) => el.remove());
      } else {
        node.el.remove();
      }
    } else {
      const componentKey = `${node.tag}:${node.componentId}`;

      if (SPA.components.has(componentKey)) {
        const component = SPA.components.get(componentKey);

        if (!component) {
          console.error(`component - ${node} is not found`);
          return;
        }

        clearNodes(component.vdom.children![0].children);

        if (component.onUnmounted) {
          component.onUnmounted();
        }

        SPA.components.delete(componentKey);
      }
    }
  });
}

function findNeighborNode(vdom: IVDOMElement, pos?: number): lastNeighborNode {
  if (!vdom || !vdom.children) return ["append", SPA.root]; // temp

  if (typeof pos === "undefined") pos = vdom.children.length;

  for (let i = pos - 1; i >= 0; i--) {
    const child = vdom.children[i];

    if (child.el && !Array.isArray(child.el) && document.contains(child.el))
      return ["after", child.el];
  }

  for (let i = pos + 1; i < vdom.children.length; i++) {
    const child = vdom.children[i];

    if (child.el && !Array.isArray(child.el) && document.contains(child.el))
      return ["before", child.el];
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

    if (
      child.el === findNode ||
      (Array.isArray(child.el) && child.el.includes(findNode))
    ) {
      const lastNeighborNode = findNeighborNode(vdom, i);
      return { lastNeighborNode, vdom: child };
    }

    if (child.children && child.children.length > 1) {
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
