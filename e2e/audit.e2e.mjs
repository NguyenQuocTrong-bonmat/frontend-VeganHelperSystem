import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';

const password = 'Vegetable!Test123';
const marker = randomUUID().replaceAll('-', '');
const email = `audit_${marker}@example.invalid`;
let postId;
let commentId;

test.describe.configure({ mode: 'serial' });

test('email proof is required before creating credentials', async ({ page }) => {
  await page.goto('/sign-up');
  await expect(page.locator('#password')).toHaveCount(0);
  await page.getByLabel('Email address').fill(email);
  const startRegistration = page.waitForResponse(response =>
    response.request().method() === 'POST' && new URL(response.url()).pathname === '/api/auth/register/start');
  await page.getByRole('button', { name: 'Send verification code' }).click();
  expect((await startRegistration).status()).toBe(200);
  let otp;
  await expect.poll(() => {
    const log = readFileSync(process.env.VH_E2E_BE_LOG, 'utf8');
    const index = log.lastIndexOf(`To: ${email};`);
    otp = index < 0 ? undefined : /Your verification code is: ([0-9]{6})/.exec(log.slice(index, index + 1000))?.[1];
    return Boolean(otp);
  }, { timeout: 15000, message: 'The isolated email sink should receive the registration code' }).toBe(true);
  await page.getByLabel('Verification code').fill(otp);
  await page.getByRole('button', { name: 'Verify email' }).click();
  await page.locator('#fullName').fill('Audit Test Chef');
  await page.locator('#username').fill(`chef_${marker}`);
  await page.locator('#password').fill(password);
  await page.locator('#confirmPassword').fill(password);
  await page.locator('#terms').check();
  await page.getByRole('button', { name: /^sign up$/i }).click();
  await expect(page).toHaveURL(/\/login$/);
});

async function signIn(page) {
  await page.goto('/login');
  await page.locator('#username').fill(email);
  await page.locator('#password').fill(password);
  await page.locator('#remember').check();
  await page.locator('form button[type=submit]').click();
  await expect.poll(() => page.evaluate(() => Boolean(localStorage.getItem('refreshToken')))).toBe(true);
  await expect(page).toHaveURL(/\/home$/);
}

test('two tabs refresh a single remembered session', async ({ page, context }) => {
  await signIn(page);
  const second = await context.newPage();
  // Keep the same browser origin while isolating the refresh from feed/background polling.
  await Promise.all([page.goto('/notification-sw.js'), second.goto('/notification-sw.js')]);
  const refreshes = [];
  context.on('response', response => {
    if (response.request().method() === 'POST' && response.url().endsWith('/api/auth/refresh')) {
      const token = response.request().postDataJSON().refreshToken;
      refreshes.push({ status: response.status(), token });
    }
  });
  expect(await page.evaluate(() => Boolean(navigator.locks))).toBe(true);
  await page.evaluate(() => localStorage.setItem('accessToken', 'expired-for-e2e'));
  const result = await Promise.all([page, second].map(tab => tab.evaluate(async () => {
    const { default: client } = await import('/src/lib/axios.js');
    try { return (await client.get('/users/me')).status; }
    catch (error) { return [error.config?.url, error.response?.status]; }
  })));
  expect(result).toEqual([200, 200]);
  expect(refreshes.map(({ status }, index) => ({
    status, reused: refreshes.slice(0, index).some(previous => previous.token === refreshes[index].token),
  }))).toEqual([{ status: 200, reused: false }]);
});

test('editing a hidden comment does not make it public', async ({ page, request }) => {
  const container = process.env.VH_E2E_DB_CONTAINER;
  if (!/^veganhelper-audit-e2e-[a-z0-9]+$/.test(container || ''))
    throw new Error('Set VH_E2E_DB_CONTAINER to the disposable audit PostgreSQL container.');
  const query = sql => execFileSync('docker', ['exec', container, 'psql', '-U', 'postgres', '-d', 'veganhelper_audit_e2e', '-Atq', '-v', 'ON_ERROR_STOP=1', '-c', sql], { encoding: 'utf8' }).trim();
  postId = query(`INSERT INTO posts (author_id,title,content,status) SELECT id,'E2E hidden comment','Plant-based recipe','published' FROM users WHERE email='${email}' RETURNING id;`);
  commentId = query(`INSERT INTO comments (post_id,user_id,content,status) SELECT ${postId},id,'Pending moderation','hidden' FROM users WHERE email='${email}' RETURNING id;`);
  expect(postId).toMatch(/^\d+$/);
  expect(commentId).toMatch(/^\d+$/);
  await signIn(page);
  const edited = await page.evaluate(async ({ postId, commentId }) => {
    const { default: client } = await import('/src/lib/axios.js');
    return (await client.put(`/posts/${postId}/comments/${commentId}`, { content: 'A normal edited comment.' })).data;
  }, { postId, commentId });
  expect(edited.status).toBe('hidden');
  const reader = await request.get(`${process.env.VH_E2E_API_URL || 'http://127.0.0.1:7188'}/api/posts/${postId}/comments`);
  expect(reader.ok()).toBeTruthy();
  expect(JSON.stringify(await reader.json())).not.toContain('A normal edited comment.');
});
