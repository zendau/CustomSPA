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

export class ComponentThreeController {
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
