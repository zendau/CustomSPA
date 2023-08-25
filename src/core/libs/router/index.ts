import { SPA } from "@SPA";
import App from "@app/components/App";
import TestPage from "@app/components/TestPage";
import { FnComponent } from "@core/interfaces/componentType";

interface IRoute {
  path: string;
  component: FnComponent;
  children?: IRoute[];
  meta?: Record<string, any>;
}

export interface ExternalModuleInterface {
  init(app: SPA): void;
}

const routes: IRoute[] = [
  { path: "/", component: App },
  { path: "/test", component: TestPage },
];

class Router implements ExternalModuleInterface {
  private routes!: IRoute[];

  constructor(routes: IRoute[]) {
    this.routes = routes;
  }

  private findRoute(pathname: string) {
    const routeData = this.routes.find((route) => route.path === pathname);

    return routeData;
  }

  public init(app: SPA) {
    const { pathname, hash, href, origin } = window.location;
    const route = this.findRoute(pathname);


    console.log("SPA", route);
  }

  private push() {}

  private replace() {}

  private go() {}

  private back() {}

  private forward() {}

  private currentRoute() {}

  private to() {}
}

export const AppRouter = new Router(routes);
