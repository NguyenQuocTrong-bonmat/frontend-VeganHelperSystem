import React, { useEffect, useRef, useState } from 'react';
import { formatDate, formatDateInput, isValidDateDMY, parseDateDMY, toISODateOnly } from '../../utils/dateUtils';

/**
 * Reusable controlled DateInput component.
 *
 * Visually displays strictly DD/MM/YYYY across all operating systems and browsers.
 * Accepts manual entry with automatic slash formatting and leading zero support.
 * Integrates with a calendar picker overlay to ensure accessible date selection.
 * Always dispatches ISO YYYY-MM-DD format to parent onChange handlers for API consistency.
 */
export default function DateInput({
  id,
  name,
  value,
  defaultValue = '',
  onChange,
  onBlur,
  min,
  max,
  required = false,
  disabled = false,
  className = '',
  inputClassName = '',
  placeholder = 'DD/MM/YYYY',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  autoComplete = 'off',
}) {
  const inputRef = useRef(null);
  const pickerRef = useRef(null);

  const initialVal = value !== undefined ? value : defaultValue;

  const toDisplay = (val) => {
    if (!val) return '';
    if (typeof val === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(val)) return val;
    const formatted = formatDate(val);
    return formatted === '-' ? '' : formatted;
  };

  const [displayText, setDisplayText] = useState(() => toDisplay(initialVal));
  const [internalIso, setInternalIso] = useState(() => (initialVal ? toISODateOnly(initialVal) || '' : ''));

  // Synchronize when value prop updates externally
  useEffect(() => {
    if (value !== undefined) {
      const nextIso = value ? toISODateOnly(value) || '' : '';
      setInternalIso(nextIso);
      setDisplayText(toDisplay(nextIso));
    }
  }, [value]);

  const notifyChange = (isoValue, displayVal) => {
    setInternalIso(isoValue);
    setDisplayText(displayVal);
    if (onChange) {
      onChange({
        target: {
          id: id || '',
          name: name || '',
          value: isoValue,
        },
      });
    }
  };

  const handleInputChange = (event) => {
    const raw = event.target.value;

    // Direct ISO string (e.g. from test script or paste)
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw.trim())) {
      const iso = raw.trim();
      const dmy = formatDate(iso);
      inputRef.current?.setCustomValidity('');
      notifyChange(iso, dmy);
      return;
    }

    const formatted = formatDateInput(raw);

    if (!formatted) {
      inputRef.current?.setCustomValidity(required ? 'Please fill out this field.' : '');
      notifyChange('', '');
      return;
    }

    if (formatted.length === 10) {
      if (!isValidDateDMY(formatted)) {
        inputRef.current?.setCustomValidity('Enter a valid date in DD/MM/YYYY format.');
        notifyChange('', formatted);
        return;
      }

      const iso = parseDateDMY(formatted);
      if (!iso) {
        inputRef.current?.setCustomValidity('Enter a valid date in DD/MM/YYYY format.');
        notifyChange('', formatted);
        return;
      }

      if (min && iso < min) {
        inputRef.current?.setCustomValidity(`Date must be on or after ${formatDate(min)}.`);
        notifyChange('', formatted);
        return;
      }

      if (max && iso > max) {
        inputRef.current?.setCustomValidity(`Date must be on or before ${formatDate(max)}.`);
        notifyChange('', formatted);
        return;
      }

      inputRef.current?.setCustomValidity('');
      notifyChange(iso, formatted);
    } else {
      inputRef.current?.setCustomValidity(required ? 'Enter a complete date in DD/MM/YYYY format.' : '');
      notifyChange('', formatted);
    }
  };

  const handlePickerChange = (event) => {
    const pickedIso = event.target.value;
    if (!pickedIso) return;
    const formatted = formatDate(pickedIso);
    inputRef.current?.setCustomValidity('');
    notifyChange(pickedIso, formatted);
  };

  const openCalendar = () => {
    if (disabled) return;
    try {
      if (pickerRef.current && typeof pickerRef.current.showPicker === 'function') {
        pickerRef.current.showPicker();
      } else {
        pickerRef.current?.focus();
        pickerRef.current?.click();
      }
    } catch {
      pickerRef.current?.focus();
    }
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <input
        ref={inputRef}
        id={id}
        name={name}
        type="text"
        inputMode="numeric"
        autoComplete={autoComplete}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid}
        value={displayText}
        onChange={handleInputChange}
        onInput={handleInputChange}
        onBlur={onBlur}
        className={`w-full pr-10 ${inputClassName}`}
      />
      <button
        type="button"
        tabIndex={-1}
        disabled={disabled}
        onClick={openCalendar}
        aria-label="Open calendar picker"
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#2F5233] focus:outline-none transition-colors cursor-pointer"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </button>
      <input
        ref={pickerRef}
        type="date"
        tabIndex={-1}
        aria-hidden="true"
        disabled={disabled}
        min={min}
        max={max}
        value={internalIso}
        onChange={handlePickerChange}
        className="sr-only pointer-events-none"
      />
    </div>
  );
}
