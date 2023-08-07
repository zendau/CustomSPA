import { ref } from "@SPA";
import { FnComponent } from "core/interfaces/componentType";

interface ISecondComponentProps {
  id: number;
}

const SecondComponent: FnComponent<ISecondComponentProps> = ({ id }) => {
  const testRef = ref("testQ");

  const body = `
    <>
      <h1>Hello from second component {id} and {testRef}</h1>
    </>`;

  return [body, { data: { id, testRef } }];
};

export default SecondComponent;
