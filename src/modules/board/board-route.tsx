import { onMount, type Component } from "solid-js";

export const BoardRoute: Component = () => {
  onMount(() => {
    // oxlint-disable-next-line typescript/no-unnecessary-condition
    console.log("chrome", chrome);
    // oxlint-disable-next-line typescript/no-unnecessary-condition
    console.log("chrome.devtools", chrome?.devtools);
    // oxlint-disable-next-line typescript/no-unnecessary-condition
    console.log("chrome.devtools.panels", chrome?.devtools?.panels);
    // oxlint-disable-next-line typescript/no-unnecessary-condition
    console.log("chrome.devtools.panels.elements", chrome?.devtools?.panels?.elements);
  });

  //   chrome.devtools.panels.create(
  //     "My Panel",
  //     "MyPanelIcon.png",
  //     "Panel.html",
  //     function BoardRoute(panel) {
  //       // code invoked on panel creation
  //       console.log("code invoked on panel creation", panel);
  //     },
  //   );

  return <p class="bg-red-600">Hello</p>;
};
