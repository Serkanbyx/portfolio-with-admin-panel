const SIZE_MAP = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-3 py-1 text-xs",
};

const TechBadge = ({ name, size = "md" }) => {
  return (
    <span
      className={`
        inline-block bg-primary-500/10 text-primary-300
        border border-primary-500/20 rounded-full font-mono
        ${SIZE_MAP[size]}
      `}
    >
      {name}
    </span>
  );
};

export default TechBadge;
