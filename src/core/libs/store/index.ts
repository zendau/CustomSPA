import { SPA } from "@SPA";
import IExternalModule from "@core/interfaces/IExternalModule";

class Store<T> implements IExternalModule {
  constructor(store: T) {}

  public init(app: SPA) {}
}

export default function createStore<T>(store: T) {
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
