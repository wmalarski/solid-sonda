import { createMemo, type Component } from "solid-js";
import type { ReportModel, ResourceModel } from "~/integrations/sonda/schema";

type SetValueTreemapStructure = {
  asset?: ResourceModel;
  children: Map<string, SetValueTreemapStructure>;
};

type TreemapStructure = {
  asset?: ResourceModel;
  children: TreemapStructure[];
};

type ResourcesTreemapProps = {
  report: ReportModel;
  asset: ResourceModel;
  resource: chrome.devtools.inspectedWindow.Resource;
  children: ResourceModel[];
};

const setValue = (structure: SetValueTreemapStructure, paths: string[], model: ResourceModel) => {
  const current = paths.pop();

  if (!current) {
    structure.asset = model;
    return;
  }

  const existingChild = structure.children.get(current);

  if (!existingChild) {
    const newChild: SetValueTreemapStructure = { children: new Map() };
    structure.children.set(current, newChild);
    setValue(newChild, paths, model);
    return;
  }

  setValue(existingChild, paths, model);
};

const toSimpleStructure = (structure: SetValueTreemapStructure): TreemapStructure => {
  return { asset: structure.asset, children: structure.children.values().toArray() };
};

export const ResourcesTreemap: Component<ResourcesTreemapProps> = (props) => {
  const width = 100;
  const height = 100;

  const result = createMemo(() => {
    // props.children.map()

    const root: SetValueTreemapStructure = { children: new Map() };

    for (const child of props.children) {
      const paths = child.name.split("/").toReversed();
      setValue(root, paths, child);
    }

    return root;
  });

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
      <pre>{JSON.stringify(result(), null, 2)}</pre>
      <pre>{JSON.stringify(props.asset, null, 2)}</pre>
      <pre>{JSON.stringify(props.children, null, 2)}</pre>
      <pre>{JSON.stringify(props.resource, null, 2)}</pre>
      <svg class="w-full h-full z-10 isolate"></svg>
    </div>
  );
};
