import { For, type Component } from "solid-js";

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

type ResourceListProps = {
  resources: chrome.devtools.inspectedWindow.Resource[];
};

export const ResourcesList: Component<ResourceListProps> = (props) => {
  return <For each={props.resources}>{(resource) => <ResourceListItem resource={resource} />}</For>;
};
