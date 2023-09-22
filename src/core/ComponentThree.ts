export class ComponentThree {
  private _value!: string;
  private children!: ComponentThree[];
  private parent!: ComponentThree | null;
  private data!: Map<string, any>;

  constructor(value: string) {
    this._value = value;
    this.children = [];
    this.parent = null;
    this.data = new Map();
  }

  addNode(childNode: ComponentThree) {
    const isAdded = this.children.find(
      (item) => item._value === childNode._value
    );

    if (isAdded) return isAdded;

    childNode.parent = this;
    this.children.push(childNode);
  }

  addProvideValue(key: string, value: any) {
    this.data.set(key, value);
  }

  findInjectValue(key: string): any | undefined {
    if (this.data.has(key)) {
      return this.data.get(key);
    } else {
      if (this.parent === null) return undefined;

      return this.parent.findInjectValue(key);
    }
  }

  get value(): string {
    return this._value;
  }
}

class ComponentThreeController {
  private currentComponentNode!: ComponentThree | null;

  get currentNode() {
    return this.currentComponentNode;
  }

  public resetCurrentNode() {
    this.currentComponentNode = null;
  }

  public addComponentToThee(
    componentName: string,
    theeData: ComponentThree | null
  ) {
    let component = new ComponentThree(componentName);

    if (theeData) {
      const isAddedComponent = theeData.addNode(component);

      if (isAddedComponent) component = isAddedComponent;
    }

    this.currentComponentNode = component;

    return component;
  }
}

export const componentController = new ComponentThreeController();

export function provide(key: string, data: any) {
  if (!componentController.currentNode) return;
  componentController.currentNode.addProvideValue(key, data);
}

export function inject(key: string) {
  if (!componentController.currentNode) return;
  return componentController.currentNode.findInjectValue(key);
}

// const q1 = new ComponentThree("2");
// q1.addProvideValue("test", "hello world");

// const q2 = new ComponentThree("3");
// const q2Copy = new ComponentThree("3");
// const q3 = new ComponentThree("5");
// const q4 = new ComponentThree("6");

// q1.addNode(q2);
// q1.addNode(q2Copy);
// q2.addNode(q3);
// q3.addNode(q4);
// console.log(q1);

// const r = q4.findInjectValue("test");
// console.log("r", r);
