import { ref, FnComponent } from "@spa/core";
import { useStore } from "@app/store";

const Input: FnComponent = () => {
  const store = useStore();

  const todoEl = ref<HTMLInputElement | null>(null);

  function onInputValue(e: Event) {
    if (todoEl.value) return;
    todoEl.value = e.target as HTMLInputElement;
  }

  function onInputAdd() {
    if (!todoEl.value || !todoEl.value.value) return;

    store.todo.actions.add({ title: todoEl.value.value });

    todoEl.value.value = "";

    todoEl.value = null;
  }

  const body = /*html*/ `
  <>
  <input @input='onInputValue' />
  <button @click='onInputAdd'>Add todo</button>
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

export default Input;
