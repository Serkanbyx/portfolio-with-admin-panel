import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import SectionWrapper from "../ui/SectionWrapper";
import SectionHeading from "../ui/SectionHeading";
import GlassCard from "../ui/GlassCard";
import AnimatedCounter from "../ui/AnimatedCounter";
import ProfileAvatar from "../ui/ProfileAvatar";
import {
  fadeInLeft,
  fadeInRight,
  scaleIn,
  staggerContainer,
} from "../../utils/animations";
import { useSettings } from "../../contexts/SettingsContext";

const About = () => {
  const { settings } = useSettings();
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const statsRef = useRef(null);

  const isLeftInView = useInView(leftRef, { once: true, margin: "-100px" });
  const isRightInView = useInView(rightRef, { once: true, margin: "-100px" });
  const isStatsInView = useInView(statsRef, { once: true, margin: "-100px" });

  return (
    <SectionWrapper id="about">
      <SectionHeading
        title="About Me"
        subtitle="A little about who I am and what I do"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Column — Profile Image */}
        <motion.div
          ref={leftRef}
          variants={fadeInLeft}
          initial="hidden"
          animate={isLeftInView ? "visible" : "hidden"}
          className="flex justify-center lg:justify-start"
        >
          <div className="relative">
            {/* Decorative ghost frame */}
            <div className="absolute top-4 left-4 w-full h-full rounded-2xl border-2 border-primary-500/30" />

            <ProfileAvatar
              className="relative z-10 rounded-2xl aspect-square object-cover w-full max-w-md border-2 border-dark-700 shadow-2xl shadow-primary-500/10"
            />
          </div>
        </motion.div>

        {/* Right Column — Bio & Tech Stack */}
        <motion.div
          ref={rightRef}
          variants={fadeInRight}
          initial="hidden"
          animate={isRightInView ? "visible" : "hidden"}
        >
          <div className="space-y-4 text-dark-300 leading-relaxed text-lg">
            {settings.bio.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <p className="mt-6 text-primary-400 font-mono text-sm">
            {settings.techStack}
          </p>
        </motion.div>
      </div>

      {/* Stats Row */}
      <motion.div
        ref={statsRef}
        variants={staggerContainer(0.1)}
        initial="hidden"
        animate={isStatsInView ? "visible" : "hidden"}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12"
      >
        {settings.stats.map((stat) => (
          <motion.div key={stat.label} variants={scaleIn}>
            <GlassCard className="text-center">
              <div className="text-3xl font-bold text-primary-400">
                <AnimatedCounter
                  target={stat.target}
                  suffix={stat.suffix}
                />
              </div>
              <p className="text-dark-400 text-sm mt-1">{stat.label}</p>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
};

export default About;
