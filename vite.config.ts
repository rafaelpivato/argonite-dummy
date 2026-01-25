import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        background: 'src/background.ts',
        popup: 'src/popup.ts',
        content: 'src/content.ts',
      },
      output: {
        entryFileNames: '[name].js',
        format: 'es',
        inlineDynamicImports: true,
      },
    },
  },
});
