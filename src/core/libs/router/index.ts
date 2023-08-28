import { SPA } from "@SPA";
import App from "@app/components/App";
import TestPage from "@app/components/TestPage";
import { Emmiter } from "@core/Emitter";
import { FnComponent } from "@core/interfaces/componentType";

interface IRoute {
  path: string;
  component: FnComponent;
  children?: IRoute[];
  meta?: Record<string, any>;
}

export interface ExternalModuleInterface {
  [x: string]: any;
  init(app: SPA): void;
}

const routes: IRoute[] = [
  { path: "/", component: App },
  { path: "/test", component: TestPage },
];

class Router implements ExternalModuleInterface {
  private routes!: IRoute[];
  private currentRoute!: IRoute;

  constructor(routes: IRoute[]) {
    this.routes = routes;

    Emmiter.getInstance().subscribe("router:route", this.route.bind(this));
    Emmiter.getInstance().subscribe("router:router", this.router.bind(this));

    window.addEventListener("popstate", this.changeState.bind(this));
  }

  private findRoute(pathname: string) {
    const routeData = this.routes.find((route) => route.path === pathname);

    return routeData;
  }

  public init(app: SPA) {

    console.log('INIT ROUTER', app)

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
