import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { createHtmlPlugin } from "vite-plugin-html";
import { ROOT_ELEMENT_ID } from "./constants";
import path from "path"; // 需要先导入 path 模块
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";

export default defineConfig({
  plugins: [
    react(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), "src/assets/svg")],
      symbolId: "[name]",
    }),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          ROOT_ELEMENT_ID,
        },
      },
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/public" as *;`,
      },
    },
  },
  build: {
    outDir: "dist",
    target: "esnext",
    minify: "esbuild",
    rollupOptions: {
      output: {
        chunkFileNames: "static/[name].js",
        entryFileNames: "static/[name].js",
        assetFileNames: "static/[name].[ext]",
      },
    },
    assetsDir: "",
    cssCodeSplit: true,
    chunkSizeWarningLimit: 2000,
    sourcemap: false
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@page": path.resolve(__dirname, "./src/page"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://10.9.71.101:81",
        changeOrigin: true,
      },
    },
  },
});
