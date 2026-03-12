import tailwindcss from "@tailwindcss/vite";
import sonda from "sonda/vite";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import zipPack from "vite-plugin-zip-pack";
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
      sonda({ enabled: isSonda, open: false }),
      solidPlugin(),
      tailwindcss(),
      manifestPlugin(),
      isDev || isSonda ? undefined : zipPack({ outFileName: "solid-launch-midnight.zip" }),
    ],
    resolve: {
      tsconfigPaths: true,
    },
    server: {
      port: 3000,
    },
  };
});
