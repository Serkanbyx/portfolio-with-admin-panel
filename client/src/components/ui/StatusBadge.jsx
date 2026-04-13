const STATUS_CONFIG = {
  published: {
    dot: "bg-green-400",
    bg: "bg-green-500/10",
    text: "text-green-400",
    border: "border-green-500/20",
    pulse: true,
  },
  draft: {
    dot: "bg-yellow-400",
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
    border: "border-yellow-500/20",
    pulse: false,
  },
};

const SIZE_MAP = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-3 py-1",
};

const StatusBadge = ({ status, size = "sm" }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border
        ${config.bg} ${config.text} ${config.border} ${SIZE_MAP[size]}
      `}
    >
      <span
        className={`
          w-1.5 h-1.5 rounded-full ${config.dot}
          ${config.pulse ? "animate-pulse" : ""}
        `}
      />
      <span className="capitalize font-medium">{status}</span>
    </span>
  );
};

export default StatusBadge;
