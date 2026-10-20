import { vi } from 'vitest';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import ReportPostModal from './ReportPostModal';

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
  vi.clearAllMocks();
});

test('ReportPostModal does not render when isOpen is false', async () => {
  await act(async () => {
    root.render(
      <ReportPostModal
        isOpen={false}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );
  });
  expect(container.innerHTML).toBe('');
});

test('ReportPostModal contains NO icons (SVG or emoji) and is 100% English', async () => {
  await act(async () => {
    root.render(
      <ReportPostModal
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        postTitle="Crispy Fried Tofu"
      />
    );
  });

  // Strict check: No <svg> elements anywhere in the modal
  expect(container.querySelectorAll('svg')).toHaveLength(0);

  // Content is English
  expect(container.textContent).toContain('Report Post');
  expect(container.textContent).toContain('Post: Crispy Fried Tofu');
  expect(container.textContent).toContain('Non-vegan content');
  expect(container.textContent).toContain('Spam or advertising');
  expect(container.textContent).toContain('Harassment or hate speech');
  expect(container.textContent).toContain('Violence or graphic content');
  expect(container.textContent).toContain('Other violation');
  expect(container.textContent).toContain('Submit Report');
  expect(container.textContent).toContain('Cancel');
  expect(container.textContent).toContain('Close');
});

test('Additional Details is hidden by default and for standard categories, and submitting succeeds without typing details', async () => {
  const onSubmit = vi.fn();
  const onClose = vi.fn();

  await act(async () => {
    root.render(
      <ReportPostModal
        isOpen={true}
        onClose={onClose}
        onSubmit={onSubmit}
        postTitle="Vegan Lasagna"
      />
    );
  });

  // Initially on non_vegan: Additional Details is hidden
  expect(container.querySelector('#report-details')).toBeNull();
  expect(container.textContent).not.toContain('Additional Details');

  // Submit button is NOT disabled
  const submitBtn = [...container.querySelectorAll('button')].find(b => b.textContent.trim() === 'Submit Report');
  expect(submitBtn.disabled).toBe(false);

  // Select Spam category: still hidden
  const spamRadio = container.querySelector('input[value="spam"]');
  await act(async () => {
    spamRadio.click();
  });
  expect(container.querySelector('#report-details')).toBeNull();

  // Submit directly without any typing
  const form = container.querySelector('form');
  await act(async () => {
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  });

  expect(onSubmit).toHaveBeenCalledWith({
    reasonCategory: 'spam',
    reason: expect.stringContaining('Spam or advertising'),
  });
});

test('Additional Details only appears when Other violation is selected, and allows custom details or optional empty submit', async () => {
  const onSubmit = vi.fn();

  await act(async () => {
    root.render(
      <ReportPostModal
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={onSubmit}
        postTitle="Vegan Lasagna"
      />
    );
  });

  // Select Other violation
  const otherRadio = container.querySelector('input[value="other"]');
  await act(async () => {
    otherRadio.click();
  });

  // Additional Details is now visible
  const textarea = container.querySelector('#report-details');
  expect(textarea).not.toBeNull();
  expect(container.textContent).toContain('Additional Details (Optional):');

  // Type custom details
  const nativeTextareaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
  await act(async () => {
    nativeTextareaValueSetter.call(textarea, 'Unsolicited phishing link.');
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.dispatchEvent(new Event('change', { bubbles: true }));
  });

  // Submit
  const form = container.querySelector('form');
  await act(async () => {
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  });

  expect(onSubmit).toHaveBeenCalledWith({
    reasonCategory: 'other',
    reason: 'Unsolicited phishing link.',
  });

  // Now test submitting Other with blank details (optional)
  onSubmit.mockClear();
  await act(async () => {
    nativeTextareaValueSetter.call(textarea, '   ');
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.dispatchEvent(new Event('change', { bubbles: true }));
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  });

  expect(onSubmit).toHaveBeenCalledWith({
    reasonCategory: 'other',
    reason: expect.stringContaining('Other violation'),
  });
});

test('Switching away from Other violation hides Additional Details', async () => {
  await act(async () => {
    root.render(
      <ReportPostModal
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );
  });

  // Select other
  await act(async () => {
    container.querySelector('input[value="other"]').click();
  });
  expect(container.querySelector('#report-details')).not.toBeNull();

  // Switch to harassment
  await act(async () => {
    container.querySelector('input[value="harassment"]').click();
  });
  expect(container.querySelector('#report-details')).toBeNull();
});

test('ReportPostModal closes on Cancel button and Escape key', async () => {
  const onClose = vi.fn();

  await act(async () => {
    root.render(
      <ReportPostModal
        isOpen={true}
        onClose={onClose}
        onSubmit={vi.fn()}
      />
    );
  });

  // Click Cancel
  const cancelBtn = [...container.querySelectorAll('button')].find(b => b.textContent.trim() === 'Cancel');
  await act(async () => {
    cancelBtn.click();
  });
  expect(onClose).toHaveBeenCalledTimes(1);

  // Press Escape
  await act(async () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
  });
  expect(onClose).toHaveBeenCalledTimes(2);
});
