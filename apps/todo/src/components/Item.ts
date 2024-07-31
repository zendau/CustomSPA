import { ref, FnComponent } from "@spa/core";
import { useStore } from "@app/store";

const Item: FnComponent = () => {
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
  </>`;

  const style = /*css*/ `
  `;

  return [
    { template: body, style },
    {
      data: {
        onInputValue,
        onInputAdd,
      },
    },
  ];
};

export default Item;
