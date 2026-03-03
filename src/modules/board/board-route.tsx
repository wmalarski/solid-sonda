import { Show, type Component } from "solid-js";
import { createInspectedWindowResources } from "~/integrations/chrome/inspected-window";
import { useDevtoolsTheme } from "~/integrations/chrome/panels";
import { ResourcesList } from "./resources-list";

export const BoardRoute: Component = () => {
  const devtoolsTheme = useDevtoolsTheme();

  const inspectedWindowResources = createInspectedWindowResources();

  return (
    <div data-theme={devtoolsTheme() === "dark" ? "business" : "corporate"}>
      <p class="bg-red-600">Hello</p>
      <Show when={inspectedWindowResources()}>
        {(resources) => <ResourcesList resources={resources()} />}
      </Show>
    </div>
  );
};
