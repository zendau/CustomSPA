import { IVDOMElement } from "./IVDOMElement";

export enum PatchNodeType {
  PATCH_VALUE = "PATCH_VALUE",
  PATCH_CLASS = "PATCH_CLASS",
  PATCH_STYLE = "PATCH_STYLE",
  PATCH_IF_COMPONENT = "PATCH_IF_COMPONENT",
  PATCH_IF_NODE = "PATCH_IF_NODE",
  PATCH_FOR = "PATCH_FOR",
}

export type VDOMNode =
  | Text
  | HTMLElement
  | string
  | HTMLElement[]
  | IVDOMElement;
export type reactiveGetter = () => any;
export type reactiveNode = [PatchNodeType, VDOMNode, string, reactiveGetter?];

export type insertVDOMType = "after" | "before" | "append" | "replace";
