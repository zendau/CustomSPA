import App from "../components/App";
import { Router, IRoute } from "@spa/router";

const routes: IRoute[] = [
  { path: "/", component: App },
];

export default new Router(routes);
