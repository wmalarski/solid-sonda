import { createMemo, For, type Component } from "solid-js";
import type { ReportModel } from "~/integrations/sonda/schema";

type ResourceListItemProps = {
  resource: chrome.devtools.inspectedWindow.Resource;
};

const ResourceListItem: Component<ResourceListItemProps> = (props) => {
  return (
    <pre>
      {props.resource.url}
      {JSON.stringify(props.resource, null, 2)}
    </pre>
  );
};

const matchResources = (
  report: ReportModel,
  resources: chrome.devtools.inspectedWindow.Resource[],
) => {
  console.log({ report, resources });

  return true;
};

type ResourceListProps = {
  report: ReportModel;
  resources: chrome.devtools.inspectedWindow.Resource[];
};

export const ResourcesList: Component<ResourceListProps> = (props) => {
  const matched = createMemo(() => matchResources(props.report, props.resources));

  return (
    <>
      <pre>{JSON.stringify(matched(), null, 2)}</pre>
      <For each={props.resources}>{(resource) => <ResourceListItem resource={resource} />}</For>
    </>
  );
};
