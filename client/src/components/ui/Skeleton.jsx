const VARIANT_CLASSES = {
  text: "h-4 w-full rounded",
  circle: "w-12 h-12 rounded-full",
  card: "h-64 w-full rounded-xl",
  image: "aspect-video w-full rounded-xl",
};

const Skeleton = ({ className = "", variant = "text" }) => {
  return (
    <div
      className={`skeleton ${VARIANT_CLASSES[variant]} ${className}`}
      aria-hidden="true"
    />
  );
};

export default Skeleton;
