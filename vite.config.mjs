import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 3000, strictPort: true },
  build: { outDir: 'build' },
  test: {
    environment: 'jsdom',
    globals: true,
    pool: 'threads',
    environmentOptions: { jsdom: { url: 'http://localhost:3000' } },
  },
});