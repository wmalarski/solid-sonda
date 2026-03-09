import { createMemo, createSignal, For, Show, type Component } from "solid-js";
import type { ReportModel, ResourceModel } from "~/integrations/sonda/schema";
import { Menu, MenuItem } from "~/ui/menu/menu";
import { ResourcesTreemap } from "./resource-treemap";

type ResourceAssetEntry = {
  asset: ResourceModel;
  resource: chrome.devtools.inspectedWindow.Resource;
  children: ResourceModel[];
};

type ResourceListItemProps = {
  entry: ResourceAssetEntry;
  onClick: () => void;
  isSelected: boolean;
};

const ResourceListItem: Component<ResourceListItemProps> = (props) => {
  return (
    <MenuItem behaviour={props.isSelected ? "active" : undefined}>
      <button type="button" onClick={props.onClick} class="flex flex-col gap-1 items-start">
        <span class="font-semibold">{props.entry.resource.url}</span>
        <span>SIZE: {props.entry.asset.uncompressed}</span>
      </button>
    </MenuItem>
  );
};

const matchResourcesToAssets = (
  report: ReportModel,
  resources: chrome.devtools.inspectedWindow.Resource[],
) => {
  // oxlint-disable-next-line typescript/no-explicit-any
  const scriptResources = resources.filter((resource) =>
    "type" in resource ? resource.type === "script" : true,
  );

  const pairs: ResourceAssetEntry[] = [];

  let reportResources = report.resources;

  for (const resource of scriptResources) {
    const url = new URL(resource.url);

    let asset: ResourceModel | null = null;
    const keep: ResourceModel[] = [];
    const children: ResourceModel[] = [];

    for (const reportResource of reportResources) {
      if (reportResource.name.includes(url.pathname)) {
        asset = reportResource;
      } else if (reportResource.parent?.includes(url.pathname)) {
        children.push(reportResource);
      } else {
        keep.push(reportResource);
      }
    }

    reportResources = keep;

    if (asset) {
      pairs.push({ asset, children, resource });
    }
  }

  return pairs;
};

type ResourceListProps = {
  report: ReportModel;
  resources: chrome.devtools.inspectedWindow.Resource[];
};

export const ResourcesList: Component<ResourceListProps> = (props) => {
  const matched = createMemo(() => matchResourcesToAssets(props.report, props.resources));

  const [selectedIndex, setSelectedIndex] = createSignal(0);
  const selected = createMemo(() => matched().at(selectedIndex()));

  const onClickFactory = (index: number) => () => {
    setSelectedIndex(index);
  };

  return (
    <div class="grid grid-cols-[1fr_2fr] gap-1">
      <Menu class="w-full">
        <For each={matched()} keyed={(entry) => entry.asset.name}>
          {(entry, index) => (
            <ResourceListItem
              isSelected={selectedIndex() === index()}
              entry={entry()}
              onClick={onClickFactory(index())}
            />
          )}
        </For>
      </Menu>
      <div>
        <Show when={selected()}>
          {(entry) => (
            <ResourcesTreemap
              asset={entry().asset}
              children={entry().children}
              resource={entry().resource}
            />
          )}
        </Show>
      </div>
    </div>
  );
};
