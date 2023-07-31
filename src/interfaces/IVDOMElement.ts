export type eventTypes = "click" | "input";

interface IVDOMProps {
  id?: string;
  class?: string[];
  dataset?: Record<string, any>;
  events?: Partial<Record<eventTypes, string>>;
  value?: string | string[];
}

export interface IVDOMElement {
  props: IVDOMProps;
  tag: string;
  children?: IVDOMElement[];
}
