const ThirdComponent = () => {
  const body = `
    <>
      <h3>Hello third</h3>
      <main class="product-card">
        <div class="product-image"></div>
        <div class="product-title">Примерный товар</div>
        <div class="product-description">Это примерное описание товара, которое может быть довольно длинным и содержательным.</div>
        <div class="product-price">$99.99</div>
        <button class="add-to-cart-button">Добавить в корзину</button>
      </main>
    </>`;

  return [body];
};

export default ThirdComponent;
