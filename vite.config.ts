import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  // Charge l'env (local .env + système Cloudflare)
  const env = loadEnv(mode, process.cwd(), '');
  
  // On s'assure de récupérer la clé de n'importe quelle source
  const API_KEY = process.env.API_KEY || env.API_KEY || '';
  const MIXPANEL_TOKEN = process.env.VITE_MIXPANEL_TOKEN || env.VITE_MIXPANEL_TOKEN || '';

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: {
          name: 'Tounes Check - Fact & Price Checker Tunisia',
          short_name: 'Tounes Check',
          description: "L'assistant IA tunisien: Fact Check, Resto Check, Soum Check.",
          theme_color: '#dc2626',
          background_color: '#ffffff',
          display: 'standalone',
          orientation: 'portrait',
          scope: '/',
          start_url: '/',
          icons: [
            {
              src: '/icons/icon-72x72.png',
              sizes: '72x72',
              type: 'image/png',
              purpose: 'maskable any'
            },
            {
              src: '/icons/icon-96x96.png',
              sizes: '96x96',
              type: 'image/png',
              purpose: 'maskable any'
            },
            {
              src: '/icons/icon-128x128.png',
              sizes: '128x128',
              type: 'image/png',
              purpose: 'maskable any'
            },
            {
              src: '/icons/icon-144x144.png',
              sizes: '144x144',
              type: 'image/png',
              purpose: 'maskable any'
            },
            {
              src: '/icons/icon-152x152.png',
              sizes: '152x152',
              type: 'image/png',
              purpose: 'maskable any'
            },
            {
              src: '/icons/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'maskable any'
            },
            {
              src: '/icons/icon-384x384.png',
              sizes: '384x384',
              type: 'image/png',
              purpose: 'maskable any'
            },
            {
              src: '/icons/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable any'
            }
          ],
          shortcuts: [
            {
              name: 'Fact Check',
              short_name: 'Fact',
              description: 'Vérifier une rumeur',
              url: '/?mode=FACT',
              icons: [{ src: '/icons/icon-96x96.png', sizes: '96x96' }]
            },
            {
              name: 'Restaurant Check',
              short_name: 'Resto',
              description: 'Chercher un bon resto',
              url: '/?mode=REVIEW',
              icons: [{ src: '/icons/icon-96x96.png', sizes: '96x96' }]
            },
            {
              name: 'Price Check',
              short_name: 'Price',
              description: 'Comparer les prix',
              url: '/?mode=PRICE',
              icons: [{ src: '/icons/icon-96x96.png', sizes: '96x96' }]
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,ttf,eot}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/generativelanguage\.googleapis\.com\/.*/,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'gemini-api-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 5,
                },
              },
            },
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'images-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
              },
            },
          ],
          navigateFallback: '/index.html',
          navigateFallbackDenylist: [/^\/api\//],
        }
      })
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, './'),
      },
    },
    define: {
      'process.env.API_KEY': JSON.stringify(API_KEY),
      'process.env.VITE_MIXPANEL_TOKEN': JSON.stringify(MIXPANEL_TOKEN),
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      minify: 'esbuild',
      chunkSizeWarningLimit: 1000,
    }
  };
});