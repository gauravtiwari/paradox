import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    ssr: true,
    outDir: 'dist-server',
    rollupOptions: {
      input: path.resolve(__dirname, 'src/entry-server.jsx'),
      output: {
        entryFileNames: 'entry-server.js',
        format: 'esm',
      },
    },
    minify: false,
    emptyOutDir: true,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
}); 
