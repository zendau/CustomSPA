import { FnComponent } from "@spa/core";
import { useRouter, Link } from "@spa/router";

const TestPage: FnComponent = () => {
  const router = useRouter();

  console.log("router", router);

  function qqqe() {
    console.log('router', router)
    router.push("/test/1/2/3/nested/test");
  }

  const body = /*html*/`
    <>
    <h1>Test page</h1>
    <p>param: id - {id}</p>
    <p>param: q - {q}</p>
    <p>param: w - {w}</p>
    <p>props: test - {routeProps.test}</p>
    <div>
    <Link to='/'/>
    <Link to='/'><h1>To main page</h1></Link>
    <button @click='qqqe'>push to nested apge</button>
    </div>

    </>`;

  return [
    { template: body },
    {
      data: {
        qqqe,
        id: router.currentRoute.params.id,
        q: router.currentRoute.params.q,
        w: router.currentRoute.params.w,
        routeProps: router.currentRoute.props,
      },
      components: { Link },
      onUnmounted: () => console.log("UNMOUNTED TEST PAGE"),
    },
  ];
};

export default TestPage;
