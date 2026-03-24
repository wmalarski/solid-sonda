import { createSignal, onCleanup } from "solid-js";
import { IS_CHROME_EXTENSION } from "./constants";

const getInspectedWindowResources = async () => {
  if (IS_CHROME_EXTENSION) {
    return new Promise<chrome.devtools.inspectedWindow.Resource[]>((resolve) => {
      chrome.devtools.inspectedWindow.getResources((resources) => {
        resolve(resources);
      });
    });
  }

  const { default: data } = await import("./data.json");
  // oxlint-disable-next-line unicorn/no-abusive-eslint-disable
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion typescript/no-explicit-any
  return data as any as chrome.devtools.inspectedWindow.Resource[];
};

export const createInspectedWindowResources = () => {
  const [inspectedWindowResources, setInspectedWindowResources] = createSignal(() =>
    getInspectedWindowResources(),
  );

  const callback = (resource: chrome.devtools.inspectedWindow.Resource) => {
    setInspectedWindowResources((value) => [...value, resource]);
  };

  if (IS_CHROME_EXTENSION) {
    chrome.devtools.inspectedWindow.onResourceAdded.addListener(callback);

    onCleanup(() => {
      chrome.devtools.inspectedWindow.onResourceAdded.removeListener(callback);
    });
  }

  return inspectedWindowResources;
};
