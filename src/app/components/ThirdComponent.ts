import { ref } from "@SPA";
import { FnComponent } from "../../core/interfaces/componentType";

const ThirdComponent: FnComponent = () => {
  const testIf = ref(true);

  function changeIf() {
    testIf.value = !testIf.value;
  }

  const body = `
    <>
    <div if='testIf' class="product-card">
    <div class="product-image"></div>
    <div class="product-title">Примерный товар</div>
    <div class="product-description">Это примерное описание товара, которое может быть довольно длинным и содержательным.</div>
    <div class="product-price">$99.99</div>
    <button class="add-to-cart-button">Добавить в корзину</button>
    </div>
    <h3>Hello third</h3>
      <button @click='changeIf'>show/hide ThirdComponent card</button>
    </>`;

  return [
    { template: body },
    {
      data: {
        testIf,
        changeIf,
      },
      onUnmounted: () => console.log("UNMOUNTED THIRD"),
      onMounted: () => console.log("MOUNTED THIRD"),
      onBeforeMounted: () => console.log("ON BEFORE MOUNTE THIRD"),
    },
  ];
};

export default ThirdComponent;
