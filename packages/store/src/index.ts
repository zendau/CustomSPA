import { SPA, IExternalModule } from "@spa/core";
export { default as createModule } from "./createModule";

class Store<T> implements IExternalModule {
  private appStore!: T;

  constructor(store: T) {
    this.appStore = store;
  }

  public init(app: SPA) {
    app.appProvideData("store", this.appStore);
  }
}

export function createStore<T>(store: T) {
  const storeInstance = new Store(store);

  const defaultStore = { ...store };

  function useResetStore() {
    store = defaultStore;
  }

  function useStore() {
    return store;
  }

  return {
    storeInstance,
    useResetStore,
    useStore,
  };
}
