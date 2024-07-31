import { createModule } from "@spa/store";

interface IState {
  list: string[];
}

const state: IState = {
  list: ["one", "two"],
};

const actions = {
  add(store: { state: IState }, text: any) {
    store.state.list.push(text);
  },
  delete(store: { state: IState }, index: number) {
    store.state.list.splice(index, 1);
  },
};

const store = createModule({
  state,
  actions,
});

export default store;
