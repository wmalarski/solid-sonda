import { createEffect, For, type Component } from "solid-js";
import { createInspectedWindowResources } from "~/integrations/chrome/inspected-window";

type ResourceListItemProps = {
  resource: chrome.devtools.inspectedWindow.Resource;
};

const ResourceListItem: Component<ResourceListItemProps> = (props) => {
  createEffect(() => {
    console.log("[props]", props.resource);
  });

  return (
    <pre>
      {props.resource.url}
      {JSON.stringify(props.resource, null, 2)}
    </pre>
  );
};

export const BoardRoute: Component = () => {
  const inspectedWindowResources = createInspectedWindowResources();

  return (
    <div>
      <p class="bg-red-600">Hello</p>
      <For each={inspectedWindowResources()}>
        {(resource) => <ResourceListItem resource={resource} />}
      </For>
    </div>
  );
};
