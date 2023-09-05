import { reactivity, ref } from "@SPA";
import { FnComponent } from "@core/interfaces/componentType";
import SecondComponent from "@app/components/SecondComponent";
import { useStore } from "@app/store";

const App: FnComponent = () => {
  const testRef = ref(2);
  const testIf = ref(true);

  const t = useStore()
  // console.log('testRef', testRef)

  // const testRef2 = reactivity({ number: { test: 2 } });

  function changeIf() {
    testIf.value = !testIf.value;
  }

  const body = `
    <>
    <p class='box find'>{testRef}</p>
    <div>
    <button id='test' @click='testInc'>Inc</button>
    <button @click='testDec'>Dec</button>
    </div>
    <input id='one' @input='testDec'/>
    <input id='two' />
    <button @click='changeIf'>Test if</button>
    <SecondComponent if='testIf' msg='test message' :id='testRef'/>
      <h1>END</h1>
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
        testIf,
        testRef,
        changeIf,
        testInc,
        testDec,
      },
      onBeforeUpdate: () => console.log("BEFORE UPDATE APP"),
      onUpdate: () => console.log("UPDATE APP"),
    },
  ];
};

export default App;
