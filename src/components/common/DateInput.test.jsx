import React, { act, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import DateInput from './DateInput';

describe('DateInput component', () => {
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

  const simulateChange = (input, val) => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(input, val);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  };

  it('displays initial ISO date in DD/MM/YYYY format', async () => {
    await act(async () => {
      root.render(<DateInput id="dob" name="birthDate" value="2000-01-05" onChange={() => {}} />);
    });

    const input = container.querySelector('input[type="text"]');
    expect(input.value).toBe('05/01/2000');
    expect(input.placeholder).toBe('DD/MM/YYYY');
  });

  it('formats typed digits with automatic slashes and dispatches ISO date when complete', async () => {
    const handleChange = vi.fn();

    await act(async () => {
      root.render(<DateInput id="dob" name="birthDate" onChange={handleChange} />);
    });

    const input = container.querySelector('input[type="text"]');

    // Simulate typing 10112006
    await act(async () => {
      simulateChange(input, '10112006');
    });

    expect(input.value).toBe('10/11/2006');
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: {
          id: 'dob',
          name: 'birthDate',
          value: '2006-11-10',
        },
      })
    );
  });

  it('rejects invalid calendar dates like 31/02/2006 with custom validity', async () => {
    const handleChange = vi.fn();

    await act(async () => {
      root.render(<DateInput id="dob" name="birthDate" onChange={handleChange} />);
    });

    const input = container.querySelector('input[type="text"]');

    await act(async () => {
      simulateChange(input, '31022006');
    });

    expect(input.value).toBe('31/02/2006');
    expect(input.validationMessage).toContain('Enter a valid date');
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: '' }),
      })
    );
  });

  it('synchronizes when calendar picker changes value', async () => {
    const handleChange = vi.fn();

    function StatefulWrapper() {
      const [val, setVal] = useState('2000-01-05');
      return <DateInput id="dob" name="birthDate" value={val} onChange={(e) => { setVal(e.target.value); handleChange(e); }} />;
    }

    await act(async () => {
      root.render(<StatefulWrapper />);
    });

    const picker = container.querySelector('input[type="date"]');
    const textInput = container.querySelector('input[type="text"]');

    await act(async () => {
      simulateChange(picker, '2026-12-21');
    });

    expect(textInput.value).toBe('21/12/2026');
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: {
          id: 'dob',
          name: 'birthDate',
          value: '2026-12-21',
        },
      })
    );
  });

  it('supports direct ISO date value set from test harnesses or paste', async () => {
    const handleChange = vi.fn();

    await act(async () => {
      root.render(<DateInput id="dob" name="birthDate" onChange={handleChange} />);
    });

    const input = container.querySelector('input[type="text"]');

    await act(async () => {
      simulateChange(input, '2026-01-01');
    });

    expect(input.value).toBe('01/01/2026');
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: {
          id: 'dob',
          name: 'birthDate',
          value: '2026-01-01',
        },
      })
    );
  });

  it('respects min and max date bounds', async () => {
    const handleChange = vi.fn();

    await act(async () => {
      root.render(
        <DateInput
          id="dob"
          name="birthDate"
          min="2000-01-01"
          max="2026-12-31"
          onChange={handleChange}
        />
      );
    });

    const input = container.querySelector('input[type="text"]');

    // Test date before min
    await act(async () => {
      simulateChange(input, '15121990');
    });

    expect(input.validationMessage).toContain('Date must be on or after');

    // Test date after max
    await act(async () => {
      simulateChange(input, '15122030');
    });

    expect(input.validationMessage).toContain('Date must be on or before');
  });
});
