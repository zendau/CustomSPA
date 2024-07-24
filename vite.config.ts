import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@app": path.resolve(__dirname, "src/app"),
      "@SPA": path.resolve(__dirname, "src/core/index.ts"),
      "@core": path.resolve(__dirname, "src/core"),
    },
  },
});
