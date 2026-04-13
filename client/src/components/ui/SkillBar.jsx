import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const SkillBar = ({ name, level, index = 0 }) => {
  const barRef = useRef(null);
  const isInView = useInView(barRef, { once: true });

  return (
    <div ref={barRef}>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm text-dark-200">{name}</span>
        <span className="text-sm text-dark-400 font-mono">{level}%</span>
      </div>

      <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-linear-to-r from-primary-600 to-primary-400 shadow-sm shadow-primary-500/30"
          initial={{ width: 0 }}
          animate={isInView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
        />
      </div>
    </div>
  );
};

export default SkillBar;
