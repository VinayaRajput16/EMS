const Input = ({ label, error, className = '', icon, ...props }) => (
  <div className="space-y-2 relative group">
    {label && (
      <label className="block text-sm font-semibold text-gray-800 group-focus-within:text-indigo-600 transition-colors">
        {label}
      </label>
    )}
    <div className="relative">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600">
          {icon}
        </div>
      )}
      <input
        {...props}
        className={`w-full pl-${icon ? '12' : '4'} pr-4 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200/50 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-transparent transition-all duration-300 ${
          error ? 'border-red-300 bg-red-50/50 focus:ring-red-500/20' : 'hover:border-indigo-300/50'
        } ${className}`}
      />
    </div>
    {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
  </div>
);

export default Input;
