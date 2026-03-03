import { createSignal, onCleanup } from "solid-js";

export const useDevtoolsTheme = () => {
  const [devtoolsTheme, setDevtoolsTheme] = createSignal(chrome.devtools.panels.themeName);

  chrome.devtools.panels.setThemeChangeHandler(setDevtoolsTheme);

  onCleanup(() => {
    chrome.devtools.panels.setThemeChangeHandler();
  });

  return devtoolsTheme;
};
