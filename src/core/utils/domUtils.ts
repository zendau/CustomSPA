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

function findNeighborNode(children: IVDOMElement[], pos: number) {
  if (!children) return SPA.root; // temp

  for (let i = pos - 1; i !== 0; i--) {
    const child = children[i];

    if (child.el && document.contains(child.el)) return child.el;
  }

  return SPA.root;
}

export function findNeighborVDOM(
  children: IVDOMElement[] | undefined,
  findNode: string
) {
  if (!children) return;

  if (children.length === 1)
    return findNeighborVDOM(children[0].children, findNode);

  const [tag, componentId] = findNode.split(":");

  for (let i = 0; i < children.length; i++) {
    let child = children[i];

    if (child.tag === tag) {
      if (
        child.componentId &&
        child.componentId === componentId &&
        SPA.components.has(`${child.tag}:${child.componentId}`)
      ) {
        child = SPA.components.get(`${child.tag}:${child.componentId}`)!.vdom;
      }
      const lastNeighborNode = findNeighborNode(children, i);
      return { lastNeighborNode, vdom: child };
    }
  }
}
