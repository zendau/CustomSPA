export class Emmiter {
  private static instance: Emmiter;

  private events!: Map<string, (...args: any[]) => any>;

  constructor() {
    this.events = new Map<string, (...args: any[]) => any>();
  }

  public static getInstance(): Emmiter {
    if (!Emmiter.instance) {
      Emmiter.instance = new Emmiter();
    }
    return Emmiter.instance;
  }

  subscribe(event: string, fn: (...args: any[]) => any) {

    console.log('event', event)

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
    console.log("emit", args, event, this.events);
    const fn = this.events.get(event);

    if (!fn) {
      console.log(`unknown event ${event}`);
    } else {
      return fn(...args);
    }
  }
}
