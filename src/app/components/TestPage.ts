import { ref } from "@SPA";
import { FnComponent } from "../../core/interfaces/componentType";
import { useRouter } from "@core/libs/router";

const TestPage: FnComponent = () => {
  const router = useRouter();

  function test() {
    router.push("/");
  }

  const body = `
    <>
    <h1>Test page</h1>
    <button @click='test'>push</button>
    </>`;

  return [body, { data: { test } }];
};

export default TestPage;
