import * as d3 from "d3";
import {
  createMemo,
  createSignal,
  createUniqueId,
  For,
  onSettled,
  Show,
  type Component,
} from "solid-js";
import { createByteUnitFormatter } from "~/integrations/i18n/format";
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

type TreemapItemProps = {
  node: d3.HierarchyRectangularNode<TreemapStructure>;
  colorInterpolation: d3.ScaleSequential<string>;
};

const TreemapItem: Component<TreemapItemProps> = (props) => {
  const byteFormatter = createByteUnitFormatter();

  const title = createMemo(() => {
    const name = props.node.data.path.split("/").at(-1);
    return `${name} - ${byteFormatter().format(props.node.data.sum)}`;
  });

  return (
    <g transform={`translate(${props.node.x0},${props.node.y0})`}>
      <rect
        fill={props.colorInterpolation(props.node.height)}
        width={props.node.x1 - props.node.x0}
        height={Math.max(props.node.y1 - props.node.y0, 12)}
      />
      <text font-size="10" y="1em">
        {title()}
      </text>
    </g>
  );
};

type TreemapSize = {
  width: number;
  height: number;
};

type TreemapContentProps = {
  size: TreemapSize;
  structure: TreemapStructure;
};

const TreemapContent: Component<TreemapContentProps> = (props) => {
  const hierarchy = createMemo(() => {
    return (
      d3
        .hierarchy(props.structure, (resource) => resource.children)
        .sum((resource) => resource.sum)
        // oxlint-disable-next-line unicorn/no-array-sort
        .sort((a, b) => b.data.sum - a.data.sum)
    );
  });

  const treemap = createMemo(() => {
    return d3
      .treemap<TreemapStructure>()
      .size([props.size.width, props.size.height])
      .paddingOuter(4)
      .paddingTop(16)
      .paddingInner(2)
      .round(true);
  });

  const shadowId = createUniqueId();

  const layers = createMemo(() => {
    const root = treemap()(hierarchy());
    return d3
      .group(root, (d) => d.depth)
      .entries()
      .toArray();
  });

  const colorInterpolation = createMemo(() =>
    d3.scaleSequential([layers().length + 1, 0], d3.interpolateMagma),
  );

  return (
    <>
      <filter id={shadowId}>
        <feDropShadow flood-opacity={0.3} dx={0} stdDeviation={3} />
      </filter>
      <For keyed={([entry]) => entry} each={layers()}>
        {(entry) => (
          <g filter={shadowId}>
            <For each={entry()[1]}>
              {(resource) => (
                <TreemapItem colorInterpolation={colorInterpolation()} node={resource()} />
              )}
            </For>
          </g>
        )}
      </For>
    </>
  );
};

type ResourcesTreemapProps = {
  report: ReportModel;
  asset: ResourceModel;
  resource: chrome.devtools.inspectedWindow.Resource;
  children: ResourceModel[];
};

export const ResourcesTreemap: Component<ResourcesTreemapProps> = (props) => {
  const packageStructure = createMemo(() => {
    const root: SetValueTreemapStructure = { children: new Map(), path: "/" };

    for (const child of props.children) {
      const paths = child.name.split("/").toReversed();
      setValue({ model: child, parents: [], paths, structure: root });
    }

    return toSimpleStructure(root);
  });

  const [containerReference, setContainerReference] = createSignal<HTMLDivElement>();
  const [size, setSize] = createSignal<TreemapSize | null>(null);

  const reloadSize = () => {
    const container = containerReference();
    if (container) {
      setSize({ height: container.clientHeight, width: globalThis.window.innerWidth * (2 / 3) });
    }
  };

  onSettled(() => {
    reloadSize();

    const abortController = new AbortController();
    globalThis.window.addEventListener("resize", reloadSize, { signal: abortController.signal });

    return () => {
      abortController.abort();
    };
  });

  return (
    <div class="w-full h-screen" ref={setContainerReference}>
      <Show when={size()}>
        {(requiredSize) => (
          <svg
            class="z-10 isolate"
            width={requiredSize().width}
            height={requiredSize().height}
            viewBox={`0 0 ${requiredSize().width} ${requiredSize().height}`}
          >
            <TreemapContent structure={packageStructure()} size={requiredSize()} />
          </svg>
        )}
      </Show>
    </div>
  );
};
