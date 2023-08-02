import { reactivity, ref } from "../../core/reactivity";
import { DataComponent } from "../../interfaces/componentData";

export default function SecondComponent(): DataComponent {
  const testRef = ref(2);

  // console.log('testRef', testRef)

  // const testRef2 = reactivity({ number: { test: 2 } });

  // testRef2.number.test.toFixed();

  const body = `
    <>
      <h1>Hello from second component</h1>
    </>`;

  return [body, {}];
}
