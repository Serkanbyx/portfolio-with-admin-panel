import { useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    scaleX.jump(scrollYProgress.get() || 0);
  }, [scaleX, scrollYProgress]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-0.5 z-60 origin-left bg-linear-to-r from-primary-600 to-accent-500"
      style={{ scaleX }}
    />
  );
};

export default ScrollProgressBar;
