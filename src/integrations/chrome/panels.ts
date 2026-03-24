import { createSignal, onCleanup } from "solid-js";
import { IS_CHROME_EXTENSION } from "./constants";

export const useDevtoolsTheme = () => {
  const [devtoolsTheme, setDevtoolsTheme] = createSignal(
    IS_CHROME_EXTENSION ? chrome.devtools.panels.themeName : "dark",
  );

  if (IS_CHROME_EXTENSION) {
    chrome.devtools.panels.setThemeChangeHandler(setDevtoolsTheme);

    onCleanup(() => {
      chrome.devtools.panels.setThemeChangeHandler();
    });
  }

  return devtoolsTheme;
};
