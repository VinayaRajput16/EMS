import React from 'react';

/**
 * LoadingSpinner Component - Loading indicators
 * 
 * @param {string} size - 'sm' | 'md' | 'lg' | 'xl'
 * @param {string} variant - 'spinner' | 'dots' | 'pulse'
 * @param {string} color - 'primary' | 'white' | 'gray'
 * @param {string} text - Optional loading text
 */
const LoadingSpinner = ({ 
  size = 'md',
  variant = 'spinner',
  color = 'primary',
  text,
  className = '',
  ...props 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };
  
  const colors = {
    primary: 'text-indigo-600',
    white: 'text-white',
    gray: 'text-slate-400'
  };
  
  const renderSpinner = () => {
    switch (variant) {
      case 'spinner':
        return (
          <svg 
            className={`animate-spin ${sizes[size]} ${colors[color]}`} 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            ></circle>
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        );
        
      case 'dots':
        return (
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`rounded-full bg-current ${
                  size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-5 h-5'
                } ${colors[color]}`}
                style={{
                  animation: 'bounce 1.4s ease-in-out infinite',
                  animationDelay: `${i * 0.16}s`
                }}
              ></div>
            ))}
          </div>
        );
        
      case 'pulse':
        return (
          <div className="relative">
            <div className={`${sizes[size]} ${colors[color]} rounded-full bg-current opacity-75 animate-ping absolute`}></div>
            <div className={`${sizes[size]} ${colors[color]} rounded-full bg-current`}></div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`} {...props}>
      {renderSpinner()}
      {text && (
        <p className={`text-sm font-medium ${colors[color]}`}>
          {text}
        </p>
      )}
      
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { 
            transform: scale(0);
            opacity: 0.5;
          } 
          40% { 
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
