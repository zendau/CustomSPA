import { ref, FnComponent } from "@spa/core";
import { useStore } from "@app/store";

interface IProps {
  todo: string;
}

const Item: FnComponent<IProps> = ({ todo }) => {
  const store = useStore();

  const todoValue = ref("");

  function onInputValue(e: any) {
    todoValue.value = e.target.value;
  }

  function onInputAdd() {
    if (!todoValue.value.length) return;

    store.todo.actions.add(todoValue.value);

    todoValue.value = "";
  }

  const body = /*html*/ `
  <>
    <h1>Hello</h1>
    <p>{todo.title}</p>
  </>`;

  const style = /*css*/ `
  `;

  return [
    { template: body, style },
    {
      data: {
        todo,
        onInputValue,
        onInputAdd,
      },
    },
  ];
};

export default Item;
