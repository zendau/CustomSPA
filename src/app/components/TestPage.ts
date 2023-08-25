import { ref } from "@SPA";
import { FnComponent } from "../../core/interfaces/componentType";

const TestPage: FnComponent = () => {
  const body = `
    <>
    <h1>Test page</h1>
    </>`;

  return [body];
};

export default TestPage;
