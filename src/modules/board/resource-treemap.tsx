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

const colorInterpolation = d3.scaleSequential([8, 0], d3.interpolateMagma);

type TreemapItemProps = {
  node: d3.HierarchyRectangularNode<TreemapStructure>;
};

const TreemapItem: Component<TreemapItemProps> = (props) => {
  return (
    <g transform={`translate(${props.node.x0},${props.node.y0})`}>
      <rect
        fill={colorInterpolation(props.node.height)}
        width={props.node.x1 - props.node.x0}
        height={props.node.y1 - props.node.y0}
      />
      {/* <text class="z-50" y="1em">
        {title()}
      </text> */}
    </g>
  );
};

type TreemapTitleProps = {
  node: d3.HierarchyRectangularNode<TreemapStructure>;
};

const TreemapTitle: Component<TreemapTitleProps> = (props) => {
  const byteFormatter = createByteUnitFormatter();

  const title = createMemo(() => {
    const name = props.node.data.path.split("/").at(-1);
    return `${name} - ${byteFormatter().format(props.node.data.sum)}`;
  });

  return (
    <g transform={`translate(${props.node.x0},${props.node.y0})`}>
      <text font-size="10" class="z-50" y="1em">
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
    // console.log("[hierarchy]", props.structure);
    return (
      d3
        .hierarchy(props.structure, (resource) => resource.children)
        .sum((resource) => resource.sum)
        // oxlint-disable-next-line unicorn/no-array-sort
        .sort((a, b) => b.data.sum - a.data.sum)
    );
  });

  const treemap = createMemo(() => {
    // console.log("[treemap]", props.size.width, props.size.height);
    return d3
      .treemap<TreemapStructure>()
      .size([props.size.width, props.size.height])
      .paddingOuter(3)
      .paddingTop(19)
      .paddingInner(1)
      .round(true);
  });

  const root = createMemo(() => {
    // console.log("[root]", treemap(), hierarchy());
    return treemap()(hierarchy());
  });

  const shadowId = createUniqueId();

  const group = createMemo(() => d3.group(root(), (d) => d.height));

  const layers = createMemo(() => group().entries().toArray());

  return (
    <>
      <filter id={shadowId}>
        <feDropShadow flood-opacity={0.3} dx={0} stdDeviation={3} />
      </filter>
      <For keyed={([entry]) => entry} each={layers()}>
        {(entry) => (
          <g filter={shadowId}>
            <For each={entry()[1]}>{(resource) => <TreemapItem node={resource()} />}</For>
          </g>
        )}
      </For>
      <For keyed={([entry]) => entry} each={layers()}>
        {(entry) => <For each={entry()[1]}>{(resource) => <TreemapTitle node={resource()} />}</For>}
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
  // const [svgReference, setSvgReference] = createSignal<SVGSVGElement>();
  const [size, setSize] = createSignal<TreemapSize | null>(null);

  const reloadSize = () => {
    const container = containerReference();
    // const svg = svgReference();
    if (container) {
      // console.log("[container]", {
      //   h1: svg?.height,
      //   h2: svg?.clientHeight,
      //   h3: svg?.scrollHeight,
      //   height: container.clientHeight,
      //   w1: svg?.width,
      //   w2: svg?.clientWidth,
      //   w3: svg?.scrollWidth,
      //   width: container.clientWidth,
      // });
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
            // ref={setSvgReference}
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
  // {/* <pre>{JSON.stringify(packageStructure(), null, 2)}</pre>
  // <pre>{JSON.stringify(props.asset, null, 2)}</pre>
  // <pre>{JSON.stringify(props.children, null, 2)}</pre>
  // <pre>{JSON.stringify(props.resource, null, 2)}</pre> */}
};
