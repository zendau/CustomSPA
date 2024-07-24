import { createStore } from "@spa/store";
import first from "./modules/first";
import second from "./modules/second";

const { useStore, storeInstance } = createStore({
  first,
  second,
});

export { useStore, storeInstance };
