import { IVDOMElement } from "./interfaces/IVDOMElement";

const htmlExampleTest = `

<h1 id="test" class='test'>About W3Schools</h1>

<p class='box flex' title=About W3Schools>
You cannot omit quotes around an attribute value
if the value contains spaces.
</p>

<div class='container'>
<p><b>
If you move the mouse over the paragraph above,
your browser will only display the first word from the title.
</b></p>
</div>

<p data-id='qwe3'>test end</p>
`;

const tags = htmlExampleTest.replaceAll("\n", "").split("<");

export default function htmlParser(startPos = 0, htmlTag?: string) {
  const roomVDOM: IVDOMElement = {
    tag: "",
    children: [],
  };

  for (let i = startPos; i < tags.length; i++) {
    const vdome = <IVDOMElement>{};
    let tag = tags[i];

    if (!tag) continue;

    const tagData = tag.split(">");

    if (tagData[1]) {
      vdome.value = tagData[1];
    } else {
      if (tag.charAt(0) !== "/") {
        const startTag = tagData[0].split(" ")[0];

        if (!vdome.children) {
          vdome.children = [];
        }

        const childDom = htmlParser(i + 1, startTag);

        if (childDom && "pos" in childDom && childDom.vdome.children) {
          i = childDom.pos;
          vdome.children.push(...childDom.vdome.children);
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

    const classRegex = /class=(?:["']\W+\s*(?:\w+)\()?["']([^'"]+)['"]/gim;
    const classAtr = tagAtr.match(classRegex);

    if (classAtr) {
      const classes = classAtr[0]
        .replace("class=", "")
        .replace(/["']/g, "")
        .split(" ");

      vdome.class = classes;

      tagAtr = tagAtr.replace(classAtr[0], "");
    }

    const tagSlices = tagAtr.split(" ");

    vdome.tag = tagSlices[0];

    tagSlices.splice(0, 1);

    for (let atr of tagSlices) {
      if (!atr) continue;

      if (atr.includes("data-")) {
        const dataValue = atr.replace("data-", "").split("=");
        console.log("dataValue", dataValue);

        if (!vdome.dataset) {
          vdome.dataset = {};
        }

        vdome.dataset[dataValue[0]] = dataValue[1].replace(/["']/g, "");
        continue;
      }

      if (atr.includes("id=")) {
        const id = atr.replace("id=", "").replace(/["']/g, "");
        vdome.id = id;
        continue;
      }
    }

    roomVDOM.children?.push(vdome);
  }

  return roomVDOM;
}
