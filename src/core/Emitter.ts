type emitFunction = (...args: any[]) => any;

export class Emmiter {
  private static instance: Emmiter;

  private events!: Map<string, emitFunction>;

  constructor() {
    this.events = new Map<string, emitFunction>();
  }

  public static getInstance(): Emmiter {
    if (!Emmiter.instance) {
      Emmiter.instance = new Emmiter();
    }
    return Emmiter.instance;
  }

  subscribe(event: string, fn: emitFunction) {
    if (this.events.has(event)) {
      console.warn(`action ${event} is already declarated`);
      return;
    }

    this.events.set(event, fn);

    return {
      unsubscribe: () => {
        this.events.delete(event);
      },
    };
  }

  emit(event: string, ...args: any[]) {
    const fn = this.events.get(event);

    if (!fn) {
      console.warn(`unknown event ${event}`);
    } else {
      return fn(...args);
    }
  }
}
