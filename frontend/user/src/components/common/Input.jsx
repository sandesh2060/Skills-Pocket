// ============================================
// FILE: frontend/user/src/components/common/Input.jsx
// ============================================
import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  helperText,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  ...props
}, ref) => {
  const hasError = !!error;
  const widthClass = fullWidth ? 'w-full' : '';

  const baseInputStyles = `
    px-4 py-2.5 rounded-lg border transition-all
    focus:outline-none focus:ring-4
    disabled:opacity-50 disabled:cursor-not-allowed
    ${hasError 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
      : 'border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary/10'
    }
    bg-white dark:bg-slate-800
    text-slate-900 dark:text-white
    placeholder:text-slate-400
  `;

  const inputElement = (
    <div className={`relative ${widthClass}`}>
      {icon && iconPosition === 'left' && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>
      )}
      
      <input
        ref={ref}
        className={`
          ${baseInputStyles}
          ${icon && iconPosition === 'left' ? 'pl-10' : ''}
          ${icon && iconPosition === 'right' ? 'pr-10' : ''}
          ${widthClass}
          ${className}
        `}
        {...props}
      />

      {icon && iconPosition === 'right' && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>
      )}
    </div>
  );

  if (!label && !error && !helperText) {
    return inputElement;
  }

  return (
    <div className={widthClass}>
      {label && (
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          {label}
        </label>
      )}
      
      {inputElement}
      
      {(error || helperText) && (
        <p className={`mt-1.5 text-xs ${hasError ? 'text-red-600' : 'text-slate-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;