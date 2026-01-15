import { useState, useRef, useEffect } from 'react';

const Select = ({ 
  label, 
  value, 
  onChange, 
  options = [], 
  placeholder = "Select an option",
  className = "",
  disabled = false,
  error = null,
  required = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(option => option.value === value) || null;
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  return (
    <div className={`space-y-2 ${className}`} ref={selectRef}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        {/* Select Trigger */}
        <button
          type="button"
          className={`
            w-full px-4 py-4 pr-10 border-2 rounded-2xl text-left font-medium
            transition-all duration-200 shadow-lg hover:shadow-xl focus:ring-4 focus:ring-indigo-500/20
            ${disabled 
              ? 'bg-gray-100 border-gray-200 cursor-not-allowed text-gray-400' 
              : isOpen 
                ? 'border-indigo-500 bg-indigo-50 shadow-2xl ring-4 ring-indigo-500/20' 
                : error 
                  ? 'border-red-400 bg-red-50 shadow-red-200' 
                  : 'border-gray-200 hover:border-gray-300 bg-white'
            }
          `}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
        >
          <span className="block truncate">{displayValue}</span>
          {/* INLINE Chevron SVG - NO IMPORT CONFLICTS */}
          <svg 
            className={`absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-indigo-600' : 'text-gray-400'
            }`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown */}
        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-200 rounded-3xl shadow-2xl ring-1 ring-black/5 max-h-60 overflow-auto">
            <div className="py-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`
                    w-full px-4 py-3 text-left text-sm font-medium flex items-center justify-between
                    hover:bg-indigo-50 hover:text-indigo-900 transition-all duration-150
                    ${value === option.value 
                      ? 'bg-indigo-600 text-white shadow-indigo-500/50' 
                      : 'text-gray-700'
                    }
                  `}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  <span>{option.label}</span>
                  {/* INLINE Check SVG */}
                  {value === option.value && (
                    <svg className="h-4 w-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="mt-2 text-sm text-red-600 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1 0z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default Select;
