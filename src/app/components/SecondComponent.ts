import { ref } from "@SPA";
import { FnComponent } from "core/interfaces/componentType";
import ThirdComponent from "./ThirdComponent";

interface ISecondComponentProps {
  id: number;
}

const SecondComponent: FnComponent<ISecondComponentProps> = (test) => {
  const testRef = ref("testQ");

  console.log("1test", test);

  const body = `
    <>
      <h1>Hello from second component {id} and {testRef}</h1>
      <h2>Hello h2</h2>
      <ThirdComponent />
    </>`;

  return [
    body,
    { data: { id: test.id, testRef }, components: { ThirdComponent } },
  ];
};

export default SecondComponent;
