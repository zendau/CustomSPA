import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@app": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 5174,
    host: true,
  },
});
