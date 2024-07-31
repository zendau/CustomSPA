import { FnComponent } from "@spa/core";
import { useStore } from "@app/store";
import Input from "@app/components/Input";
import Item from "./Item";
import List from "./List";

const App: FnComponent = () => {
  const store = useStore();

  const body = /*html*/ `
  <>
    <h1>Todo</h1>

    <List />
    <Input />
  </>`;

  const style = /*css*/ `
  `;

  return [
    { template: body, style },
    {
      data: {
        test: store.todo.state.list,
        store,
      },
      components: { Input, Item, List },
    },
  ];
};

export default App;
