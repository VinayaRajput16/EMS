import React from 'react';

/**
 * Button Component - Reusable button with multiple variants
 * 
 * @param {string} variant - 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} fullWidth - Make button full width
 * @param {boolean} loading - Show loading state
 * @param {boolean} disabled - Disable button
 * @param {ReactNode} icon - Optional icon component
 * @param {string} iconPosition - 'left' | 'right'
 */
const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  loading = false,
  disabled = false,
  icon = null,
  iconPosition = 'left',
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 ease-out relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 shadow-sm hover:shadow-md active:scale-[0.98]',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 active:scale-[0.98]',
    outline: 'border-2 border-slate-300 text-slate-700 hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50/50 active:scale-[0.98]',
    ghost: 'text-slate-700 hover:bg-slate-100 active:scale-[0.98]',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md active:scale-[0.98]'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-md gap-1.5',
    md: 'px-4 py-2.5 text-sm rounded-lg gap-2',
    lg: 'px-6 py-3.5 text-base rounded-lg gap-2.5'
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {/* Shimmer effect on hover for primary variant */}
      {variant === 'primary' && (
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></span>
      )}
      
      {loading ? (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="relative z-10">{icon}</span>}
          <span className="relative z-10">{children}</span>
          {icon && iconPosition === 'right' && <span className="relative z-10">{icon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;