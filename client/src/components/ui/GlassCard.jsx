const GlassCard = ({
  children,
  className = "",
  hover = false,
  padding = "p-6",
}) => {
  return (
    <div
      className={`
        glass rounded-2xl ${padding}
        ${hover ? "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-500/5 hover:border-primary-500/20" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default GlassCard;
