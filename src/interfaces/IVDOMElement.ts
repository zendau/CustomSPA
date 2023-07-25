export type eventTypes = "click" | "input";
type eventAction = [eventTypes, () => void];

export interface IVDOMElement {
  value?: string;
  id?: string;
  class?: string[];
  tag: string;
  children?: IVDOMElement[];
  dataset?: Record<string, any>;
  events?: eventAction[];
}
