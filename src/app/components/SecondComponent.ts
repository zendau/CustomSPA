import { reactivity, ref } from "../../core/reactivity";
import { DataComponent } from "../../interfaces/componentData";

export default function SecondComponent({
  id,
}: Record<string, any>): DataComponent {
  const testRef = ref('testQ');

  console.log("=props", id);

  // console.log('testRef', testRef)

  // const testRef2 = reactivity({ number: { test: 2 } });

  // testRef2.number.test.toFixed();

  const body = `
    <>
      <h1>Hello from second component {id} and {testRef}</h1>
    </>`;

  return [body, { id, testRef }];
}
