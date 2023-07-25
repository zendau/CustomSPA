export type eventTypes = "click" | "input";

export interface IVDOMElement {
  value?: string;
  id?: string;
  class?: string[];
  tag: string;
  children?: IVDOMElement[];
  dataset?: Record<string, any>;
  events?: Partial<Record<eventTypes, string>>;
}
