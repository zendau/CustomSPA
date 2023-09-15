import { reactiveNode } from "@core/interfaces/typeNodes";
import { updateNodes } from "./SPA";
import checkPrimitiveDataType from "./utils/checkPrimitiveDataType";

export const reactiveNodes = new Map<object, reactiveNode[]>();
export const reactiveProxy = new Map<object, object>();
export let simpleReactiveVar: any[] | null = null;
let depReactiveVar: any[] = [];

export const depComputed = new Map();

// dep global map
// key - reactive proxy
// value - [ path to value, old value, computed fn]
// Когда срабатывает сет в прокси проверить является ли это значение глобальным прокси и есть ли в computed map
// если да
// получить значение по path to value и проверить равно ли оно old value
// если нет вызвать fn и получить новое значение и передать его в updateNodes
// old value заменить на новое значение из path to value
//
//

function createNestedProxy<T extends object>(obj: T, mainObj?: T): T {
  const rootOjb = mainObj || obj;

  return new Proxy(obj, {
    set(target, key, value) {
      debugger;

      // const updated = ;

      // if (depComputed.has(rootOjb)) {
      //   const computedValues = depComputed.get(rootOjb);

      //   computedValues.forEach((item: any) => {
      //     if (item[0] === target) {
      //       console.log("should update", item[1]());
      //       updateNodes(item[1], item[1]());
      //     }
      //   });
      // }

      updateNodes(rootOjb, value, target);

      return Reflect.set(target, key, value);
    },
    get(target, key, receiver): any {
      // debugger;

      const main: any = mainObj || target;
      const value = Reflect.get(target, key);

      if (Array.isArray(simpleReactiveVar)) {
        if (simpleReactiveVar.length === 0) {
          simpleReactiveVar.push(target);
        }
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

export function computed<T extends () => any>(fn: T) {
  debugger;

  simpleReactiveVar = [];

  const r = fn();

  const resValue: { value: any } = {
    value: r,
  };

  if (depReactiveVar.length > 0) {
    depReactiveVar.forEach((item) => {
      const obj = item.shift();

      if (!depComputed.has(obj)) depComputed.set(obj, []);
      depComputed.get(obj).push([item[0], fn]);
    });
  }

  // if (simpleReactiveVar.length > 0) {
  // try {
  //   resValue.value = simpleReactiveVar.reduce(
  //     (prev, curr) => prev[curr],
  //     obj
  //   ) as unknown as string | undefined;
  // } catch {
  //   resValue.value = undefined;
  // }
  // }

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

  console.log("test" + resValue);

  reactiveProxy.set(fn, fn);
  reactiveNodes.set(fn, []);

  const e = new ComputedRefImpl(resValue.value);

  console.log("e" + e);

  return resValue;
}
