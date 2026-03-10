import type { Component } from "solid-js";
import type { ResourceModel } from "~/integrations/sonda/schema";

type ResourcesTreemapProps = {
  asset: ResourceModel;
  resource: chrome.devtools.inspectedWindow.Resource;
  children: ResourceModel[];
};

export const ResourcesTreemap: Component<ResourcesTreemapProps> = (props) => {
  const width = 100;
  const height = 100;

  // const dd = createMemo(() => {
  //   d3.hierarchy()

  //   return null;
  // })

  // const hierarchy = d3
  //   .hierarchy(props.data)
  //   .sum((d) => d.value)
  //   .toSorted((a, b) => b.value - a.value);

  // d3.treemap().size([width, height]).paddingOuter(3).paddingTop(19).paddingInner(1).round(true)(
  //   hierarchy,
  // );

  return (
    <div>
      <pre>{JSON.stringify(props.asset, null, 2)}</pre>
      <pre>{JSON.stringify(props.children, null, 2)}</pre>
      <pre>{JSON.stringify(props.resource, null, 2)}</pre>
      <svg class="w-full h-full z-10 isolate"></svg>
    </div>
  );
};
