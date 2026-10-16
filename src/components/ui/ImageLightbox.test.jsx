import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import ImageLightbox from './ImageLightbox';

describe('ImageLightbox', () => {
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
    document.body.style.overflow = '';
  });

  it('does not render when isOpen is false', async () => {
    await act(async () => {
      root.render(<ImageLightbox isOpen={false} src="/test.jpg" alt="Test image" onClose={() => {}} />);
    });
    expect(document.querySelector('[role="dialog"]')).toBeNull();
  });

  it('renders image, locks body scroll, and sets aria attributes when open', async () => {
    await act(async () => {
      root.render(<ImageLightbox isOpen={true} src="/recipe.jpg" alt="Delicious Pho" onClose={() => {}} />);
    });

    const dialog = document.querySelector('[role="dialog"]');
    expect(dialog).not.toBeNull();
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(document.body.style.overflow).toBe('hidden');

    const img = dialog.querySelector('img');
    expect(img).not.toBeNull();
    expect(img.getAttribute('src')).toBe('/recipe.jpg');
    expect(img.getAttribute('alt')).toBe('Delicious Pho');
  });

  it('calls onClose when close button is clicked', async () => {
    const handleClose = vi.fn();
    await act(async () => {
      root.render(<ImageLightbox isOpen={true} src="/recipe.jpg" alt="Recipe" onClose={handleClose} />);
    });

    const closeBtn = document.querySelector('button[aria-label="Close enlarged image view"]');
    await act(async () => {
      closeBtn.click();
    });

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking the backdrop overlay outside image', async () => {
    const handleClose = vi.fn();
    await act(async () => {
      root.render(<ImageLightbox isOpen={true} src="/recipe.jpg" alt="Recipe" onClose={handleClose} />);
    });

    const dialog = document.querySelector('[role="dialog"]');
    await act(async () => {
      dialog.click();
    });

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when clicking inside the image', async () => {
    const handleClose = vi.fn();
    await act(async () => {
      root.render(<ImageLightbox isOpen={true} src="/recipe.jpg" alt="Recipe" onClose={handleClose} />);
    });

    const img = document.querySelector('img');
    await act(async () => {
      img.click();
    });

    expect(handleClose).not.toHaveBeenCalled();
  });

  it('calls onClose when Escape key is pressed', async () => {
    const handleClose = vi.fn();
    await act(async () => {
      root.render(<ImageLightbox isOpen={true} src="/recipe.jpg" alt="Recipe" onClose={handleClose} />);
    });

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('restores body overflow on unmount', async () => {
    await act(async () => {
      root.render(<ImageLightbox isOpen={true} src="/recipe.jpg" alt="Recipe" onClose={() => {}} />);
    });
    expect(document.body.style.overflow).toBe('hidden');

    await act(async () => {
      root.render(null);
    });
    expect(document.body.style.overflow).toBe('');
  });
});
