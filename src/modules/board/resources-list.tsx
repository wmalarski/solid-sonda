import { Key } from "@solid-primitives/keyed";
import { createMemo, type Component } from "solid-js";
import type { ReportModel, ResourceModel } from "~/integrations/sonda/schema";
import { List, ListRow } from "~/ui/list/list";

type ResourceAssetEntry = {
  asset: ResourceModel;
  resource: chrome.devtools.inspectedWindow.Resource;
  children: ResourceModel[];
};

type ResourceListItemProps = {
  entry: ResourceAssetEntry;
};

const ResourceListItem: Component<ResourceListItemProps> = (props) => {
  return (
    <ListRow>
      <pre>
        {props.entry.resource.url}
        {JSON.stringify(props.entry.asset, null, 2)}
      </pre>
    </ListRow>
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

  return (
    <div>
      <List>
        <Key each={matched()} by={(entry) => entry.asset.name}>
          {(entry) => <ResourceListItem entry={entry()} />}
        </Key>
      </List>
    </div>
  );
};
