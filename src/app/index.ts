import "../style.css";
import { SPA } from "@SPA";
import App from "@app/components/App";
import router from "./router";
import { storeInstance } from "./store";

const root = document.getElementById("app");

new SPA(App).use("router", router).use("store", storeInstance).mount(root);
