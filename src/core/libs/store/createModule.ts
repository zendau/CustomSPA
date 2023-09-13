import { reactivity } from "@SPA";
import {
  IModule,
  IStore,
  RemoveFirstParameter,
  _ActionsTree,
} from "./interfaces";

export default function createModule<State, Actions extends _ActionsTree>(
  options: IStore<State, Actions>
): IModule<State, Actions> {
  debugger;
  const initialState = reactivity(options.state as object) as State;
  const proxyObject: any = {};

  for (const key in options.actions) {
    if (typeof options.actions[key] === "function") {
      proxyObject[key] = new Proxy(options.actions[key], {
        apply: (target: Function, thisArg: any, args: any[]) => {
          return target({ state: initialState, actions: proxyObject }, ...args);
        },
      });
    }
  }

  const actions = proxyObject as {
    [K in keyof Actions]: RemoveFirstParameter<Actions[K]>;
  };

  return {
    state: initialState,
    actions,
  };
}
