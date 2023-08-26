import { reactiveNode } from "@core/interfaces/typeNodes";

export default function (nodes: reactiveNode[], node: reactiveNode) {
  const nodeIndex = nodes.indexOf(node);

  if (nodeIndex !== -1) {
    nodes.splice(nodeIndex, 1);
  }
}
