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
    expect(container.querySelector('#post-title-input-error').textContent).toBe('Title is required.');
    expect(container.querySelector('#post-content-textarea-error').textContent).toBe('Content is required.');
    expect(container.querySelector('#post-category-select-error').textContent).toBe('Category is required.');
    expect(container.querySelector('#post-media-input-error').textContent).toContain('Media is required.');
    expect(document.activeElement).toBe(container.querySelector('#post-title-input'));
    expect(container.querySelectorAll('[aria-invalid="true"]').length).toBe(4);
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

  it.each(['Spicy Lemongrass Tofu', 'a'.repeat(255)])('submits valid required fields including title %s with optional fields empty', async (validTitle) => {
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
      const category = container.querySelector('#post-category-select');
      category.value = '1'; category.dispatchEvent(new Event('change', { bubbles: true }));
      titleSetter.call(titleInput, validTitle);
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
    expect(postService.createPost.mock.calls[0][0]).toMatchObject({title:validTitle,categoryId:1,ingredients:[],steps:[]});
    expect(handleSuccess).toHaveBeenCalledWith(
      expect.objectContaining({ id: 202, title: 'Spicy Lemongrass Tofu' })
    );
  });

  it.each([['   ', 'Title is required.'], ['a'.repeat(256), 'Title cannot exceed 255 characters.']])('rejects invalid title %s without calling createPost', async (value, message) => {
    await act(async () => root.render(<BrowserRouter><CreatePostForm /></BrowserRouter>));
    const input = container.querySelector('#post-title-input');
    expect(input.maxLength).toBe(255);
    await act(async () => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, value);
      input.dispatchEvent(new Event('input', {bubbles:true}));
    });
    await act(async () => container.querySelector('form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
    expect(container.querySelector('#post-title-input-error').textContent).toBe(message);
    expect(postService.createPost).not.toHaveBeenCalled();
  });

  it('shows a per-ingredient character limit and updates each counter independently', async () => {
    await act(async()=>root.render(<BrowserRouter><CreatePostForm /></BrowserRouter>));
    const ingredient=container.querySelector('[aria-label="Ingredient 1"]');
    expect(ingredient.maxLength).toBe(100);
    expect(container.querySelector('#create-ingredient-count-0').textContent).toBe('0/100 characters');
    await act(async()=>{
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(ingredient,'a'.repeat(100));
      ingredient.dispatchEvent(new Event('input',{bubbles:true}));
    });
    expect(container.querySelector('#create-ingredient-count-0').textContent).toBe('100/100 characters');
    await act(async()=>[...container.querySelectorAll('button')].find(b=>b.textContent.includes('Add Ingredient')).click());
    expect(container.querySelector('#create-ingredient-count-1').textContent).toBe('0/100 characters');
    expect(container.querySelector('#post-content-textarea').hasAttribute('maxlength')).toBe(false);
    expect(container.querySelector('textarea[placeholder="Describe step 1..."]').hasAttribute('maxlength')).toBe(false);
  });
  it('rejects an oversized ingredient if a value bypasses the input maxlength', async () => {
    await act(async()=>root.render(<BrowserRouter><CreatePostForm /></BrowserRouter>));
    await act(async()=>{
      const input=container.querySelector('[aria-label="Ingredient 1"]');
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,'a'.repeat(101));
      input.dispatchEvent(new Event('input',{bubbles:true}));
    });
    await act(async()=>container.querySelector('form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
    expect(container.textContent).toContain('Each ingredient must be 100 characters or fewer.');
    expect(postService.createPost).not.toHaveBeenCalled();
  });
});
