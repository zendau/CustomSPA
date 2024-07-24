import { SPA } from "../SPA";

export interface IExternalModule {
  [x: string]: any;
  init(app: SPA): void;
}
