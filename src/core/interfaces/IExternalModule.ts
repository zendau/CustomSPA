import { SPA } from "@core/SPA";

export default interface IExternalModule {
  [x: string]: any;
  init(app: SPA): void;
}
