// Vite configuration demonstrating bundling, code-splitting, and source maps

import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist-bundle',
    sourcemap: true,
    minify: 'terser',
    rollupOptions: {
      output: {
        // Enforce code-splitting into distinct chunks
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
});
