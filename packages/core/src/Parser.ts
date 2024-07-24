import { IVDOMElement, eventTypes } from "./interfaces/IVDOMElement";
import { IComponent } from "./interfaces/componentType";

export default class Parser {
  private events: eventTypes[] = ["click", "input"];
  private HTMLBody!: string[];
  private componentProps?: Partial<IComponent>;
  private lastTag!: any;
  private tempTag!: any;

  constructor(HTML: string, componentProps?: Partial<IComponent>) {
    if (!HTML) return;

    this.componentProps = componentProps;

    this.lastTag = null;
    this.tempTag = null;

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
    for (let i = 0; i < tagsData.length; i++) {
      let atr = tagsData[i];

      if (!atr) continue;

      if (atr.charAt(atr.length - 1) === "/") {
        atr = atr.substring(0, atr.length - 1);
      }

      if (atr.includes("if")) {
        const ifValue = atr.split("=")[1].replace(/["']/g, "");

        vdom.props.if = ifValue;
        continue;
      }

      if (atr.includes("for")) {
        const res: string[] = [];

        const forItem = atr.split("=")[1].replace(/["']/g, "");

        res.push(forItem);

        if (tagsData[i + 1] === "in") {
          res.push(tagsData[i + 1]);
          res.push(tagsData[i + 2].replace(/["']/g, ""));
          i += 2;

          vdom.props.for = res;
          continue;
        }
      }

      if (atr.includes("data-")) {
        const dataValue = atr.replace("data-", "").split("=");

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

      if (atr.includes("href")) {
        console.log("HREF", atr);
        const atrValue = atr.split("=");
        vdom.props.href = atrValue[1].replace(/["']/g, "");
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
      let [key, value] = item.split("=");
      value = value.replace(/["']/g, "");

      if (key === "if") {
        vdom.props.if = value;
        continue;
      }

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
      this.lastTag = this.tempTag;
      const vdom: IVDOMElement = {
        tag: "",
        children: [],
        props: {},
      };
      let tag = this.HTMLBody[i];

      if (!tag) continue;

      const tagData = tag.split(">");

      const tagPieces = tagData[0].split(" ");

      const tagTitle = tagPieces.shift() as string;

      this.tempTag = tagTitle;
      vdom.tag = tagTitle;

      const componentTitle =
        tagTitle.charAt(0) === "/" ? tagTitle.substring(1) : tagTitle;

      if (
        this.componentProps?.components &&
        Object.keys(this.componentProps.components).indexOf(componentTitle) !==
          -1
      ) {
        if (tagData[0].charAt(tagData[0].length - 1) === "/") {
          this.getComponentProps(tag, vdom);
          roomVDOM.children?.push(vdom);
        } else {
          if (tagData[0].charAt(0) === "/") {
            return {
              pos: i,
              vdome: roomVDOM,
            };
          } else {
            this.getComponentProps(tag, vdom);
            const slotData = this.HTMLParser(i + 1, tagTitle);

            if (slotData && "pos" in slotData && slotData.vdome.children) {
              i = slotData.pos;

              if (!vdom.props.componentProps) vdom.props.componentProps = {};

              vdom.props.componentProps.children = slotData.vdome;
            }

            roomVDOM.children?.push(vdom);
          }
        }

        continue;
      }

      tagData[0] = tagPieces.join(" ");

      if (
        tagData[1] ||
        (!tagData[1] &&
          this.HTMLBody[i]?.charAt(0) !== "/" &&
          this.HTMLBody[i + 1]?.charAt(0) === "/")
      ) {
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

          if (tag === htmlTag && this.lastTag !== htmlTag) {
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
