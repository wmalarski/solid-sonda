import * as d3 from "d3";
import { createMemo, createUniqueId, For, type Component } from "solid-js";
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
  sum: number;
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

  const assetWeight = structure.asset?.uncompressed ?? 0;
  const sum = assetWeight + flatten.reduce((previous, current) => previous + current.sum, 0);

  return {
    asset: structure.asset,
    children: flatten,
    path: structure.path,
    sum,
  };
};

export const ResourcesTreemap: Component<ResourcesTreemapProps> = (props) => {
  const width = 300;
  const height = 400;

  const color = d3.scaleSequential([8, 0], d3.interpolateMagma);

  const packageStructure = createMemo(() => {
    const root: SetValueTreemapStructure = { children: new Map(), path: "/" };

    for (const child of props.children) {
      const paths = child.name.split("/").toReversed();
      setValue({ model: child, parents: [], paths, structure: root });
    }

    return toSimpleStructure(root);
  });

  const root = createMemo(() => {
    const data = packageStructure();

    const treemapFactory = d3
      .treemap<TreemapStructure>()
      .size([width, height])
      .paddingOuter(3)
      .paddingTop(19)
      .paddingInner(1)
      .round(true);

    const hierarchy = d3
      .hierarchy(data, (resource) => resource.children)
      .sum((resource) => resource.sum)
      // oxlint-disable-next-line unicorn/no-array-sort
      .sort((a, b) => b.data.sum - a.data.sum);

    return treemapFactory(hierarchy);
  });

  const shadowId = createUniqueId();

  const group = createMemo(() => d3.group(root(), (d) => d.height));

  // const hierarchy = d3
  //   .hierarchy(props.data)
  //   .sum((d) => d.value)
  //   .toSorted((a, b) => b.value - a.value);

  // d3.treemap().size([width, height]).paddingOuter(3).paddingTop(19).paddingInner(1).round(true)(
  //   hierarchy,
  // );

  return (
    <div>
      <svg
        class="w-full h-full z-10 isolate"
        // width={width}
        // height={height}
        viewBox={`0 0 ${width} ${height}`}
      >
        <filter id={shadowId}>
          <feDropShadow flood-opacity={0.3} dx={0} stdDeviation={3} />
        </filter>
        <For keyed={([entry]) => entry} each={group().entries().toArray()}>
          {(entry) => (
            <g filter={shadowId}>
              <For each={entry()[1]}>
                {(resource) => (
                  <g transform={`translate(${resource().x0},${resource().y0})`}>
                    <rect
                      fill={color(resource().height)}
                      width={resource().x1 - resource().x0}
                      height={resource().y1 - resource().y0}
                    />
                  </g>
                )}
              </For>
            </g>
          )}
        </For>
      </svg>
      {/* <pre>{JSON.stringify(packageStructure(), null, 2)}</pre>
      <pre>{JSON.stringify(props.asset, null, 2)}</pre>
      <pre>{JSON.stringify(props.children, null, 2)}</pre>
      <pre>{JSON.stringify(props.resource, null, 2)}</pre> */}
    </div>
  );
};
