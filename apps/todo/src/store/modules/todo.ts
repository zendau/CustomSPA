import { createModule } from "@spa/store";

interface IState {
  todo: string[];
}

const state: any = {
  todo: [{title: 'one'}, {title: 'two'}],
};

const actions = {
  add(store: { state: IState }, text: any) {
    store.state.todo.push(text);
  },
  delete(store: { state: IState }, index: number) {
    store.state.todo.splice(index, 1);
  },
};

const store = createModule({
  state,
  actions,
});

export default store;
