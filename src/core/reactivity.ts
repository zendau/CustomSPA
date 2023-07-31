import updateNodes from "./updateNode";

export const reactiveNodes = new Map();
export const reactiveProxy = new Map();

function createNestedProxy<T extends object>(obj: T, mainObj?: T): T {
  const rootOjb = mainObj || obj;

  return new Proxy(obj, {
    set(target, key, value) {
      updateNodes(rootOjb, value);
      return Reflect.set(target, key, value);
    },
    get(target, key): any {
      const main: any = mainObj || target;
      const value = Reflect.get(target, key);
      if (key === "toString") {
        console.log("RETURN");
        return () => JSON.stringify(target);
      }
      if (typeof value === "object" && value !== null) {
        return createNestedProxy(value, main);
      }
      return value;
    },
  });
}

type ReactiveValue<T> = T extends object ? T : { value: T };

export function ref<T>(data: T) {
  const obj = {
    value: data,
  };

  return reactivity(obj);
}

export function reactivity<T extends object>(data: T) {
  const proxy = createNestedProxy(data);
  reactiveNodes.set(proxy, []);
  reactiveProxy.set(data, proxy);

  return proxy;
}
