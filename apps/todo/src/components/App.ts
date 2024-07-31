import { reactivity, ref, FnComponent, provide, computed } from "@spa/core";
import { useStore } from "@app/store";
import Input from "@app/components/Input";
import Item from "./Item";

const App: FnComponent = () => {
  const store = useStore();

  // const test = reactivity(store.todo.state.todo)

  const body = /*html*/ `
  <>
    <h1>Hello world</h1>
    <p> {test} </p>

    <div for="item in test" id="test">
      <Item />
    </div>


    <Input />
  </>`;

  const style = /*css*/ `
  `;

  return [
    { template: body, style },
    {
      data: {
        test: store.todo.state.todo,
        store,
      },
      components: { Input, Item },
    },
  ];
};

export default App;
