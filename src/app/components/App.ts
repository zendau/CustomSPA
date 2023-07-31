import { reactivity, ref } from "../../core/reactivity";

export default function App() {
  const testRef = ref(2);
  const testRef2 = reactivity({ number: { test: 2 } });

  testRef2.number.test.toFixed();

  const body = `<div>{testRef}</div>`;

  function testInc() {
    testRef.value++;
  }

  function testDec() {
    testRef.value--;
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
