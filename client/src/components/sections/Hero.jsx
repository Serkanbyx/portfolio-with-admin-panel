import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiArrowDown, FiMail, FiGithub, FiLinkedin, FiChevronDown } from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";
import GradientText from "../ui/GradientText";
import { fadeInUp, staggerContainer } from "../../utils/animations";
import { SOCIAL_LINKS } from "../../utils/constants";
import siteConfig from "../../config/siteConfig";

const HERO_CONTENT = {
  greeting: siteConfig.greeting,
  name: siteConfig.name,
  role: siteConfig.role,
  tagline: siteConfig.tagline,
};

const ICON_MAP = {
  FiGithub,
  FiLinkedin,
  FaXTwitter,
};

const Hero = () => {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollIndicator(window.scrollY < 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTo = (id) => {
    const element = document.querySelector(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Gradient Orbs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl"
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-400/5 rounded-full blur-3xl"
          animate={{ y: [0, -10, 0], x: [0, 10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Subtle Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-4"
        variants={staggerContainer(0.1)}
        initial="hidden"
        animate="visible"
      >
        <motion.p
          className="text-primary-400 text-lg font-mono tracking-wider mb-4"
          variants={fadeInUp}
        >
          {HERO_CONTENT.greeting}
        </motion.p>

        <motion.h1
          className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4"
          variants={fadeInUp}
        >
          <GradientText>{HERO_CONTENT.name}</GradientText>
        </motion.h1>

        <motion.p
          className="text-xl sm:text-2xl text-dark-300 font-light mb-6"
          variants={fadeInUp}
        >
          {HERO_CONTENT.role}
        </motion.p>

        <motion.p
          className="text-dark-400 max-w-xl mx-auto text-lg leading-relaxed mb-10"
          variants={fadeInUp}
        >
          {HERO_CONTENT.tagline}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div className="flex gap-4 justify-center mb-12" variants={fadeInUp}>
          <motion.button
            type="button"
            onClick={() => handleScrollTo("#projects")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-8 py-3 rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-primary-500/25 cursor-pointer"
          >
            <FiArrowDown className="text-lg" />
            View Projects
          </motion.button>
          <motion.button
            type="button"
            onClick={() => handleScrollTo("#contact")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="flex items-center gap-2 border border-dark-600 hover:border-primary-500 text-dark-200 hover:text-primary-400 px-8 py-3 rounded-xl font-medium transition-all cursor-pointer"
          >
            <FiMail className="text-lg" />
            Contact Me
          </motion.button>
        </motion.div>

        {/* Social Icons */}
        <motion.div className="flex gap-6 justify-center" variants={fadeInUp}>
          {SOCIAL_LINKS.map((link) => {
            const Icon = ICON_MAP[link.icon];
            return (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="text-dark-500 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg p-2 transition-colors duration-200 text-xl"
              >
                {Icon && <Icon />}
              </a>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{
          y: [0, 8, 0],
          opacity: showScrollIndicator ? 1 : 0,
        }}
        transition={{
          y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 0.3 },
        }}
      >
        <FiChevronDown className="text-dark-500 text-2xl" />
      </motion.div>
    </section>
  );
};

export default Hero;
