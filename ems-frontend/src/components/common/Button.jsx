const Button = ({ children, variant = 'primary', size = 'md', className = '', loading = false, ...props }) => {
  const base = 'font-semibold rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-offset-2 transition-all duration-300 overflow-hidden relative group';
  
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 text-white hover:shadow-2xl hover:-translate-y-1 hover:from-indigo-700 hover:to-emerald-700 focus:ring-indigo-500',
    secondary: 'bg-white/80 backdrop-blur-sm border border-white/50 text-gray-900 hover:bg-white hover:shadow-xl hover:-translate-y-0.5 focus:ring-indigo-500/50',
    outline: 'border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:border-white/50 focus:ring-white/50'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg font-bold'
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} disabled={loading} {...props}>
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        <>
          {children}
          <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 rounded-2xl transition-transform origin-center duration-300" />
        </>
      )}
    </button>
  );
};

export default Button;
