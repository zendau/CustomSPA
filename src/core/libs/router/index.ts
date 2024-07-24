import { SPA } from "@SPA";
import { Emmiter } from "@core/Emitter";
import IExternalModule from "@core/interfaces/IExternalModule";
import { IRoute } from "./interfaces/IRoute";

export class Router implements IExternalModule {
  private routes!: IRoute[];
  private currentRoute!: IRoute;
  private currentParams!: Record<string, string>;
  private pageNotFound!: IRoute;

  constructor(routes: IRoute[]) {
    this.routes = routes;
    this.currentRoute = {} as IRoute;

    const pageNotFound = this.findRoute("/404");

    if (pageNotFound) {
      this.pageNotFound = pageNotFound;
    }

    Emmiter.getInstance().subscribe("router:route", this.route.bind(this));
    Emmiter.getInstance().subscribe("router:router", this.router.bind(this));

    window.addEventListener("popstate", this.changeState.bind(this));
  }

  private findRoute(pathname: string) {
    const pathArgs = pathname.split("/").splice(1);

    let routeData = this.routes.find(
      (route) => route.path === `/${pathArgs[0]}`
    );

    if (!routeData) {
      this.currentRoute.path = pathname;
      return this.pageNotFound;
    }

    this.currentParams = {};

    let routeParam = routeData.param;

    for (let i = 1; i < pathArgs.length; i++) {
      if (!pathArgs[i]) continue;

      if (!routeParam) {
        if (routeData && routeData.children && routeData.children.length > 0) {
          const childRouteData = routeData.children.find(
            (route) => route.path === `/${pathArgs[i]}`
          ) as IRoute | undefined;

          if (!childRouteData) break;

          if (!childRouteData.isNestedPatams) {
            this.currentParams = {};
          }

          routeData = childRouteData;
          routeParam = childRouteData.param;
        }
        continue;
      }

      this.currentParams[routeParam.value] = pathArgs[i];
      routeParam = routeParam.param;
    }

    this.currentRoute = routeData;

    return routeData;
  }

  public init(app: SPA) {
    const { pathname, hash, href, origin } = window.location;
    const route = this.findRoute(pathname);

    if (!route) return;

    return route.component;
  }

  private replacePage(path: string, props?: Record<string, any>) {
    SPA.components.forEach((component) => {
      if (component.onUnmounted) component.onUnmounted();
    });

    const styleTagsWithId = document.querySelectorAll("style[id]");

    styleTagsWithId.forEach((styleTag) => {
      styleTag.remove();
    });

    SPA.components.clear();
    const route = this.findRoute(path);

    if (props) {
      if (!this.currentRoute.props) this.currentRoute.props = {};
      this.currentRoute.props = { ...this.currentRoute.props, ...props };
    }

    if (!route) {
      console.warn(`Route - ${route} not found`);
      return;
    }

    SPA.setupComponent(route?.component, SPA.root, "", "replace", null);
  }

  private changeState(e: PopStateEvent) {
    console.log("changeState", e, window.location.pathname);

    const { pathname } = window.location;

    if (pathname === this.currentRoute.path) return;

    this.replacePage(pathname);
  }

  private push(path: string, props: Record<string, any>) {
    window.history.pushState({}, "", path);
    this.replacePage(path, props);
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
      props: this.currentRoute.props,
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
