/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

/** Défini par .devcontainer/devcontainer.json. */
const inDevContainer = process.env.BOUSSOLE_DEVCONTAINER === 'true';

export default defineConfig({
  // Chemins relatifs : l'application fonctionne servie depuis n'importe quel dossier ou hébergement statique.
  base: './',
  plugins: [vue()],

  server: {
    // Écoute sur toutes les interfaces (0.0.0.0) et pas seulement sur le localhost du conteneur :
    // sans ça, la redirection de port de VS Code ou de Docker ne peut pas joindre le serveur.
    host: true,
    port: 5173,
    strictPort: true, // Échoue clairement si le port est pris, au lieu d'en choisir un autre en silence.
    watch: inDevContainer
      ? {
          // Sous Windows, les modifications faites dans un dossier monté dans Docker ne sont pas
          // signalées au conteneur : on vérifie les fichiers à intervalles réguliers.
          usePolling: true,
          interval: 300,
        }
      : undefined,
  },
  build: {
    // Le module PDF embarque ses polices (environ 1,6 Mo). Il n'est chargé qu'au premier export PDF.
    chunkSizeWarningLimit: 1800,
  },
  preview: {
    host: true,
    port: 4173,
    strictPort: true,
  },

  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
  },
});
