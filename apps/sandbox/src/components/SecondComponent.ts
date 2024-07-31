import { ref, reactivity, FnComponent } from "@spa/core";
import ThirdComponent from "./ThirdComponent";

interface ISecondComponentProps {
  id: number;
  msg: string;
}

const SecondComponent: FnComponent<ISecondComponentProps> = ({ id, msg }) => {
  const testRef = ref("testQ");

  const testFor = reactivity([
    { title: "item 1", count: 1 },
    { title: "item 2", count: 2 },
    { title: "item 3", count: 3 },
  ]);

  const testReactivity = reactivity({ title: "qwitem 1", count: 2111 });

  function testInput(e: any) {
    testRef.value = e.target.value;
    // console.log('testRef', testRef)
    testReactivity.title = e.target.value;
    testReactivity.count++;

    testFor.forEach(
      (item: any, index: any) => (item.title = e.target.value + index)
    );
  }

  function addForValue() {
    const t = new Date().getMilliseconds();
    testFor.push({ title: t.toString(), count: 1 });
  }

  function deleteForValue() {
    testFor.pop();
  }

  const body = `
    <>
      <h2>Hello h2 {msg}</h2>
      <h1>Hello from second component {id} and {testRef}</h1>
      <input @input='testInput' />
      <button @click='addForValue'>add for value</button>
      <button @click='deleteForValue'>delete for value</button>
      <p>test - {testReactivity} - ref</p>
      <p>test2 - {testReactivity.count} - ref</p>

      <div for="item in testFor" id="test">
        <div>{item.title}</div>
        <div>{item.count}</div>
      </div>

      <ThirdComponent />
      <ThirdComponent />
    </>`;

  return [
    { template: body },
    {
      data: {
        id,
        msg,
        testRef,
        testFor,
        testReactivity,
        testInput,
        addForValue,
        deleteForValue,
      },
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
