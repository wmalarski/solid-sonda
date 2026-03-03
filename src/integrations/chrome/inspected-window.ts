import { createResource, onCleanup } from "solid-js";

const getInspectedWindowResources = () => {
  return new Promise<chrome.devtools.inspectedWindow.Resource[]>((resolve) => {
    chrome.devtools.inspectedWindow.getResources((resources) => {
      resolve(resources);
    });
  });
};

export const createInspectedWindowResources = () => {
  const [inspectedWindowResources, { mutate }] = createResource(() =>
    getInspectedWindowResources(),
  );

  const callback = (resource: chrome.devtools.inspectedWindow.Resource) => {
    mutate((value) => (value ? [...value, resource] : [resource]));
  };

  chrome.devtools.inspectedWindow.onResourceAdded.addListener(callback);

  onCleanup(() => {
    chrome.devtools.inspectedWindow.onResourceAdded.removeListener(callback);
  });

  return inspectedWindowResources;
};
