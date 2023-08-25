import "../style.css";
import { SPA } from "@SPA";
import App from "@app/components/App";
import { AppRouter } from "@core/libs/router";

const root = document.getElementById("app");

new SPA(App).use("router", AppRouter).mount(root);
