import { Show, type Component } from "solid-js";
import { createInspectedWindowResources } from "~/integrations/chrome/inspected-window";
import { useDevtoolsTheme } from "~/integrations/chrome/panels";
import { ReportUploadForm } from "./report-upload-form";
import { ResourcesList } from "./resources-list";

export const BoardRoute: Component = () => {
  const devtoolsTheme = useDevtoolsTheme();

  const inspectedWindowResources = createInspectedWindowResources();

  return (
    <div data-theme={devtoolsTheme() === "dark" ? "business" : "corporate"}>
      <ReportUploadForm />
      <Show when={inspectedWindowResources()}>
        {(resources) => <ResourcesList resources={resources()} />}
      </Show>
    </div>
  );
};
