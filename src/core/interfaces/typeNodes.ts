export enum PatchNodeType {
  PATCH_VALUE = "PATCH_VALUE",
  PATCH_CLASS = "PATCH_CLASS",
  PATCH_STYLE = "PATCH_STYLE",
  PATCH_IF = "PATCH_IF",
  PATCH_FOR = "PATCH_FOR",
}

export type VDOMNode = Text | HTMLElement | string | HTMLElement[];
export type reactiveNode = [PatchNodeType, VDOMNode, string];

export type insertVDOMTypes = "insert" | "append";
