import { SPA } from "@SPA";
import App from "@app/components/App";
import TestPage from "@app/components/TestPage";
import { Emmiter } from "@core/Emitter";
import { FnComponent } from "@core/interfaces/componentType";

interface IRouterParam {
  value: string;
  param?: IRouterParam;
}

interface IRoute {
  path: string;
  component: FnComponent;
  param?: IRouterParam;
  children?: IRoute[];
  meta?: Record<string, any>;
}

export interface ExternalModuleInterface {
  [x: string]: any;
  init(app: SPA): void;
}

const routes: IRoute[] = [
  { path: "/", component: App },
  {
    path: "/test",
    param: { value: "id", param: { value: "q", param: { value: "w" } } },
    component: TestPage,
  },
];

class Router implements ExternalModuleInterface {
  private routes!: IRoute[];
  private currentRoute!: IRoute;
  private currentParams!: Record<string, string>;

  constructor(routes: IRoute[]) {
    this.routes = routes;

    Emmiter.getInstance().subscribe("router:route", this.route.bind(this));
    Emmiter.getInstance().subscribe("router:router", this.router.bind(this));

    window.addEventListener("popstate", this.changeState.bind(this));
  }

  private findRoute(pathname: string) {
    debugger;

    const pathArgs = pathname.split("/").splice(1);

    const routeData = this.routes.find(
      (route) => route.path === `/${pathArgs[0]}`
    );

    if (!routeData) return;

    this.currentParams = {};

    let routeParam = routeData.param;

    for (let i = 1; i < pathArgs.length; i++) {
      if (!routeParam) break;

      this.currentParams[routeParam.value] = pathArgs[i];
      routeParam = routeParam.param;
    }

    return routeData;
  }

  public init(app: SPA) {
    const { pathname, hash, href, origin } = window.location;
    const route = this.findRoute(pathname);

    if (!route) return;

    this.currentRoute = route;

    return route.component;
  }

  private replacePage(path: string) {
    const route = this.findRoute(path);

    if (!route) {
      console.warn(`Route - ${route} not found`);
      return;
    }
    console.log("TEST PUSH", route);

    this.currentRoute = route;

    Emmiter.getInstance().emit(
      "app:setupComponent",
      route?.component,
      SPA.root,
      "",
      "replace"
    );
  }

  private changeState(e: PopStateEvent) {
    console.log("changeState", e, window.location.pathname);

    const { pathname } = window.location;

    if (pathname === this.currentRoute.path) return;

    this.replacePage(pathname);
  }

  private push(path: string) {
    window.history.pushState({}, "", path);
    this.replacePage(path);
  }

  private replace(path: string) {
    window.history.replaceState({}, "", path);
    this.replacePage(path);
  }

  private go(delta: number) {
    window.history.go(delta);
  }

  private back() {
    window.history.back();
  }

  private forward() {
    window.history.forward();
  }

  private route() {
    return {
      path: this.currentRoute.path,
      meta: this.currentRoute.meta,
      params: this.currentParams,
    };
  }

  private router() {
    return {
      currentRoute: this.route(),
      back: this.back.bind(this),
      forward: this.forward.bind(this),
      go: this.go.bind(this),
      push: this.push.bind(this),
      replace: this.replace.bind(this),
    };
  }
}

export function useRoute() {
  return Emmiter.getInstance().emit("router:route");
}

export function useRouter() {
  return Emmiter.getInstance().emit("router:router");
}

export const AppRouter = new Router(routes);
