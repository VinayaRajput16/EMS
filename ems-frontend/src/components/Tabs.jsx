import React from 'react';

/**
 * Tabs Component - Tabbed navigation interface
 * 
 * @param {Array} tabs - Array of tabs with { label, value, icon, count }
 * @param {string} activeTab - Currently active tab value
 * @param {function} onChange - Tab change handler
 * @param {string} variant - 'underline' | 'pills' | 'enclosed'
 */
const Tabs = ({ 
  tabs = [],
  activeTab,
  onChange,
  variant = 'underline',
  className = '',
  ...props 
}) => {
  const variants = {
    underline: {
      container: 'border-b border-slate-200',
      tab: 'px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 -mb-px',
      active: 'border-indigo-600 text-indigo-600',
      inactive: 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
    },
    pills: {
      container: 'bg-slate-100 p-1 rounded-lg',
      tab: 'px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md',
      active: 'bg-white text-indigo-600 shadow-sm',
      inactive: 'text-slate-600 hover:text-slate-900'
    },
    enclosed: {
      container: 'border-b border-slate-200',
      tab: 'px-4 py-2.5 text-sm font-medium transition-all duration-200 border border-transparent rounded-t-lg -mb-px',
      active: 'bg-white border-slate-200 border-b-white text-indigo-600',
      inactive: 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
    }
  };
  
  const config = variants[variant];
  
  return (
    <div className={`${config.container} ${className}`} {...props}>
      <div className="flex gap-1">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => onChange(tab.value)}
            className={`${config.tab} ${
              activeTab === tab.value ? config.active : config.inactive
            } flex items-center gap-2`}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`px-2 py-0.5 text-xs rounded-full ${
                activeTab === tab.value 
                  ? 'bg-indigo-100 text-indigo-600' 
                  : 'bg-slate-200 text-slate-600'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
