import { IVDOMElement, eventTypes } from "../interfaces/IVDOMElement";

export default class Parser {
  private events: eventTypes[] = ["click", "input"];
  private HTMLBody!: string[];

  constructor(HTML: string) {
    if (!HTML) return;

    this.HTMLBody = HTML.replaceAll("\n", "")
      .replaceAll(/ {2,}/g, "")
      .split("<");
  }

  public genereteVDOM() {
    return this.HTMLParser();
  }

  private getTagValue(tagData: string) {
    if (!tagData) return;

    const reactiveRegex = /^{(.*)}$/;
    const checkReactive = tagData.match(reactiveRegex);

    if (checkReactive) {
      return [checkReactive[1]];
    }
    return tagData;
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
    console.log("tagsData", tagsData);

    for (let atr of tagsData) {
      if (!atr) continue;

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

      console.log("atr", atr);
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

      if (!tag) continue;

      const tagData = tag.split(">");

      if (tagData[1]) {
        vdom.props.value = this.getTagValue(tagData[1]);
      } else {
        if (tag.charAt(0) !== "/") {
          const startTag = tagData[0].split(" ")[0];

          if (!vdom.children) {
            vdom.children = [];
          }

          const childDom = this.HTMLParser(i + 1, startTag);

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

      let tagName = tagSlices[0];

      if (tagName.charAt(tagName.length - 1) === "/") {
        tagName = tagName.substring(0, tagName.length - 1);
      }

      console.log("tagName", tagName, tagSlices);

      vdom.tag = tagName;

      tagSlices.splice(0, 1);

      this.getTagAttributes(tagSlices, vdom);

      roomVDOM.children?.push(vdom);
    }

    return roomVDOM;
  }
}
