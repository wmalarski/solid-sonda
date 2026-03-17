import { createSignal, Show, type Component } from "solid-js";
import { createInspectedWindowResources } from "~/integrations/chrome/inspected-window";
import { useDevtoolsTheme } from "~/integrations/chrome/panels";
import type { ReportModel } from "~/integrations/sonda/schema";
import { ReportUploadForm } from "./report-upload-form";
import { ResourcesList } from "./resources-list";

type ReportBoardProps = {
  report: ReportModel;
};

const ReportBoard: Component<ReportBoardProps> = (props) => {
  const inspectedWindowResources = createInspectedWindowResources();

  return (
    <Show when={inspectedWindowResources()}>
      {(resources) => <ResourcesList report={props.report} resources={resources()} />}
    </Show>
  );
};

export const BoardRoute: Component = () => {
  const devtoolsTheme = useDevtoolsTheme();

  const [report, setReport] = createSignal<ReportModel>();

  return (
    <div class="h-full" data-theme={devtoolsTheme() === "dark" ? "business" : "corporate"}>
      <Show when={report()} fallback={<ReportUploadForm onReportSubmit={setReport} />}>
        {(reportValue) => <ReportBoard report={reportValue()} />}
      </Show>
    </div>
  );
};
