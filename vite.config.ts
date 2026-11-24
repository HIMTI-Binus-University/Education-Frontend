import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "./src") } },
  server: { port: 3003, watch: { ignored: ["**/*.zip"] } },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "home-motion": ["motion/react"],
          "reader-math": ["katex"],
          "reader-code": ["lowlight"],
          "reader-engine": [
            "@tiptap/pm/model",
            "@tiptap/pm/state",
            "@tiptap/pm/view",
            "@tiptap/pm/transform",
          ],
        },
      },
    },
  },
});
