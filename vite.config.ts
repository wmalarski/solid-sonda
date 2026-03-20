import tailwindcss from "@tailwindcss/vite";
import solidPlugin from "vite-plugin-solid";
import { defineConfig, type UserConfig } from "vite-plus";

const isDev = process.env.MODE === "dev";
const isSonda = process.env.MODE === "sonda";

const lint: UserConfig["lint"] = {
  categories: {
    correctness: "error",
    nursery: "error",
    pedantic: "error",
    perf: "error",
    restriction: "error",
    style: "error",
    suspicious: "error",
  },
  globals: {
    AbortController: "readonly",
    FileReader: "readonly",
    FormData: "readonly",
    HTMLElement: "readonly",
    URL: "readonly",
    chrome: "readonly",
    console: "readonly",
    document: "readonly",
    process: "readonly",
  },
  jsPlugins: [],
  options: {
    typeAware: true,
    typeCheck: true,
  },
  plugins: ["import", "typescript", "unicorn", "jsx-a11y", "oxc", "promise"],
  rules: {
    "eslint/arrow-body-style": "off",
    "eslint/capitalized-comments": "off",
    "eslint/complexity": "off",
    "eslint/id-length": "off",
    "eslint/max-lines": "off",
    "eslint/max-lines-per-function": "off",
    "eslint/max-statements": "off",
    "eslint/no-empty-function": "off",
    "eslint/no-magic-numbers": "off",
    "eslint/no-ternary": "off",
    "eslint/no-undefined": "off",
    "eslint/prefer-destructuring": "off",
    "eslint/sort-imports": "off",
    "import/consistent-type-specifier-style": "off",
    "import/exports-last": "off",
    "import/group-exports": "off",
    "import/max-dependencies": "off",
    "import/no-named-export": "off",
    "import/no-namespace": "off",
    "import/no-relative-parent-imports": "off",
    "import/no-unassigned-import": "off",
    "import/prefer-default-export": "off",
    "oxc/no-async-await": "off",
    "oxc/no-optional-chaining": "off",
    "oxc/no-rest-spread-properties": "off",
    "promise/avoid-new": "off",
    "promise/catch-or-return": "off",
    "typescript/consistent-type-definitions": "off",
    "typescript/explicit-function-return-type": "off",
    "typescript/explicit-module-boundary-types": "off",
    "typescript/no-misused-promises": ["error", { checksVoidReturn: false }],
    "typescript/prefer-readonly-parameter-types": "off",
    "typescript/promise-function-async": "off",
    "typescript/strict-boolean-expressions": "off",
    "typescript/strict-void-return": "off",
    "unicorn/no-array-reduce": "off",
    "unicorn/no-null": "off",
    "unicorn/number-literal-case": "off",
    "unicorn/numeric-separators-style": "off",
    "unicorn/prefer-dom-node-append": "off",
    "unicorn/prefer-dom-node-remove": "off",
  },
  settings: {},
};

const manifestPlugin = (): NonNullable<UserConfig["plugins"]>[0] => {
  return {
    generateBundle(_options) {
      const manifest = {
        description: "Solid Sonda devtools",
        devtools_page: "devtools.html",
        icons: {
          "128": "images/128x128.png",
          "16": "images/16x16.png",
          "32": "images/32x32.png",
          "48": "images/48x48.png",
        },
        manifest_version: 3,
        name: "Solid Sonda",
        // permissions: ["sidePanel", "activeTab", "storage"],
        version: "1.0",
      };

      this.emitFile({
        fileName: "manifest.json",
        source: JSON.stringify(manifest, null, 2),
        type: "asset",
      });
    },
    name: "chrome-extension-manifest-plugin",
  };
};

// oxlint-disable-next-line no-default-export
export default defineConfig({
  build: {
    rollupOptions: { input: ["index.html", "devtools.html"] },
    sourcemap: isDev || isSonda,
    target: "esnext",
  },
  devtools: true,
  lint,
  plugins: [
    solidPlugin(),
    tailwindcss(),
    manifestPlugin(),
    // isDev || isSonda ? null : zipPack({ outFileName: "solid-sonda.zip" }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: 3000,
  },
  staged: {
    "*": "vp check --fix",
  },
});
