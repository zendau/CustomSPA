import "../style.css";
import { SPA } from "@SPA";
import App from "@app/components/App";
import router from "./router";

const root = document.getElementById("app");

new SPA(App).use("router", router).mount(root);
