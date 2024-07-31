import { FnComponent } from "@spa/core";
import { useStore } from "@app/store";
import Input from "@app/components/Input";
import Item from "./Item";

const List: FnComponent = () => {
  const store = useStore();

  const body = /*html*/ `
  <>
    <h1>Count: {test.length}</h1>
    <div for="item in test">
      <Item :todo='item' />
    </div>
    <hr />
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
      components: { Input, Item },
    },
  ];
};

export default List;
