import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import CreatePostForm from './CreatePostForm';
import * as postService from '../../services/postService';

vi.mock('../../services/postService', () => ({
  createPost: vi.fn(),
  getCategories: vi.fn(),
}));

describe('CreatePostForm', () => {
  let container, root;

  beforeEach(() => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    vi.clearAllMocks();

    postService.getCategories.mockResolvedValue([
      { id: 1, name: 'Soups & Stews' },
      { id: 2, name: 'Main Dishes' },
    ]);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
  });

  it('renders unified post fields by default and loads categories', async () => {
    await act(async () => {
      root.render(
        <BrowserRouter>
          <CreatePostForm />
        </BrowserRouter>
      );
    });

    expect(container.textContent).toContain('Post Information');
    expect(container.textContent).toContain('Cooking Details (Optional)');
    expect(container.textContent).toContain('Ingredients (Optional)');
    expect(container.textContent).toContain('Step-by-Step Instructions (Optional)');

    const titleInput = container.querySelector('#post-title-input');
    expect(titleInput).not.toBeNull();

    const categorySelect = container.querySelector('#post-category-select');
    expect(categorySelect).not.toBeNull();
    expect(categorySelect.textContent).toContain('Soups & Stews');

    const submitBtn = container.querySelector('button[type="submit"]');
    expect(submitBtn.textContent).toContain('Publish Post');
  });

  it('allows adding and removing ingredients', async () => {
    await act(async () => {
      root.render(
        <BrowserRouter>
          <CreatePostForm initialPostType="recipe" />
        </BrowserRouter>
      );
    });

    const addIngBtn = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent && b.textContent.includes('Add Ingredient')
    );
    expect(addIngBtn).toBeDefined();

    await act(async () => {
      addIngBtn.click();
    });

    // Should now have 2 ingredient inputs and remove buttons
    const removeButtons = container.querySelectorAll('button[aria-label^="Remove ingredient"]');
    expect(removeButtons.length).toBe(2);

    await act(async () => {
      removeButtons[0].click();
    });

    // Should remove 1 ingredient
    const remainingRemoveButtons = container.querySelectorAll('button[aria-label^="Remove ingredient"]');
    expect(remainingRemoveButtons.length).toBe(0);
  });

  it('validates required fields before submitting', async () => {
    await act(async () => {
      root.render(
        <BrowserRouter>
          <CreatePostForm />
        </BrowserRouter>
      );
    });

    const form = container.querySelector('form');
    expect(form).not.toBeNull();

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    expect(postService.createPost).not.toHaveBeenCalled();
    expect(container.textContent).toContain('Please enter a title for your post.');
  });

  it('tracks dirty state when user enters title or content', async () => {
    const handleDirtyChange = vi.fn();

    await act(async () => {
      root.render(
        <BrowserRouter>
          <CreatePostForm onDirtyChange={handleDirtyChange} />
        </BrowserRouter>
      );
    });

    const titleInput = container.querySelector('#post-title-input');
    await act(async () => {
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      ).set;
      nativeSetter.call(titleInput, 'Delicious Pho');
      titleInput.dispatchEvent(new Event('input', { bubbles: true }));
      titleInput.dispatchEvent(new Event('change', { bubbles: true }));
    });

    expect(handleDirtyChange).toHaveBeenCalledWith(true);
  });

  it('submits valid post and triggers onSuccess callback', async () => {
    const handleSuccess = vi.fn();
    postService.createPost.mockResolvedValueOnce({
      id: 202,
      title: 'Spicy Lemongrass Tofu',
      status: 'published',
    });

    await act(async () => {
      root.render(
        <BrowserRouter>
          <CreatePostForm onSuccess={handleSuccess} />
        </BrowserRouter>
      );
    });

    const titleInput = container.querySelector('#post-title-input');
    const contentTextarea = container.querySelector('#post-content-textarea');
    const fileInput = container.querySelector('input[type="file"]');

    await act(async () => {
      const titleSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      ).set;
      titleSetter.call(titleInput, 'Spicy Lemongrass Tofu');
      titleInput.dispatchEvent(new Event('input', { bubbles: true }));
      titleInput.dispatchEvent(new Event('change', { bubbles: true }));

      const contentSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        'value'
      ).set;
      contentSetter.call(contentTextarea, 'Crispy fried tofu in aromatic lemongrass chili sauce.');
      contentTextarea.dispatchEvent(new Event('input', { bubbles: true }));
      contentTextarea.dispatchEvent(new Event('change', { bubbles: true }));

      // Attach mock file
      const file = new File(['image-content'], 'tofu.jpg', { type: 'image/jpeg' });
      Object.defineProperty(fileInput, 'files', {
        value: [file],
      });
      fileInput.dispatchEvent(new Event('change', { bubbles: true }));
    });

    const submitBtn = container.querySelector('button[type="submit"]');
    await act(async () => {
      submitBtn.click();
    });

    expect(postService.createPost).toHaveBeenCalledTimes(1);
    expect(handleSuccess).toHaveBeenCalledWith(
      expect.objectContaining({ id: 202, title: 'Spicy Lemongrass Tofu' })
    );
  });
});
