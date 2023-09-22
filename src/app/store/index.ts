import createStore from "@core/libs/store";
import first from "./modules/first";
import second from "./modules/second";

const { useStore, storeInstance } = createStore({
  first,
  second,
});

export { useStore, storeInstance };
