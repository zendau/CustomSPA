export enum patchNode {
  PATCH_VALUE = "PATCH_VALUE",
  PATCH_CLASS = "PATCH_CLASS",
  PATCH_STYLE = "PATCH_STYLE",
}

export type reactiveNode = [patchNode, Text];
