import "./style/main.css";
import { SPA } from "@spa/core";
import App from "@app/components/App";
import router from "./router";
import { storeInstance } from "./store";

const root = document.getElementById("app");

new SPA(App).use("router", router).use("store", storeInstance).mount(root);
