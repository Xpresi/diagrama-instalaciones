import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/diagrama-instalaciones/',
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Diagrama de Conexiones',
        short_name: 'Diagrama',
        theme_color: '#1e293b',
        background_color: '#0f172a',
        display: 'standalone',
        icons: [{ src: 'icon-192.png', sizes: '192x192', type: 'image/png' }],
      },
      workbox: { globPatterns: ['**/*.{js,css,html,png,svg}'] },
    }),
  ],
})
