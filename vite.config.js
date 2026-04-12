import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
  VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['img/favicon.svg', 'img/robots.txt', 'img/sena.png', 'img/koe.png'],
    devOptions: {
      enabled: true,
      type: 'module',
    },
    workbox: {
      navigateFallback: "/index.html",
      globPatterns: ["**/*.{js,jsx,css,html,png,svg}"]
    },
    manifest: {
      id: '/',
      name: 'SIS Gastos',
      short_name: 'Gastos',
      description: 'Control de gastos personales con dashboard, auth y explorador de API',
      start_url: '/',
      scope: '/',
      display: 'standalone',
      background_color: '#07111f',
      theme_color: '#0f2b56',
      screenshots: [{
        src: '/img/chat.png',
        sizes: '848x444',
        type: 'image/png',
        form_factor: 'narrow',
      }],
      icons: [
        {
          src: '/img/sena.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
        {
          src: '/img/koe.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
      ],
    },
  }),
  ],
});
