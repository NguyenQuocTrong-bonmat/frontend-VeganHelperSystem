import { defineConfig } from '@playwright/test';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const baseURL = process.env.VH_E2E_FE_URL || 'http://127.0.0.1:3030';
const api = process.env.VH_E2E_API_URL || 'http://127.0.0.1:7188';
if ([baseURL, api].some(url => !['127.0.0.1', 'localhost'].includes(new URL(url).hostname)))
  throw new Error('The audit E2E suite must use loopback services.');

export default defineConfig({
  testDir: '.',
  outputDir: join(tmpdir(), 'veganhelper-browser-test-results'),
  testMatch: '**/*.e2e.mjs',
  workers: 1,
  timeout: 45000,
  use: { baseURL, channel: 'chrome' },
  webServer: {
    command: `npm run dev -- --host ${new URL(baseURL).hostname} --port ${new URL(baseURL).port} --strictPort`,
    url: baseURL,
    env: { VITE_API_BASE_URL: api + '/api' },
  },
});
