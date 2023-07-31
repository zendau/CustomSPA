import { reactivity, ref } from "../../core/reactivity";
import { DataComponent } from "../../interfaces/componentData";

export default function App(): DataComponent {
  const testRef = ref(2);

  // console.log('testRef', testRef)

  // const testRef2 = reactivity({ number: { test: 2 } });

  // testRef2.number.test.toFixed();

  const body = `
    <div>
      <p class='box find'>{testRef}</p>
      <button id='test' @click='testInc'>Inc</button>
      <button @click='testDec'>Dec</button>
    </div>`;

  function testInc() {
    // testRef.value++;
  }

  function testDec() {
    // testRef.value--;
  }

  return [
    body,
    {
      testRef,
      testInc,
      testDec,
    },
  ];
}
