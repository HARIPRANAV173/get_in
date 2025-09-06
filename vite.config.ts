import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
  plugins: [react(), basicSsl()],
  optimizeDeps: {
    exclude: ["lucide-react", "better-sqlite3"],
  },
  define: {
    global: "globalThis",
  },
  resolve: {
    alias: {
      "better-sqlite3": "better-sqlite3/lib/database.js",
    },
  },
});