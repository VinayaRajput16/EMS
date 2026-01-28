import React from 'react';

/**
 * Badge Component - Status indicators and labels
 * 
 * @param {string} variant - 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'primary'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} dot - Show dot indicator
 * @param {ReactNode} icon - Optional icon
 */
const Badge = ({ 
  children, 
  variant = 'neutral',
  size = 'md',
  dot = false,
  icon = null,
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full transition-all duration-200';
  
  const variants = {
    success: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-100 text-amber-700 border border-amber-200',
    error: 'bg-red-100 text-red-700 border border-red-200',
    info: 'bg-blue-100 text-blue-700 border border-blue-200',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
    primary: 'bg-indigo-100 text-indigo-700 border border-indigo-200'
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2'
  };
  
  const dotColors = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    neutral: 'bg-slate-500',
    primary: 'bg-indigo-500'
  };
  
  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : size === 'md' ? 'w-2 h-2' : 'w-2.5 h-2.5';
  
  return (
    <span
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {dot && (
        <span className={`${dotSize} ${dotColors[variant]} rounded-full animate-pulse`}></span>
      )}
      {icon && <span>{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
