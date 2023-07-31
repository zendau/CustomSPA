import { reactiveNodes, reactiveProxy } from "./reactivity";

enum patchNode {
  PATCH_VALUE = "PATCH_VALUE",
  PATCH_CLASS = "PATCH_CLASS",
  PATCH_STYLE = "PATCH_STYLE",
}

export default function updateNodes(obj: any, value: any) {
  const proxy = reactiveProxy.get(obj);
  const nodes: any[] = reactiveNodes.get(proxy);
  console.log("obj", obj, proxy, nodes);

  if (!nodes) return;

  nodes.forEach(([type, node]) => {
    if (type === patchNode.PATCH_VALUE) {
      node.textContent = value;
    }
  });
}
