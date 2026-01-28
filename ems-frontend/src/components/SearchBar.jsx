import React from 'react';

/**
 * SearchBar Component - Search input with icon and actions
 * 
 * @param {string} placeholder - Placeholder text
 * @param {string} value - Search value
 * @param {function} onChange - Change handler
 * @param {function} onClear - Clear handler
 * @param {boolean} loading - Show loading state
 * @param {string} size - 'sm' | 'md' | 'lg'
 */
const SearchBar = ({ 
  placeholder = 'Search...',
  value,
  onChange,
  onClear,
  loading = false,
  size = 'md',
  className = '',
  ...props 
}) => {
  const sizes = {
    sm: 'px-10 py-2 text-sm',
    md: 'px-11 py-2.5 text-sm',
    lg: 'px-12 py-3.5 text-base'
  };
  
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };
  
  return (
    <div className={`relative ${className}`}>
      {/* Search Icon */}
      <div className={`absolute left-3 top-1/2 -translate-y-1/2 text-slate-400`}>
        <svg className={iconSizes[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      
      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full ${sizes[size]} bg-white border border-slate-300 rounded-lg 
          focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 
          placeholder-slate-400 text-slate-900 transition-all duration-200`}
        {...props}
      />
      
      {/* Loading or Clear Button */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {loading && (
          <svg className={`animate-spin ${iconSizes[size]} text-slate-400`} fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        
        {value && !loading && onClear && (
          <button
            onClick={onClear}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded"
          >
            <svg className={iconSizes[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;