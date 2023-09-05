import createModule from "@core/libs/store/createStore";

const state = {
  t: "a",
};

const actions = {
  add(store: { state: any; actions: any }, a: number, b: number): any {
    console.log("test", store, a, b);
  },
  multiply(x: number, y: number): number[] {
    return [x, y];
  },
};

const store = createModule({
  state,
  actions,
});

export default store;
