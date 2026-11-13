import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false, // registered in src/sw.ts so native shells can skip it
      includeAssets: ['icon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'First Love Church',
        short_name: 'First Love',
        description: 'The Bible and church life in your pocket',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#fbfbfb',
        theme_color: '#fbfbfb',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        globIgnores: ['bible/**', 'frame.html'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/frame\.html$/, /^\/bible\/.*\.json$/],
        runtimeCaching: [
          // The Bible is too big to precache (14 MB). Each book is cached the first time it is opened.
          { urlPattern: ({ url }) => /^\/bible\/.+\.json$/.test(url.pathname), handler: 'CacheFirst', options: { cacheName: 'bible-v1', expiration: { maxEntries: 400 }, cacheableResponse: { statuses: [200] } } },
        ],
      },
    }),
  ],
});
