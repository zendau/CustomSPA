import { FnComponent } from "@spa/core";
import { useStore } from "@app/store";

interface IProps {
  todo: string;
  key: number;
}

const Item: FnComponent<IProps> = ({ todo, key }) => {
  const store = useStore();

  function onRemoveTodo() {
    console.log("remove id with id", key);
    store.todo.actions.delete(key);
  }

  const body = /*html*/ `
  <>
    <h1>Hello</h1>
    <p>{todo} №{key}</p>
    <button @click="onRemoveTodo">X</button>
  </>`;

  const style = /*css*/ `
  `;

  return [
    { template: body, style },
    {
      data: {
        todo,
        key,
        onRemoveTodo,
      },
    },
  ];
};

export default Item;
