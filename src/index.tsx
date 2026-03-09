/* @refresh reload */
import { render } from "@solidjs/web";
import { App } from "./app";
// oxlint-disable-next-line sort-imports
import "./index.css";

const root = document.querySelector("#root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}

if (root) {
  render(() => <App />, root);
}
