
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
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
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, './'),
        '@src': resolve(__dirname, './src'),
      },
    },
    define: {
      // Le remplacement statique est CRUCIAL ici pour Cloudflare Pages
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
