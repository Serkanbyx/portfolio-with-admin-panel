import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { fadeInUp } from "../../utils/animations";

const SectionWrapper = ({ id, className = "", variants, children }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px 0px" });

  return (
    <section
      id={id}
      className={`py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${className}`}
    >
      <motion.div
        ref={ref}
        variants={variants || fadeInUp}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="max-w-7xl mx-auto relative z-10 will-change-[transform,opacity]"
      >
        {children}
      </motion.div>
    </section>
  );
};

export default SectionWrapper;
