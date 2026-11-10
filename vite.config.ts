import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { port: 3000, watch: { ignored: ["**/*.zip"] } },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
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
