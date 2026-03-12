import { createMemo, type Component } from "solid-js";
import type { ReportModel, ResourceModel } from "~/integrations/sonda/schema";

type SetValueTreemapStructure = {
  asset?: ResourceModel;
  path: string;
  children: Map<string, SetValueTreemapStructure>;
};

type TreemapStructure = {
  asset?: ResourceModel;
  children: TreemapStructure[];
  path: string;
};

type ResourcesTreemapProps = {
  report: ReportModel;
  asset: ResourceModel;
  resource: chrome.devtools.inspectedWindow.Resource;
  children: ResourceModel[];
};

type SetValueArgs = {
  structure: SetValueTreemapStructure;
  paths: string[];
  model: ResourceModel;
  parents: string[];
};

const setValue = (args: SetValueArgs) => {
  const current = args.paths.pop();

  if (!current) {
    args.structure.asset = args.model;
    return;
  }

  args.parents.push(current);
  const existingChild = args.structure.children.get(current);

  if (!existingChild) {
    const newChild: SetValueTreemapStructure = {
      children: new Map(),
      path: args.parents.join("/"),
    };
    args.structure.children.set(current, newChild);
    setValue({ ...args, structure: newChild });
    return;
  }

  setValue({ ...args, structure: existingChild });
};

const toSimpleStructure = (structure: SetValueTreemapStructure): TreemapStructure => {
  const children = structure.children
    .values()
    .toArray()
    .map((value) => toSimpleStructure(value));

  const flatten =
    children.length === 1 && children[0].children.length > 0 ? children[0].children : children;

  return {
    asset: structure.asset,
    children: flatten,
    path: structure.path,
  };
};

export const ResourcesTreemap: Component<ResourcesTreemapProps> = (props) => {
  // const width = 100;
  // const height = 100;

  const result = createMemo(() => {
    const root: SetValueTreemapStructure = { children: new Map(), path: "/" };

    for (const child of props.children) {
      const paths = child.name.split("/").toReversed();
      setValue({ model: child, parents: [], paths, structure: root });
    }

    return toSimpleStructure(root);
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
