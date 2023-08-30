import { FnComponent } from "@core/interfaces/componentType";

export interface IRouterParam {
  value: string;
  param?: IRouterParam;
}

export interface IRoute {
  path: string;
  component: FnComponent;
  param?: IRouterParam;
  children?: IRoute[];
  props?: Record<string, any>;
  isNestedPatams?: boolean;
}