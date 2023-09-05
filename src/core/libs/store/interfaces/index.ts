export type RemoveFirstParameter<T> = T extends (
  firstArg: any,
  ...rest: infer U
) => any
  ? (...args: U) => ReturnType<T>
  : T;

export type _Method = (...args: any[]) => any;
export type _ActionsTree = Record<string, _Method>;

export interface IStore<State, Actions> {
  state: State;
  actions: Actions;
}

export interface IModule<State, Actions> {
  state: State;
  actions: {
    [K in keyof Actions]: RemoveFirstParameter<Actions[K]>;
  };
}