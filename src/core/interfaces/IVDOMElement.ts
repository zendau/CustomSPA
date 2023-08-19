export type eventTypes = "click" | "input";

type IComponentProps = Record<string, any>;

interface IVDOMProps {
  id: string;
  class: string[];
  dataset: Record<string, any>;
  events: Partial<Record<eventTypes, string>>;
  value: string;
  componentProps: IComponentProps;
  if: string;
  for: string[];
}

export interface IVDOMElement {
  el?: HTMLElement;
  props: Partial<IVDOMProps>;
  tag: string;
  children?: IVDOMElement[];
  componentId?: string;
}
