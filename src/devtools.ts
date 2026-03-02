// oxlint-disable-next-line typescript/no-unnecessary-condition
console.log("2-chrome", chrome);
// oxlint-disable-next-line typescript/no-unnecessary-condition
console.log("2-chrome.devtools", chrome?.devtools);
// oxlint-disable-next-line typescript/no-unnecessary-condition
console.log("2-chrome.devtools.panels", chrome?.devtools?.panels);
// oxlint-disable-next-line typescript/no-unnecessary-condition
console.log("2-chrome.devtools.panels.elements", chrome?.devtools?.panels?.elements);

chrome.devtools.panels.create("Title", "/images/16x16.png", "index.html", (panel) => {
  console.log("2-PANEL", panel);
});
