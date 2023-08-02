export type eventTypes = "click" | "input";

type IComponentProps = Record<string, any>;

interface IVDOMProps {
  id?: string;
  class?: string[];
  dataset?: Record<string, any>;
  events?: Partial<Record<eventTypes, string>>;
  value?: string | string[];
  componentProps?: IComponentProps;
}

export interface IVDOMElement {
  props: IVDOMProps;
  tag: string;
  children?: IVDOMElement[];
}
