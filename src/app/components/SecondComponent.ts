import { ref, reactivity } from "@SPA";
import { FnComponent } from "core/interfaces/componentType";
import ThirdComponent from "./ThirdComponent";

interface ISecondComponentProps {
  id: number;
}

const SecondComponent: FnComponent<ISecondComponentProps> = (test) => {
  const testRef = ref("testQ");

  const testFor = reactivity([
    { title: "item 1", count: 1 },
    { title: "item 2", count: 2 },
    { title: "item 3", count: 3 },
  ]);

  const testReactivity = reactivity({ title: "item 1", count: 1 });

  console.log("1test", test);

  //   <div for="item in testFor" id="test">
  //   <div>{item.title}</div>
  //   <div>{item.count}</div>
  // </div>

  function testInput(e: any) {
    testReactivity.title = e.target.value
  }

  const body = `
    <>
      <h1>Hello from second component {id} and {testRef}</h1>
      <h2>Hello h2</h2>
      <input @input='testInput' />
      <p>test - {testReactivity.title} - ref</p>

      <ThirdComponent />
    </>`;

  return [
    body,
    {
      data: { id: test.id, testRef, testFor, testReactivity, testInput },
      components: { ThirdComponent },

      onUnmounted: () => console.log("UNMOUNTED SECODND"),
      onMounted: () => console.log("MOUNTED SECODND"),
      onBeforeMounted: () => console.log("ON BEFORE MOUNTE SECOND"),
      onBeforeUpdate: () => console.log("BEFORE UPDATE SECOND"),
      onUpdate: () => console.log("UPDATE SECOND"),
    },
  ];
};

export default SecondComponent;
