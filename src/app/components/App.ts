import { reactivity, ref } from "@SPA";
import { FnComponent } from "@core/interfaces/componentType";
import SecondComponent from "@app/components/SecondComponent";

const App: FnComponent<{}> = () => {
  const testRef = ref(2);

  // console.log('testRef', testRef)

  // const testRef2 = reactivity({ number: { test: 2 } });

  const body = `
    <>
      <p class='box find'>{testRef}</p>
      <div>
        <button id='test' @click='testInc'>Inc</button>
        <button @click='testDec'>Dec</button>
      </div>
      <input id='one' @input='testDec'/>
      <input id='two' />
      <SecondComponent msg='test message' :id='testRef'/>
    </>`;

  function testInc() {
    testRef.value++;
  }

  function testDec() {
    testRef.value--;
  }

  return [
    body,
    {
      components: { SecondComponent },
      data: {
        testRef,
        testInc,
        testDec,
      },
    },
  ];
};

export default App;
