import App from "../components/App";
import PageNotFound from "@app/components/PageNotFound";
import TestPage from "@app/components/TestPage";
import TestPageNested from "@app/components/TestPageNested";
import { Router, IRoute } from "@spa/router";

const routes: IRoute[] = [
  { path: "/", component: App },
  {
    path: "/test",
    param: { value: "id", param: { value: "q", param: { value: "w" } } },
    children: [
      {
        path: "/nested",
        component: TestPageNested,
        param: { value: "category" },
        isNestedPatams: true,
      },
    ],
    component: TestPage,
  },
  {
    path: "/404",
    component: PageNotFound,
  },
];

export default new Router(routes);
