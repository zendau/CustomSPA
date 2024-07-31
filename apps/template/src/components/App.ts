import { ref, FnComponent } from "@spa/core";
import SecondComponent from "@app/components/SecondComponent";

const App: FnComponent = () => {
  const counter = ref(0);

  function inc() {
    counter.value++;
  }

  function dec() {
    counter.value--;
  }

  const body = /*html*/ `
  <>
    <p>{counter}</p>

    <button @click='inc'>Inc</button>
    <button @click='dec'>Dec</button>

    <SecondComponent :msg='counter' />
  </>`;

  const style = /*css*/ `

  button[scoped] {
    color: red;
    font-size: 26px;
  }

  button {
    border-radius: 10%;
  }

  `;

  return [
    { template: body, style },
    {
      components: { SecondComponent },
      data: {
        counter,
        inc,
        dec,
      },
      onMounted: () => console.log("Mounted app"),
      onUpdate: () => console.log("Updated app"),
    },
  ];
};

export default App;
