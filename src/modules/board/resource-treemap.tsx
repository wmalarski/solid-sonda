import type { Component } from "solid-js";
import type { ResourceModel } from "~/integrations/sonda/schema";

type ResourcesTreemapProps = {
  asset: ResourceModel;
  resource: chrome.devtools.inspectedWindow.Resource;
  children: ResourceModel[];
};

export const ResourcesTreemap: Component<ResourcesTreemapProps> = (props) => {
  return (
    <div>
      <pre>{JSON.stringify(props.asset, null, 2)}</pre>
      <pre>{JSON.stringify(props.children, null, 2)}</pre>
      <pre>{JSON.stringify(props.resource, null, 2)}</pre>
    </div>
  );
};
