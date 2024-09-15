import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.glb", "**/*.gltf", "**/*.jpg", "**/*.png", "**/*.hdr"],
  base: "./",
  build: {
    external: ["three"],
    target: ["chrome89", "edge89", "firefox89", "safari15"],
  },
  define: {
    "process.env": {},
    Buffer: ["buffer", "Buffer"],
  },
  resolve: {
    alias: {
      buffer: resolve(__dirname, "node_modules/buffer/"),
    },
  },
  optimizeDeps: {
    include: ["buffer"],
  },
});
