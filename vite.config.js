import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Local: `/` — GitHub Pages deploy sets VITE_BASE=/bharat-hie-portal/
  base: process.env.VITE_BASE || '/',
  server: {
    host: '127.0.0.1',
    port: 5180,
    strictPort: true,
    // Allow Cloudflare quick tunnels and other reverse-proxy hosts
    allowedHosts: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
});
