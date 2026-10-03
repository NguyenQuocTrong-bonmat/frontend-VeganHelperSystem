import React from 'react';

const Input = React.forwardRef(({
  label,
  error,
  description,
  id,
  className = '',
  ...props
}, ref) => {
  const inputId = id || props.name;
  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-vh-text-primary font-dm-sans">
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        className={`rounded-control border bg-vh-surface px-3 py-2 text-base font-dm-sans text-vh-text-primary placeholder-vh-text-secondary focus-ring-vh transition-all duration-fast ease-vh
          ${error ? 'border-vh-error' : 'border-vh-border hover:border-vh-sage'}`}
        {...props}
      />
      {description && !error && (
        <span className="text-sm text-vh-text-secondary font-dm-sans">{description}</span>
      )}
      {error && (
        <span className="text-sm text-vh-error font-dm-sans">{error}</span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
