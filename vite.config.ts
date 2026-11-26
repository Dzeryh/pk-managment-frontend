import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

/**
 * Configuration Vite.
 *
 * La PWA précache la coquille de l'application (HTML, JS, CSS, icône) : c'est
 * la fondation hors ligne du sprint 1. Le cache des DONNÉES métier et la file
 * de synchronisation arrivent aux sprints 6 à 8 ; rien n'est simulé ici.
 */
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'P&K Business Manager',
        short_name: 'P&K Manager',
        description: 'Gestion commerciale monoboutique de P&K Fashion and Tech.',
        lang: 'fr',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait-primary',
        background_color: '#f7f7f8',
        theme_color: '#101828',
        icons: [
          {
            src: '/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
        navigateFallback: '/index.html',
        // Les appels API ne sont JAMAIS servis depuis le cache : en sprint 1,
        // un écran hors ligne doit afficher une erreur franche, pas des
        // données périmées qui feraient croire à une vente enregistrée.
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [],
      },
      devOptions: { enabled: false },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
  },
  preview: {
    port: 4173,
    strictPort: true,
  },
});
