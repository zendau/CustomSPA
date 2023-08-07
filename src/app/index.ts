import '../style.css'
import { SPA } from "@SPA";
import App from "@app/components/App";

const appRoot = document.getElementById("app");

new SPA(appRoot, App);
