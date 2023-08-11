export enum patchNode {
  PATCH_VALUE = "PATCH_VALUE",
  PATCH_CLASS = "PATCH_CLASS",
  PATCH_STYLE = "PATCH_STYLE",
  PATCH_IF = "PATCH_IF",
}

// export type reactiveNode = [patchNode, Text | HTMLElement];
export type reactiveNode = any;
