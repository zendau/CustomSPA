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

`;

type eventTypes = "click" | "input";
type eventAction = [eventTypes, () => void];

interface IVDOMElement {
  value?: string;
  id?: string;
  class?: string[];
  tag: string;
  children?: IVDOMElement[];
  dataset?: Record<string, any>;
  events?: eventAction[];
}

export default function htmlParser() {
  const tags = htmlExampleTest.replaceAll("\n", "").split("<");

  const vdome: IVDOMElement = {};

  for (let tag of tags) {
    if (!tag || tag.charAt(0) === "/") continue;

    const temp = tag.split(">");

    if (temp[1]) {
      vdome.value = temp[1];
    }

    let tagAtr = temp[0];

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

    console.log("after replace", tagAtr);

    const tagSlices = tagAtr.split(" ");

    vdome.tag = tagSlices[0];

    tagSlices.splice(0, 1);

    console.log("tagSlices", tagSlices);

    for (let atr of tagSlices) {
      if (!atr) continue;

      if (atr.includes("id=")) {
        const id = atr.replace("id=", "").replace(/["']/g, "");

        console.log("id - ", id);
      }

      console.log("atr", atr);
    }
  }
}
