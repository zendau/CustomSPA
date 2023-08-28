import { ref } from "@SPA";
import { FnComponent } from "../../core/interfaces/componentType";
import { useRouter } from "@core/libs/router";
import Link from "@core/libs/router/components/Link";

const TestPage: FnComponent = () => {
  const router = useRouter();

  console.log('router', router)

  function test() {
    router.push("/");
  }

  const body = `
    <>
    <h1>Test page</h1>
    <div>
    <Link to='/'/>
    <Link to='/'><h1>TEST VALUE</h1></Link>
    <button @click='test'>push</button>
    </div>

    </>`;

  return [body, { data: { test }, components: { Link } }];
};

export default TestPage;
