import { ComponentThreeController } from "@core/ComponentThree";

export const componentController = new ComponentThreeController();

export function provide(key: string, data: any) {
  if (!componentController.currentNode) return;
  componentController.currentNode.addProvideValue(key, data);
}

export function inject(key: string) {
  if (!componentController.currentNode) return;
  return componentController.currentNode.findInjectValue(key);
}
