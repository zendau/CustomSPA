import { ref } from "@SPA";
import { FnComponent } from "../../core/interfaces/componentType";
import { useRouter } from "@core/libs/router";
import Link from "@core/libs/router/components/Link";

const TestPageNested: FnComponent = () => {
  const router = useRouter();

  console.log("router", router);

  function test() {
    router.push("/");
  }

  const body = `
    <>
    <h1>Nested test page</h1>
    <p>param: category - {category}</p>
    <Link to='/test'><h1>Go back route test page</h1></Link>
    <button @click='test'>push to main page</button>
    </div>

    </>`;

  return [
    body,
    { data: { test, category: router.currentRoute.params.category }, components: { Link } },
  ];
};

export default TestPageNested;
