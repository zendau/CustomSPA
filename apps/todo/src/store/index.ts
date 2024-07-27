import { createStore } from "@spa/store";
import todo from "./modules/todo";

const { useStore, storeInstance } = createStore({
  todo,
});

export { useStore, storeInstance };
