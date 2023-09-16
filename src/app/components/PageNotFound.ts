import { useRoute } from "@core/libs/router";
import { FnComponent } from "../../core/interfaces/componentType";

const PageNotFound: FnComponent = () => {
  const route = useRoute();

  const body = `
    <>
    <h1>Page '{path}' not found</h1>
    </>`;

  return [{ template: body }, { data: { path: route.path } }];
};

export default PageNotFound;
