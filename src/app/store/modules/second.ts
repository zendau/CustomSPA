import createModule from "@core/libs/store/createStore";

const state = {
  name: "John",
  age: 30,
  address: {
    city: "New York",
    postalCode: "10001",
  },
};

const actions = {
  test(store: { state: any; actions: any }): any {
    console.log("test", store);
  },
};

const store = createModule({
  state,
  actions,
});

export default store;
