import { reactivity, ref, FnComponent, provide, computed } from "@spa/core";
import { useStore } from "@app/store";

const App: FnComponent = () => {
  const store = useStore();

  const body = /*html*/ `
  <>
    <h1>Hello world</h1>
  </>`;

  const style = /*css*/ `
  `;



  return [{ template: body, style }, {}];
};

export default App;
