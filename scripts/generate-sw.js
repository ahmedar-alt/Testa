import { generateSW } from 'workbox-build';

const build = async () => {
  try {
    await generateSW({
      swDest: 'public/service-worker.js',
      globDirectory: 'dist',
      globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,ttf,eot}'],
      dontCacheBustURLsMatching: /\.\w{8}\./,
      maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB
      navigateFallback: '/index.html',
      navigateFallbackDenylist: [/^\/api\//, /^\/_next\//],
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
      clientsClaim: true,
      skipWaiting: true,
    });

    console.log('✅ Service Worker généré avec succès !');
  } catch (error) {
    console.error('❌ Erreur génération SW:', error);
    process.exit(1);
  }
};

build();