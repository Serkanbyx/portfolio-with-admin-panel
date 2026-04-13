const SIZE_MAP = {
  sm: "w-5 h-5 border-2",
  md: "w-8 h-8 border-[3px]",
  lg: "w-12 h-12 border-4",
};

const Spinner = ({ size = "md", fullScreen = false, className = "" }) => {
  const spinner = (
    <div
      className={`
        ${SIZE_MAP[size]}
        rounded-full animate-spin
        border-primary-500 border-t-transparent
        ${className}
      `}
      role="status"
      aria-label="Loading"
    />
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative">
          {spinner}
          <div className="absolute inset-0 blur-xl bg-primary-500/20 rounded-full" />
        </div>
      </div>
    );
  }

  return spinner;
};

export default Spinner;
