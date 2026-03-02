import tailwindcss from "@tailwindcss/vite";
import devtools from "solid-devtools/vite";
import sonda from "sonda/vite";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import zipPack from "vite-plugin-zip-pack";
import viteTsConfigPaths from "vite-tsconfig-paths";
import { manifestPlugin } from "./src/build/manifest-plugin";

// oxlint-disable-next-line no-default-export
export default defineConfig(() => {
  const isDev = process.env.MODE === "dev";
  const isSonda = process.env.MODE === "sonda";
  return {
    build: {
      rollupOptions: { input: ["index.html", "devtools.html"] },
      sourcemap: isDev || isSonda,
      target: "esnext",
    },
    plugins: [
      devtools(),
      sonda({ enabled: isSonda, open: false }),
      viteTsConfigPaths(),
      solidPlugin(),
      tailwindcss(),
      manifestPlugin(),
      isDev || isSonda ? undefined : zipPack({ outFileName: "solid-launch-midnight.zip" }),
    ],
    server: {
      port: 3000,
    },
  };
});
