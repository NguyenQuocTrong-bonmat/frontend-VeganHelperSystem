import React from 'react';

const Button = React.forwardRef(({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  className = '', 
  disabled, 
  ...props 
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-dm-sans transition-all duration-normal ease-vh focus-ring-vh';
  const variants = {
    primary: 'bg-vh-forest text-white hover:bg-opacity-90 rounded-control px-4 py-2 text-base font-medium',
    secondary: 'bg-transparent text-vh-forest border border-vh-forest hover:bg-vh-forest hover:bg-opacity-10 rounded-control px-4 py-2 text-base font-medium',
    destructive: 'bg-vh-error text-white hover:bg-opacity-90 rounded-control px-4 py-2 text-base font-medium',
  };

  const variantStyles = variants[variant] || variants.primary;
  const stateStyles = disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:-translate-y-[1px] shadow-sm hover:shadow';

  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantStyles} ${stateStyles} ${className}`}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
