import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt",
      manifest: {
        name: "Khalid Cut",
        short_name: "Khalid Cut",
        description: "Move well. Build strength. Find your balance.",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#f7f7f8",
        theme_color: "#f7f7f8",
        lang: "ar",
        dir: "rtl",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icon-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,woff2,webp,png,svg}"],
        dontCacheBustURLsMatching: /assets\/.+-[\w-]{8}\.(?:js|css)$/,
        navigateFallback: "/index.html",
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 3500000,
      },
    }),
  ],
  build: { target: "es2022", chunkSizeWarningLimit: 700 },
});
