import { Emmiter } from "@core/Emitter";
import { reactiveNode } from "@core/interfaces/typeNodes";
import SPA from "./SPA";

export const reactiveNodes = new Map<object, reactiveNode[]>();
export const reactiveProxy = new Map<object, object>();

const emitter = Emmiter.getInstance();

function createNestedProxy<T extends object>(obj: T, mainObj?: T): T {
  const rootOjb = mainObj || obj;

  return new Proxy(obj, {
    set(target, key, value) {
      SPA.updateNodes(rootOjb, value)
      // emitter.emit("render:update", rootOjb, value);
      return Reflect.set(target, key, value);
    },
    get(target, key): any {
      const main: any = mainObj || target;
      const value = Reflect.get(target, key);
      if (key === "toString") {
        return () => JSON.stringify(target);
      }
      if (typeof value === "object" && value !== null) {
        return createNestedProxy(value, main);
      }

      if (
        key !== "value" &&
        Reflect.get(target, "value") &&
        Reflect.get(target, "_isRef")
      ) {
        return () => JSON.stringify(Reflect.get(target, "value"));
      }
      return value;
    },
  });
}

export function ref<T>(data: T) {
  const obj = {
    value: data,
  };

  Object.defineProperty(obj, "_isRef", {
    enumerable: false,
    writable: true,
    value: true,
  });

  return reactivity(obj);
}

export function reactivity<T extends object>(data: T) {
  const proxy = createNestedProxy(data);
  reactiveNodes.set(proxy, []);
  reactiveProxy.set(data, proxy);

  return proxy;
}
