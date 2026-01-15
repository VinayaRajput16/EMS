const Card = ({ children, className = '', hover = true, ...props }) => {
  const base = 'bg-white/70 backdrop-blur-xl border border-white/50 shadow-xl rounded-3xl overflow-hidden transition-all duration-500';
  
  return (
    <div className={`${base} ${hover ? 'hover:shadow-2xl hover:-translate-y-2 hover:bg-white/90' : ''} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
