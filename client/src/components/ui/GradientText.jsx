const GradientText = ({ children, as: Tag = "span", className = "" }) => {
  return (
    <Tag className={`gradient-text ${className}`}>
      {children}
    </Tag>
  );
};

export default GradientText;
