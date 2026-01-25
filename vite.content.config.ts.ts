import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      input: 'src/content.ts',
      output: {
        entryFileNames: 'content.js',
        format: 'es',
        inlineDynamicImports: true,
      },
    },
  },
});
