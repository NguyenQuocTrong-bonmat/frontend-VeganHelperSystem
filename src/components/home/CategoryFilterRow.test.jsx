import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import CategoryFilterRow from './CategoryFilterRow';

describe('CategoryFilterRow', () => {
  let container, root;

  beforeEach(() => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
  });

  const sampleCategories = [
    { id: 1, name: 'Braised Dishes' },
    { id: 2, name: 'Soups' },
    { id: 3, name: 'Vegan Pastries' },
  ];

  it('renders all category pills and "All Recipes"', async () => {
    await act(async () => {
      root.render(
        <CategoryFilterRow
          categories={sampleCategories}
          selectedCategoryId={null}
          onSelectCategory={() => {}}
        />
      );
    });

    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(4);
    expect(buttons[0].textContent).toContain('All Recipes');
    expect(buttons[1].textContent).toContain('Braised Dishes');
    expect(buttons[2].textContent).toContain('Soups');
    expect(buttons[3].textContent).toContain('Vegan Pastries');
  });

  it('calls onSelectCategory when a category pill is clicked', async () => {
    const handleSelect = vi.fn();
    await act(async () => {
      root.render(
        <CategoryFilterRow
          categories={sampleCategories}
          selectedCategoryId={null}
          onSelectCategory={handleSelect}
        />
      );
    });

    const buttons = container.querySelectorAll('button');
    await act(async () => {
      buttons[1].click();
    });

    expect(handleSelect).toHaveBeenCalledWith(1);
  });

  it('calls onSelectCategory with null when "All Recipes" is clicked', async () => {
    const handleSelect = vi.fn();
    await act(async () => {
      root.render(
        <CategoryFilterRow
          categories={sampleCategories}
          selectedCategoryId={2}
          onSelectCategory={handleSelect}
        />
      );
    });

    const buttons = container.querySelectorAll('button');
    await act(async () => {
      buttons[0].click();
    });

    expect(handleSelect).toHaveBeenCalledWith(null);
  });

  it('does not render when categories array is empty', async () => {
    await act(async () => {
      root.render(
        <CategoryFilterRow
          categories={[]}
          selectedCategoryId={null}
          onSelectCategory={() => {}}
        />
      );
    });

    expect(container.innerHTML).toBe('');
  });
});
