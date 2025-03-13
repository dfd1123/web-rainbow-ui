import { defineConfig } from "vite";

import federation from "@originjs/vite-plugin-federation";
import react from "@vitejs/plugin-react";

import { dependencies } from "./package.json";
// https://vite.dev/config/
export default defineConfig({
  build: {
    target: "esnext",
  },
  plugins: [
    react(),
    federation({
      name: "video",
      filename: "remoteEntry.js",
      // Modules to expose
      exposes: {
        "./App": "./src/App.tsx",
      },
      shared: {
        react: {
          shareScope: "shell",
          requiredVersion: dependencies.react,
        },
        "react-dom": {
          shareScope: "shell",
          requiredVersion: dependencies.react,
        },
      },
    }),
  ],
  server: {
    port: 5173,
  },
  preview: {
    port: 5173,
  },
});
