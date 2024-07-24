import { FnComponent } from "@spa/core";
import { useRoute } from "@spa/router";

const PageNotFound: FnComponent = () => {
  const route = useRoute();

  const body = `
    <>
    <h1>Page '{path}' not found</h1>
    </>`;

  return [{ template: body }, { data: { path: route.path } }];
};

export default PageNotFound;
