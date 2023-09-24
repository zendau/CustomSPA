import createModule from "@core/libs/store/createModule";

const state = {
  t: "hello world",
};

const actions = {
  add(store: { state: any; actions: any }, a: number, b: number): any {
    console.log("test", store, a, b);
  },
  changeText(store: any) {
    store.state.t = "CHANGED TEXT";
  },
};

const store = createModule({
  state,
  actions,
});

export default store;
