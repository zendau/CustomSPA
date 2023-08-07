import { IVDOMElement } from "@core/interfaces/IVDOMElement";
import { ComponentData, ComponentProps, FnComponent } from "@core/interfaces/componentType";
import Parser from "@core/Parser";
import RenderVDOM from "@core/Render";
import { Emmiter } from "@core/Emitter";

export default class SPA {
  private root!: HTMLElement;
  private parser!: Parser;
  private render!: RenderVDOM;
  private emitter!: Emmiter;

  constructor(root: HTMLElement | null, mainComponent: FnComponent) {
    if (!root) return;

    this.root = root;
    this.emitter = Emmiter.getInstance();
    this.emitter.subscribe(
      "app:setupComponent",
      this.setupComponent.bind(this)
    );

    this.mount(mainComponent);
  }

  private setupComponent(
    component: FnComponent,
    root: HTMLElement,
    componentProps?: ComponentProps
  ) {
    const [template, props] = component(componentProps);

    this.parser = new Parser(template, props);
    this.render = new RenderVDOM(props);
    const vdom = this.parser.genereteVDOM() as IVDOMElement;
    this.render.render(root, vdom);
  }

  private mount(component: FnComponent) {
    this.setupComponent(component, this.root);
  }
}
