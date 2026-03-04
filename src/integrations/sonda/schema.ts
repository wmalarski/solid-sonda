import * as v from "valibot";

const ConnectionSchema = v.object({
  kind: v.union([v.literal("import"), v.literal("entrypoint")]),
  original: v.nullable(v.string()),
  source: v.string(),
  target: v.string(),
});

export type ConnectionModel = v.InferOutput<typeof ConnectionSchema>;

const DependencySchema = v.object({
  name: v.string(),
  paths: v.array(v.string()),
});

export type DependencyModel = v.InferOutput<typeof DependencySchema>;

const ResourceSchema = v.object({
  brotli: v.optional(v.number()),
  format: v.optional(v.union([v.literal("other"), v.literal("esm"), v.literal("cjs")])),
  gzip: v.optional(v.number()),
  kind: v.union([
    v.literal("sourcemap"),
    v.literal("chunk"),
    v.literal("filesystem"),
    v.literal("asset"),
  ]),
  name: v.string(),
  parent: v.nullish(v.string()),
  type: v.union([v.literal("other"), v.literal("script"), v.literal("style")]),
  uncompressed: v.number(),
});

export type ResourceModel = v.InferOutput<typeof ResourceSchema>;

export const ReportAsyncSchema = v.objectAsync({
  connections: v.array(ConnectionSchema),
  dependencies: v.array(DependencySchema),
  resources: v.array(ResourceSchema),
});

export type ReportModel = v.InferOutput<typeof ReportAsyncSchema>;
