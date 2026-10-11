import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Asegura compatibilidad con GitHub Pages
  server: {
    port: 3000,
    open: true
  }
});
