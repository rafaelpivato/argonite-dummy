import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        background: 'src/background.ts',
        popup: 'src/popup.ts',
      },
      output: {
        entryFileNames: '[name].js',
        format: 'es',
      },
    },
  },
});
