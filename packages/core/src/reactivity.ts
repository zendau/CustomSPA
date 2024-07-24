import { reactiveNode } from "./interfaces/typeNodes";
import { updateNodes } from "./SPA";

export const reactiveNodes = new Map<object, reactiveNode[]>();
export const reactiveProxy = new Map<object, object>();

let simpleReactiveVar: object[] | null = null;
const depReactiveVar: object[][] = [];

export const deepComputed = new Map();

function createNestedProxy<T extends object>(obj: T, mainObj?: T): T {
  const rootOjb = mainObj || obj;

  return new Proxy(obj, {
    set(target, key, value) {
      updateNodes(rootOjb, value, target);

      return Reflect.set(target, key, value);
    },
    get(target, key): any {
      const main: any = mainObj || target;
      const value = Reflect.get(target, key);

      if (Array.isArray(simpleReactiveVar) && simpleReactiveVar.length === 0) {
        simpleReactiveVar.push(target);
      }

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

      if (Array.isArray(simpleReactiveVar)) {
        simpleReactiveVar.push(target);
      }

      if (simpleReactiveVar?.length && simpleReactiveVar.length > 0) {
        depReactiveVar.push(simpleReactiveVar);
        simpleReactiveVar = [];
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
  if (!data.hasOwnProperty("_isRef")) {
    Object.defineProperty(data, "_isRef", {
      enumerable: false,
      writable: true,
      value: false,
    });
  }

  const proxy = createNestedProxy(data);
  reactiveNodes.set(proxy, []);
  reactiveProxy.set(data, proxy);

  return proxy;
}

export function computed<T extends () => any>(fn: T) {
  simpleReactiveVar = [];
  const resFn = fn();

  const resValue: { value: ReturnType<T> } = {
    value: resFn,
  };

  if (depReactiveVar.length > 0) {
    depReactiveVar.forEach((item) => {
      const obj = item.shift();

      if (!deepComputed.has(obj)) deepComputed.set(obj, []);
      deepComputed.get(obj).push([item[0], fn]);
    });
  }

  depReactiveVar.length = 0;

  Object.defineProperty(resValue, "_root", {
    enumerable: false,
    writable: true,
    value: fn,
  });

  Object.defineProperty(resValue, "toString", {
    enumerable: false,
    writable: true,
    value: function () {
      return this.value;
    },
  });

  simpleReactiveVar = null;

  reactiveProxy.set(fn, fn);
  reactiveNodes.set(fn, []);

  return resValue;
}
