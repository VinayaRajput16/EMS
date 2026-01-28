import React from 'react';

/**
 * Card Component - Versatile container for content
 * 
 * @param {string} variant - 'default' | 'elevated' | 'bordered' | 'glass'
 * @param {boolean} hoverable - Add hover effect
 * @param {boolean} clickable - Add cursor pointer
 * @param {ReactNode} header - Optional header content
 * @param {ReactNode} footer - Optional footer content
 */
const Card = ({ 
  children, 
  variant = 'default',
  hoverable = false,
  clickable = false,
  header = null,
  footer = null,
  className = '',
  ...props 
}) => {
  const baseStyles = 'rounded-xl transition-all duration-300 ease-out';
  
  const variants = {
    default: 'bg-white border border-slate-200',
    elevated: 'bg-white shadow-sm hover:shadow-lg',
    bordered: 'bg-white border-2 border-slate-300',
    glass: 'bg-white/80 backdrop-blur-sm border border-white/20 shadow-sm'
  };
  
  const hoverStyles = hoverable ? 'hover:shadow-xl hover:-translate-y-1' : '';
  const clickableStyles = clickable ? 'cursor-pointer' : '';
  
  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${clickableStyles} ${className}`}
      {...props}
    >
      {header && (
        <div className="px-6 py-4 border-b border-slate-100">
          {header}
        </div>
      )}
      
      <div className="px-6 py-5">
        {children}
      </div>
      
      {footer && (
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-xl">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;