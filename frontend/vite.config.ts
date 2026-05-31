import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react({
      babel: {
        presets: [reactCompilerPreset()],
      },
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['pwa-icon.svg', 'favicon.svg'],
      manifest: {
        name: 'საგამოდო — საქართველო',
        short_name: 'საგამოდო',
        description: 'საქართველოს საგამოდო გამოცდის სასწავლო პლატფორმა',
        theme_color: '#0d1f0d',
        background_color: '#0d1f0d',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: 'pwa-icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,jpeg,webp,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^\/api\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
          {
            urlPattern: /^\/(maps|signs|city-photos|sign-library|location-photos)\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5178',
        changeOrigin: true,
      },
      '/maps': {
        target: 'http://localhost:5178',
        changeOrigin: true,
      },
      '/signs': {
        target: 'http://localhost:5178',
        changeOrigin: true,
      },
      '/city-photos': {
        target: 'http://localhost:5178',
        changeOrigin: true,
      },
      '/sign-library': {
        target: 'http://localhost:5178',
        changeOrigin: true,
      },
      '/location-photos': {
        target: 'http://localhost:5178',
        changeOrigin: true,
      },
    },
  },
})
