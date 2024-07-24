import { FnComponent } from "@spa/core";
import { useRouter, Link } from "@spa/router";

const TestPageNested: FnComponent = () => {
  const router = useRouter();

  console.log("router", router);

  function test() {
    router.push("/test", { test: "propsQWW@" });
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
    { template: body },
    {
      data: { test, category: router.currentRoute.params.category },
      components: { Link },
    },
  ];
};

export default TestPageNested;
