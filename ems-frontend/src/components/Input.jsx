import React from 'react';

/**
 * Input Component - Styled input field with label and error states
 * 
 * @param {string} label - Input label
 * @param {string} error - Error message to display
 * @param {string} helperText - Helper text below input
 * @param {ReactNode} leftIcon - Icon on the left side
 * @param {ReactNode} rightIcon - Icon on the right side
 * @param {boolean} required - Mark field as required
 * @param {string} variant - 'default' | 'filled' | 'flushed'
 */
const Input = ({ 
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  required = false,
  variant = 'default',
  className = '',
  ...props 
}) => {
  const baseInputStyles = 'w-full px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed';
  
  const variants = {
    default: 'border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20',
    filled: 'bg-slate-100 border border-transparent rounded-lg focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20',
    flushed: 'border-b-2 border-slate-300 rounded-none px-0 focus:border-indigo-500'
  };
  
  const errorStyles = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : '';
  const leftPadding = leftIcon ? 'pl-10' : '';
  const rightPadding = rightIcon ? 'pr-10' : '';
  
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {leftIcon}
          </div>
        )}
        
        <input
          className={`${baseInputStyles} ${variants[variant]} ${errorStyles} ${leftPadding} ${rightPadding}`}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-slate-500">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
