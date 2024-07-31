# Основные концепции

## Виртуальный DOM

**CustomSPA** использует виртуальный DOM для оптимизации рендеринга и минимизации прямых манипуляций с реальным DOM. Это повышает производительность и упрощает процесс обновления интерфейса.

## Реактивность

Реактивность является ключевой функцией **CustomSPA**, позволяющей автоматическое обновление интерфейса при изменении данных.

- **ref**: Используется для создания реактивных примитивных данных.

  ```javascript
  import { ref } from "@spa/core";
  const count = ref(0);
  ```

- **reactivity**: Используется для создания реактивных объектов.

  ```javascript
  import { reactivity } from "@spa/core";
  const state = reactivity({ count: 0 });
  ```

- **computed**: Используется для создания вычисляемых свойств, которые автоматически пересчитываются при изменении зависимостей.

  ```javascript
  import { computed } from '@spa/core';
  const doubleCount = computed(() => state.count \* 2);
  ```

## Жизненный цикл компонентов

**CustomSPA** предоставляет хуки жизненного цикла, позволяющие выполнять определённые действия на различных этапах жизни компонента.

- **onMounted**: Вызывается после того, как компонент был смонтирован.

  ```javascript
  import { onMounted } from "@spa/core";
  onMounted(() => {
    console.log("Component has been mounted!");
  });
  ```

- **onUpdated**: Вызывается после того, как компонент был обновлён.

  ```javascript
  import { onUpdated } from "@spa/core";
  onUpdated(() => {
    console.log("Component has been updated!");
  });
  ```

## Компоненты

Компоненты являются основными строительными блоками **CustomSPA**. Они могут содержать исполняемый код, HTML-шаблон и стили.

```javascript
import { ref, FnComponent } from "@spa/core";

const App: FnComponent = () => {
  const counter = ref(0);

  const body = /*html*/ `
  <>
    <h1>Hello world</h1>
    <p>{counter}</p>
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

  return [
    { template: body, style },
    {
      data: {
        counter,
      },
      onMounted: () => console.log("Mounted app"),
      onUpdate: () => console.log("Updated app"),
    },
  ];
};

export default App;
```

## Условный рендеринг и списки

**CustomSPA** поддерживает условный рендеринг и динамическое создание списков.

- **if**: Для условного рендеринга элементов или компонентов.

  ```html
  <div if="isVisible">Visible Content</div>
  ```

- **for**: Для перебора массивов и создания элементов или компонентов.

  ```html
  <ul>
    <li for="item in items">{{ item.name }}</li>
  </ul>
  ```

## Обработка событий

**CustomSPA** предоставляет удобный механизм для обработки событий, таких как `click` и `input`.

```html
<button @click="handleClick">Click me</button>
```

## Передача пропсов и слотов

Компоненты могут передавать данные и шаблоны с использованием пропсов и слотов.

- **Пропсы**: Для передачи данных в дочерние компоненты.

  ```html
  <child-component :message="parentMessage"></child-component>
  ```

- **Слоты**: Для передачи шаблонов в дочерние компоненты.

  ```html
  <child-component>
  <template v-slot:default>
  <p>Content goes here</p>
  </template>
  </child-component>
  ```

## Provide и Inject

**CustomSPA** позволяет передавать данные через дерево компонентов с использованием `provide` и `inject`.

- **provide**: Для предоставления данных.

  ```javascript
  import { provide } from '@spa/core';
  provide('key', value);
  ```

- **inject**: Для получения данных.

  ```javascript
  import { inject } from '@spa/core';
  const value = inject('key');
  ```

