import { reactivity, ref, FnComponent, provide, computed } from "@spa/core";
import SecondComponent from "@app/components/SecondComponent";
import { useStore } from "@app/store";
import { Link } from "@spa/router";

const App: FnComponent = () => {
  const testRef = ref(2);
  const testIf = ref(true);

  provide("test", "hello world");

  const store = useStore();
  // console.log('testRef', testRef)

  const testRef2 = reactivity({ number: { test: 2 } });
  // console.log("testRef2", testRef2.number.test);

  function changeIf() {
    testIf.value = !testIf.value;
  }

  function changeStoreText() {
    store.first.actions.changeText();
  }

  function changeStoreText2() {
    testRef2.number.test++;
  }

  const body = /*html*/ `
  <>
    <Link to='/test/one/two/three'><p>TEST PAGE</p></Link>
    <h3>Test store text value - {textValue.first.state.t}</h3>
    <button @click='changeStoreText'>change text</button>
    <h3>Test dot text value - {testDot}</h3>
    <button @click='changeStoreText2'>change text</button>
    <p class='box find'>{testRef}</p>
    <div>
    <button id='test' @click='testInc'>Inc</button>
    <button @click='testDec'>Dec</button>
    </div>
    <input id='one' @input='testDec'/>
    <input id='two' />



    <button @click='changeIf'>Test if</button>

    <SecondComponent if='testIf' msg='test message' :id='testRef'/>
    <h1>END</h1>

  </>`;

  const style = /*css*/ `

  button[scoped] {
    color: red;
    font-size: 26px;
  }

  button {
    border-radius: 10%;
  }

  `;

  function testInc() {
    testRef.value++;
  }

  function testDec() {
    testRef.value--;
  }

  return [
    { template: body, style },
    {
      components: { SecondComponent, Link },
      data: {
        testIf,
        testRef,
        testDot: computed(() => testRef2.number.test * testRef.value),
        testDot2: testRef2.number.test,
        changeIf,
        testInc,
        testDec,
        textValue: store,
        changeStoreText,
        changeStoreText2,
      },
      onBeforeUpdate: () => console.log("BEFORE UPDATE APP"),
      onUpdate: () => console.log("UPDATE APP"),
    },
  ];
};

export default App;
