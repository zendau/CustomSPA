# CustomSPA

## Описание

CustomSPA — это SPA-фреймворк, созданный как пет-проект для изучения и экспериментирования с современными веб-технологиями. Этот проект предназначен для создания одностраничных приложений и сочетает в себе простоту и гибкость, предоставляя разработчикам инструменты для эффективной работы.

CustomSPA был разработан с целью предоставления мощных возможностей для создания интерактивных и реактивных приложений, несмотря на то, что он находится в стадии активного развития. Проект охватывает основные аспекты разработки SPA-приложений и поддерживает TypeScript, что обеспечивает строгую типизацию и улучшает процесс разработки.

## Основные возможности:

- **Виртуальный DOM**: Оптимизирует рендеринг и минимизирует прямые манипуляции с реальным DOM для повышения производительности.
- **Реактивность**: Поддерживает реактивное управление состоянием с помощью ref для примитивных данных, reactivity для объектов и computed для вычисляемых свойств.
- **Жизненный цикл компонентов**: Предоставляет хуки для управления жизненным циклом компонентов, такие как onMounted и onUpdated.
- **Компоненты**: Позволяет создавать компоненты, объединяющие JavaScript, HTML и CSS, для модульной и повторно используемой архитектуры.
- **Условный рендеринг и списки**: Поддерживает условный рендеринг элементов и динамическое создание списков с оптимизацией обновлений.
- **Обработка событий**: Удобный механизм для обработки различных событий, таких как click и input.
- **Передача пропсов и слотов**: Простая передача данных и шаблонов между компонентами.
- **Provide и Inject**: Позволяет передавать данные через дерево компонентов с использованием provide и inject.

## Установка и запуск

### Предварительные требования

- Node.js версии 20.x и выше
- pnpm

### Клонирование репозитория

```sh
git clone https://github.com/username/project-name.git
cd project-name
```

### Установка зависимостей

Установите все зависимости проекта, включая **pnpm**, используемый для управления зависимостями в workspace:

```sh
pnpm install
```

### Создание нового проекта

Создайте новый проект, используя стартовый шаблон, предоставленный в папке `apps/template`. Скопируйте содержимое шаблона в новую директорию вашего проекта:

```sh
cd apps
cp -r template my-new-app
cd my-new-app
```

### Установка зависимостей для нового проекта

Установите зависимости для нового проекта и запустите его:

```sh
pnpm install
pnpm dev
```

## Основные концепции

Для полного понимания ключевых концепций и возможностей **CustomSPA**, ознакомьтесь с [Основными концепциями](CONCEPTS.md).


## Библиотеки

**CustomSPA** включает несколько встроенных библиотек, которые облегчают разработку и расширяют функциональность фреймворка. Ниже описаны основные библиотеки, их назначение и как их использовать.

### @spa/core

`@spa/core` является основной библиотекой **CustomSPA**, предоставляющей основные функции фреймворка, такие как реактивность, создание компонентов и управление жизненным циклом.

#### Основные функции:

- **ref**: Создание реактивных примитивных данных.
- **reactivity**: Создание реактивных объектов.
- **computed**: Создание вычисляемых свойств.
- **onMounted** и **onUpdated**: Хуки жизненного цикла для компонентов.

#### Пример использования:

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
```

### @spa/router

`@spa/router` предоставляет функциональность маршрутизации для управления навигацией в приложениях **CustomSPA**.

#### Основные функции:

- **useRoute**: Хук для доступа к текущему маршруту.
- **Link**: Компонент для создания ссылок и навигации.
- **Router**: Компонент для определения маршрутов и их конфигурации.

#### Пример использования:

```javascript
import App from "../components/App";
import PageNotFound from "@app/components/PageNotFound";
import TestPage from "@app/components/TestPage";
import TestPageNested from "@app/components/TestPageNested";
import { Router, IRoute } from "@spa/router";

const routes: IRoute[] = [
  { path: "/", component: App },
  {
    path: "/test",
    param: { value: "id", param: { value: "q", param: { value: "w" } } },
    children: [
      {
        path: "/nested",
        component: TestPageNested,
        param: { value: "category" },
        isNestedPatams: true,
      },
    ],
    component: TestPage,
  },
  {
    path: "/404",
    component: PageNotFound,
  },
];

export default new Router(routes);
```

### @spa/store

`@spa/store` предоставляет модуль для управления состоянием приложения с использованием концепций `state` и `actions`.

#### Основные функции:

- **useStore**: Хук для доступа и управления состоянием приложения.
- **state**: Объект для хранения состояния.
- **actions**: Функции для изменения состояния и выполнения логики.

#### Пример использования:

```javascript
import { createModule } from "@spa/store";

const state = {
  t: "hello world",
};

const actions = {
  add(store: { state: any, actions: any }, a: number, b: number): any {
    console.log("test", store, a, b);
  },
  changeText(store: any) {
    store.state.t = "CHANGED TEXT";
  },
};

const store = createModule({
  state,
  actions,
});

export default store;
```

```javascript
import { createStore } from "@spa/store";
import first from "./modules/first";
import second from "./modules/second";

const { useStore, storeInstance } = createStore({
  first,
  second,
});

export { useStore, storeInstance };
```
