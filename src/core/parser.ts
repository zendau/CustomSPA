import { IVDOMElement, eventTypes } from "@core/interfaces/IVDOMElement";
import { IComponent } from "@core/interfaces/componentType";

export default class Parser {
  private events: eventTypes[] = ["click", "input"];
  private HTMLBody!: string[];
  private componentProps?: Partial<IComponent>;

  constructor(HTML: string, componentProps?: Partial<IComponent>) {
    if (!HTML) return;

    this.componentProps = componentProps;

    this.HTMLBody = HTML.replaceAll("\n", "")
      .replaceAll(/ {2,}/g, "")
      .split("<");
  }

  public genereteVDOM() {
    return this.HTMLParser();
  }

  private getTagClass(tagData: string, vdom: IVDOMElement) {
    const classRegex = /class=(?:["']\W+\s*(?:\w+)\()?["']([^'"]+)['"]/gim;
    const classAtr = tagData.match(classRegex);

    if (classAtr) {
      const classes = classAtr[0]
        .replace("class=", "")
        .replace(/["']/g, "")
        .split(" ");

      tagData = tagData.replace(classAtr[0], "");

      vdom.props.class = classes;
    }
    return tagData;
  }

  private getTagAttributes(tagsData: string[], vdom: IVDOMElement) {
    for (let atr of tagsData) {
      if (!atr) continue;

      if (atr.charAt(atr.length - 1) === "/") {
        atr = atr.substring(0, atr.length - 1);
      }

      if (atr.includes("data-")) {
        const dataValue = atr.replace("data-", "").split("=");
        console.log("dataValue", dataValue);

        if (!vdom.props.dataset) {
          vdom.props.dataset = {};
        }

        vdom.props.dataset[dataValue[0]] = dataValue[1].replace(/["']/g, "");
        continue;
      }

      if (atr.includes("id=")) {
        const id = atr.replace("id=", "").replace(/["']/g, "");
        vdom.props.id = id;
        continue;
      }

      if (atr.includes("@")) {
        const atrValue = atr.split("=");
        const eventType = atrValue[0].substring(1) as eventTypes;
        const eventAction = atrValue[1].replace(/["']/g, "");

        if (this.events.includes(eventType)) {
          if (!vdom.props.events) {
            vdom.props.events = {};
          }

          vdom.props.events[eventType] = eventAction;
        } else {
          console.error(`Unknown type ${eventType} on tag ${vdom.tag}`);
        }
      }
    }
  }

  private getComponentProps(componentTag: string, vdom: IVDOMElement) {
    if (!componentTag) return;

    const regex = /(@\w+|\w+|:\w+)\s*=\s*['"]([^'"]+)['"]/g;

    const componentData = componentTag.match(regex);

    if (!componentData) return;

    vdom.props.componentProps = {};

    for (let item of componentData) {
      console.log("item component", item);

      let [key, value] = item.split("=");

      if (key === "if") {
        console.log("IF", value);
        value = value.replace(/["']/g, "");
        vdom.props.if = value;
        continue;
      }

      value = value.replace(/["']/g, "");

      if (key.charAt(0) === ":") {
        const newKey = key.substring(1, key.length);

        if (!this.componentProps?.data || !this.componentProps.data[value]) {
          console.error(`unknown props ${value} in ${componentTag}`);
          return;
        }

        vdom.props.componentProps[newKey] = this.componentProps.data[value];

        continue;
      }

      vdom.props.componentProps[key] = value;
    }
  }

  private HTMLParser(startPos = 0, htmlTag?: string) {
    const roomVDOM: IVDOMElement = {
      tag: "",
      children: [],
      props: {},
    };

    for (let i = startPos; i < this.HTMLBody.length; i++) {
      const vdom: IVDOMElement = {
        tag: "",
        children: [],
        props: {},
      };
      let tag = this.HTMLBody[i];

      console.log("TAG", tag, i);

      if (!tag) continue;

      const tagData = tag.split(">");

      const tagPieces = tagData[0].split(" ");

      const tagTitle = tagPieces.shift() as string;

      vdom.tag = tagTitle;
      if (
        this.componentProps?.components &&
        Object.keys(this.componentProps.components).indexOf(tagTitle) !== -1
      ) {
        this.getComponentProps(tag, vdom);
        roomVDOM.children?.push(vdom);
        continue;
      }

      tagData[0] = tagPieces.join(" ");

      if (tagData[1]) {
        vdom.props.value = tagData[1];
      } else if (
        tagData[0].charAt(tagData[0].length - 1) !== "/" ||
        tagData[0] === "/"
      ) {
        if (tag.charAt(0) !== "/") {
          if (!vdom.children) {
            vdom.children = [];
          }

          const childDom = this.HTMLParser(i + 1, tagTitle);

          if (childDom && "pos" in childDom && childDom.vdome.children) {
            i = childDom.pos;
            vdom.children.push(...childDom.vdome.children);
          }
        } else if (tag.charAt(0) === "/") {
          tag = tag.slice(1, -1);

          if (tag === htmlTag) {
            return {
              pos: i,
              vdome: roomVDOM,
            };
          }
          continue;
        }
      }

      let tagAtr = tagData[0];

      tagAtr = this.getTagClass(tagAtr, vdom);

      const tagSlices = tagAtr.split(" ");

      this.getTagAttributes(tagSlices, vdom);

      roomVDOM.children?.push(vdom);
    }

    return roomVDOM;
  }
}
