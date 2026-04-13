import { useState, useEffect, useRef, useCallback } from "react";
import { useInView } from "framer-motion";

const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

const AnimatedCounter = ({
  target,
  duration = 2000,
  suffix = "",
  prefix = "",
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const hasAnimated = useRef(false);

  const animate = useCallback(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = performance.now();

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);

      setCount(Math.floor(easedProgress * target));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(step);
  }, [target, duration]);

  useEffect(() => {
    if (isInView) animate();
  }, [isInView, animate]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{count}{suffix}
    </span>
  );
};

export default AnimatedCounter;
