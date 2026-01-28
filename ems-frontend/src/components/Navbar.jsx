import React, { useState } from 'react';
import Button from './Button';

/**
 * Navbar Component - Main navigation header
 * 
 * @param {string} logo - Logo text or component
 * @param {Array} navItems - Array of nav items with { label, href, active }
 * @param {ReactNode} rightContent - Content for right side (user menu, etc)
 * @param {boolean} transparent - Transparent background
 */
const Navbar = ({ 
  logo = 'EventHub',
  navItems = [],
  rightContent,
  transparent = false,
  className = '',
  ...props 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const bgClass = transparent 
    ? 'bg-white/80 backdrop-blur-lg border-b border-slate-200/50' 
    : 'bg-white border-b border-slate-200';
  
  return (
    <nav className={`sticky top-0 z-40 ${bgClass} transition-all duration-300 ${className}`} {...props}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {logo}
              </span>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  item.active 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
          
          {/* Right Content */}
          <div className="hidden md:flex items-center gap-3">
            {rightContent}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  item.active 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </a>
            ))}
            <div className="pt-3 border-t border-slate-200">
              {rightContent}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
