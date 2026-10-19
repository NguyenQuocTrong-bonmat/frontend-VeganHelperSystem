import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { beforeEach, afterEach, test, expect, vi } from 'vitest';
import AdminCategoryManagement from './AdminCategoryManagement';
import * as service from '../../services/adminService';

vi.mock('../../components/admin/AdminLayout', () => ({ default: ({ children }) => <main>{children}</main> }));
vi.mock('../../services/adminService', () => ({ getAdminCategories: vi.fn(), createAdminCategory: vi.fn(), updateAdminCategory: vi.fn(), deleteAdminCategory: vi.fn() }));
let root, container;
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  vi.clearAllMocks();
  service.getAdminCategories.mockResolvedValue({ items: [{ id: 7, name: 'Soups', slug: 'original-soups', postCategoryKind: 'recipe', postCount: 0 }] });
  service.createAdminCategory.mockResolvedValue({ id: 8, name: 'Roasted Vegetable Soups', slug: 'roasted-vegetable-soups' });
  service.updateAdminCategory.mockResolvedValue({});
  container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container);
});
afterEach(async () => { await act(async () => root.unmount()); container.remove(); });
const render = () => act(async () => root.render(<AdminCategoryManagement />));
const click = (text) => act(async () => [...container.querySelectorAll('button')].find(button => button.textContent.trim() === text).click());
const changeName = (name) => act(async () => {
  const input = container.querySelector('#category-name');
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, name);
  input.dispatchEvent(new Event('input', { bubbles: true }));
});
const submit = () => act(async () => container.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));

test('creates a category from its name without a slug input and shows an English example', async () => {
  await render(); await click('Add Category');
  expect(container.querySelector('#category-name').placeholder).toBe('e.g., Soups, Stir-fried Dishes, Vegan Desserts');
  expect(container.textContent).not.toContain('URL Slug');
  await changeName('  Roasted Vegetable Soups  '); await submit();
  expect(service.createAdminCategory).toHaveBeenCalledWith({ name: 'Roasted Vegetable Soups', postCategoryKind: 'recipe' });
  expect(container.querySelector('form')).toBeNull();
});

test('renames a category without sending a replacement slug', async () => {
  await render(); await click('Edit'); await changeName('Seasonal Soups'); await submit();
  expect(service.updateAdminCategory).toHaveBeenCalledWith(7, { name: 'Seasonal Soups', postCategoryKind: 'recipe' });
});

test('keeps the form and name when the API rejects a duplicate', async () => {
  service.createAdminCategory.mockRejectedValueOnce(new Error('Category name already exists.'));
  await render(); await click('Add Category'); await changeName('Soups'); await submit();
  expect(container.querySelector('#category-name').value).toBe('Soups');
  expect(container.textContent).toContain('Category name already exists.');
});
