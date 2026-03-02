/* @refresh reload */
import { render } from "solid-js/web";
import { App } from "./app";
// oxlint-disable-next-line sort-imports
import "solid-devtools";
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

/*global $0*/
// const page_getProperties = function page_getProperties() {
//   const data = window.jQuery && $0 ? jQuery.data($0) : {};
//   // Make a shallow copy with a null prototype, so that sidebar does not
//   // expose prototype.
//   const props = Object.getOwnPropertyNames(data);
//   const copy = { __proto__: null };
//   for (let i = 0; i < props.length; ++i) {
//     copy[props[i]] = data[props[i]];
//   }
//   return copy;
// };

// chrome.devtools.panels.elements.createSidebarPane("jQuery Properties", function (sidebar) {
//   function updateElementProperties() {
//     sidebar.setExpression("(" + page_getProperties.toString() + ")()");
//   }
//   updateElementProperties();
//   chrome.devtools.panels.elements.onSelectionChanged.addListener(updateElementProperties);
// });
