import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import ModalMotion from './ModalMotion';

describe('ModalMotion Component', () => {
  let container, root;

  beforeEach(() => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    vi.clearAllMocks();
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    document.body.style.overflow = '';
  });

  it('renders nothing when isOpen is false', async () => {
    await act(async () => {
      root.render(
        <ModalMotion isOpen={false} onClose={() => {}}>
          <div>Modal Content</div>
        </ModalMotion>
      );
    });

    expect(document.querySelector('[role="dialog"]')).toBeNull();
    expect(document.body.textContent).not.toContain('Modal Content');
  });

  it('renders accessible dialog with aria attributes and custom classes when open', async () => {
    await act(async () => {
      root.render(
        <ModalMotion
          isOpen={true}
          onClose={() => {}}
          ariaLabelledBy="test-title"
          backdropClassName="custom-backdrop-test"
          dialogClassName="custom-dialog-test"
        >
          <h2 id="test-title">Test Title</h2>
          <p>Dialog Body</p>
        </ModalMotion>
      );
    });

    const dialog = document.querySelector('[role="dialog"]');
    expect(dialog).not.toBeNull();
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.getAttribute('aria-labelledby')).toBe('test-title');
    expect(dialog.className).toContain('custom-dialog-test');
    expect(document.querySelector('.custom-backdrop-test')).not.toBeNull();
    expect(document.body.textContent).toContain('Test Title');
  });

  it('calls onClose when clicking backdrop', async () => {
    const handleClose = vi.fn();

    await act(async () => {
      root.render(
        <ModalMotion
          isOpen={true}
          onClose={handleClose}
          backdropClassName="custom-backdrop-click"
          dialogClassName="custom-dialog-click"
        >
          <button type="button">Inside Button</button>
        </ModalMotion>
      );
    });

    const backdrop = document.querySelector('.custom-backdrop-click');
    expect(backdrop).not.toBeNull();

    await act(async () => {
      backdrop.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does NOT call onClose when clicking inside the dialog', async () => {
    const handleClose = vi.fn();

    await act(async () => {
      root.render(
        <ModalMotion
          isOpen={true}
          onClose={handleClose}
          backdropClassName="custom-backdrop-click"
          dialogClassName="custom-dialog-click"
        >
          <button id="inside-btn" type="button">Inside Button</button>
        </ModalMotion>
      );
    });

    const insideBtn = document.querySelector('#inside-btn');
    expect(insideBtn).not.toBeNull();

    await act(async () => {
      insideBtn.click();
    });

    expect(handleClose).not.toHaveBeenCalled();
  });

  it('calls onClose when Escape key is pressed', async () => {
    const handleClose = vi.fn();

    await act(async () => {
      root.render(
        <ModalMotion isOpen={true} onClose={handleClose} closeOnEscape={true}>
          <p>Escape test</p>
        </ModalMotion>
      );
    });

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('supports forwarded dialogRef', async () => {
    const dialogRef = React.createRef();

    await act(async () => {
      root.render(
        <ModalMotion isOpen={true} onClose={() => {}} dialogRef={dialogRef}>
          <p>Ref test</p>
        </ModalMotion>
      );
    });

    expect(dialogRef.current).not.toBeNull();
    expect(dialogRef.current.getAttribute('role')).toBe('dialog');
  });
});
