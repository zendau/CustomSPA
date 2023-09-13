import { reactiveNode } from "@core/interfaces/typeNodes";
import { updateNodes } from "./SPA";
import checkPrimitiveDataType from "./utils/checkPrimitiveDataType";

export const reactiveNodes = new Map<object, reactiveNode[]>();
export const reactiveProxy = new Map<object, object>();
export let simpleReactiveVar: any[] | null = null;

function createNestedProxy<T extends object>(obj: T, mainObj?: T): T {
  const rootOjb = mainObj || obj;

  return new Proxy(obj, {
    set(target, key, value) {

      debugger

      updateNodes(rootOjb, value);

      return Reflect.set(target, key, value);
    },
    get(target, key, receiver): any {
      // debugger;

      const main: any = mainObj || target;
      const value = Reflect.get(target, key);

      if (Array.isArray(simpleReactiveVar)) {
        if (simpleReactiveVar.length === 0) simpleReactiveVar.push(receiver);

        // simpleReactiveVar.push(key);
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

      // if (checkPrimitiveDataType(value)) {
      //   // console.log(target === rootOjb)

      //   let mainProxy = null;

      //   if (target === rootOjb) {
      //     mainProxy = receiver;
      //   } else {
      //     mainProxy = reactiveProxy.get(rootOjb);
      //   }

      //   simpleReactiveVar = mainProxy;

      //   // return ["SIMPLE_VALUE", value, mainProxy];
      // }

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

class ComputedRefImpl<T> {
  private value!: T;

  private _root!: object;

  constructor(val: T) {
    this.value = val;
    this._root = {};
  }

  toString() {
    return this.value;
  }
}

export function computed<T extends () => any>(value: T) {
  // debugger;

  simpleReactiveVar = [];

  const r = value();

  const resValue: { value: any } = {
    value: r,
  };

  if (simpleReactiveVar.length > 0) {
    const obj = simpleReactiveVar.shift();

    // try {
    //   resValue.value = simpleReactiveVar.reduce(
    //     (prev, curr) => prev[curr],
    //     obj
    //   ) as unknown as string | undefined;
    // } catch {
    //   resValue.value = undefined;
    // }

    Object.defineProperty(resValue, "_root", {
      enumerable: false,
      writable: true,
      value: obj,
    });

    Object.defineProperty(resValue, "toString", {
      enumerable: false,
      writable: true,
      value: function () {
        return this.value;
      },
    });
  }

  simpleReactiveVar = null;

  console.log("test" + resValue);

  const e = new ComputedRefImpl(resValue.value);

  console.log("e" + e);

  return resValue;
}
