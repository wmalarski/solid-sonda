import { createEffect, createResource, onCleanup } from "solid-js";

const getInspectedWindowResources = () => {
  return new Promise<chrome.devtools.inspectedWindow.Resource[]>((resolve) => {
    chrome.devtools.inspectedWindow.getResources((resources) => {
      resolve(resources);
    });
  });
};

const createOnResourceAdded = (
  // oxlint-disable-next-line promise/prefer-await-to-callbacks
  callback: (resource: chrome.devtools.inspectedWindow.Resource) => void,
) => {
  createEffect(() => {
    chrome.devtools.inspectedWindow.onResourceAdded.addListener(callback);
    onCleanup(() => {
      chrome.devtools.inspectedWindow.onResourceAdded.removeListener(callback);
    });
  });
};

export const createInspectedWindowResources = () => {
  const [inspectedWindowResources, { mutate }] = createResource(() =>
    getInspectedWindowResources(),
  );

  createOnResourceAdded((resource) => {
    mutate((value) => (value ? [...value, resource] : [resource]));
  });

  return inspectedWindowResources;
};
