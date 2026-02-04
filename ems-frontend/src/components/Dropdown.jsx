// src/components/Dropdown.jsx
import React, { useState, useRef, useEffect } from 'react';

/**
 * Professional Dark Dropdown - Enterprise Grade
 */
const Dropdown = ({ 
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  error,
  required = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const selectedOption = options.find(opt => opt.value === value);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    if (!disabled) {
      onChange(option.value);
      setIsOpen(false);
    }
  };

  return (
    <div className={`space-y-3 ${className}`} ref={dropdownRef}>
      {label && (
        <label className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center">
          <svg className="w-4 h-4 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {label}
          {required && <span className="text-rose-400 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {/* Main Button - SOLID DARK BACKGROUND */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            w-full px-6 py-5 text-lg font-semibold text-left
            bg-gradient-to-r from-slate-800/95 to-slate-900/95 backdrop-blur-md
            border-2 rounded-2xl shadow-lg transition-all duration-300
            hover:shadow-emerald-500/20 hover:border-emerald-500/60
            focus:outline-none focus:ring-4 focus:ring-emerald-500/30
            ${error 
              ? 'border-rose-500/70 bg-rose-500/5 hover:border-rose-500/90 shadow-rose-500/20' 
              : isOpen 
                ? 'border-emerald-500/70 shadow-emerald-500/30 ring-4 ring-emerald-500/40 scale-[1.02]'
                : 'border-slate-600/50 hover:border-slate-500/70 shadow-slate-500/20'
            }
            ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-800/80 border-slate-700/50 shadow-slate-500/10' : ''}
          `}
          {...props}
        >
          <span className={`block truncate leading-tight ${
            selectedOption ? 'text-slate-100' : 'text-slate-500/90'
          }`}>
            {selectedOption?.label || placeholder}
          </span>
          <svg 
            className={`absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-all duration-300 ${
              isOpen ? 'rotate-180 text-emerald-400 scale-110' : 'text-slate-400'
            } ${disabled ? 'text-slate-600' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {/* Dropdown Menu - SOLID DARK PANEL */}
        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-3 bg-gradient-to-b from-slate-800/98 to-slate-900/98 backdrop-blur-xl border-2 border-slate-700/80 rounded-3xl shadow-2xl shadow-slate-900/60 max-h-80 overflow-hidden">
            {options.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelect(option)}
                className={`
                  w-full px-6 py-5 text-left transition-all duration-200 border-b border-slate-700/50 last:border-b-0
                  hover:bg-gradient-to-r hover:from-emerald-500/15 hover:to-emerald-600/10
                  hover:border-l-4 hover:border-emerald-500/60 hover:shadow-emerald-500/30 hover:translate-x-1
                  hover:text-emerald-200 font-semibold
                  ${option.value === value 
                    ? 'bg-gradient-to-r from-emerald-500/25 to-emerald-600/20 border-l-4 border-emerald-400 shadow-emerald-500/40 shadow-inner text-emerald-300 scale-[1.01]' 
                    : 'text-slate-300 hover:text-slate-100'
                  }
                `}
              >
                <div className="flex items-center space-x-4">
                  {option.icon && (
                    <span className="text-2xl flex-shrink-0 opacity-90">{option.icon}</span>
                  )}
                  <span>{option.label}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-rose-500/10 border border-rose-500/40 rounded-2xl backdrop-blur-sm">
          <svg className="w-5 h-5 text-rose-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium text-rose-300">{error}</span>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
