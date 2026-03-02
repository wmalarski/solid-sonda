import type { UserConfig } from "vite";

export const manifestPlugin = (): NonNullable<UserConfig["plugins"]>[0] => {
  return {
    generateBundle(_options) {
      const manifest = {
        description: "Solid Launch Midnight devtools",
        devtools_page: "devtools.html",
        icons: {
          "128": "images/128x128.png",
          "16": "images/16x16.png",
          "32": "images/32x32.png",
          "48": "images/48x48.png",
        },
        manifest_version: 3,
        name: "Solid Launch Midnight",
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
