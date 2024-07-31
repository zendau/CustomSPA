import { reactivity, ref, FnComponent, provide, computed } from "@spa/core";
import { useStore } from "@app/store";
import Input from "@app/components/Input";
import Item from "./Item";

const App: FnComponent = () => {
  const store = useStore();

  const body = /*html*/ `
  <>
    <h1>Hello world</h1>
    <h1>Hello world</h1>

    <div for="item in test">
      <Item :todo='item' />
    </div>



    <Input />
    <p>dasds</p>
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
