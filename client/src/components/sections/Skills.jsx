import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef } from "react";
import {
  FiLayout,
  FiServer,
  FiDatabase,
  FiCloud,
  FiTool,
  FiBox,
  FiRefreshCw,
  FiCode,
  FiAlertCircle,
} from "react-icons/fi";
import SectionWrapper from "../ui/SectionWrapper";
import SectionHeading from "../ui/SectionHeading";
import GlassCard from "../ui/GlassCard";
import Skeleton from "../ui/Skeleton";
import SkillBar from "../ui/SkillBar";
import { getSkills } from "../../services/skillService";
import { SKILL_CATEGORIES } from "../../utils/constants";
import { staggerContainer, fadeInUp } from "../../utils/animations";

const ICON_MAP = {
  FiLayout: FiLayout,
  FiServer: FiServer,
  FiDatabase: FiDatabase,
  FiCloud: FiCloud,
  FiTool: FiTool,
  FiBox: FiBox,
};

const COLOR_BG_MAP = {
  "text-blue-400": "bg-blue-400/10",
  "text-green-400": "bg-green-400/10",
  "text-purple-400": "bg-purple-400/10",
  "text-orange-400": "bg-orange-400/10",
  "text-cyan-400": "bg-cyan-400/10",
  "text-gray-400": "bg-gray-400/10",
};

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const fetchSkills = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data } = await getSkills();
      setSkills(data.data || data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load skills.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const groupedSkills = useMemo(
    () =>
      skills.reduce((acc, skill) => {
        const category = skill.category || "other";
        if (!acc[category]) acc[category] = [];
        acc[category].push(skill);
        return acc;
      }, {}),
    [skills]
  );

  const activeCategories = SKILL_CATEGORIES.filter(
    (cat) => groupedSkills[cat.value]?.length > 0
  );

  return (
    <SectionWrapper id="skills">
      <SectionHeading
        title="Skills & Technologies"
        subtitle="Technologies I work with and my proficiency levels"
      />

      <div ref={sectionRef}>
        <AnimatePresence mode="wait">
          {/* Loading State */}
          {isLoading && (
            <motion.div
              key="skills-skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={`skill-skel-${i}`} className="glass-card rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <Skeleton className="h-5 w-24 rounded" />
                  </div>
                  <div className="space-y-4">
                    {Array.from({ length: 4 }).map((__, j) => (
                      <div key={j} className="space-y-2">
                        <div className="flex justify-between">
                          <Skeleton className="h-3 w-20 rounded" />
                          <Skeleton className="h-3 w-8 rounded" />
                        </div>
                        <Skeleton className="h-2 w-full rounded-full" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Error State */}
          {!isLoading && error && (
            <motion.div
              key="skills-error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard className="text-center py-12">
                <FiAlertCircle className="mx-auto text-red-400 mb-4" size={48} />
                <p className="text-red-400 mb-4">Unable to load skills</p>
                <motion.button
                  onClick={fetchSkills}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white text-sm px-5 py-2.5 rounded-lg transition-colors"
                >
                  <FiRefreshCw size={14} />
                  Retry
                </motion.button>
              </GlassCard>
            </motion.div>
          )}

          {/* Empty State */}
          {!isLoading && !error && skills.length === 0 && (
            <motion.div
              key="skills-empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard className="text-center py-16">
                <FiCode className="mx-auto text-dark-500 mb-4" size={48} />
                <p className="text-dark-400">Skills section coming soon!</p>
              </GlassCard>
            </motion.div>
          )}

          {/* Skills Content */}
          {!isLoading && !error && skills.length > 0 && (
            <motion.div
              key="skills-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                variants={staggerContainer(0.15)}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {activeCategories.map((category) => {
                  const Icon = ICON_MAP[category.icon] || FiBox;
                  const categorySkills = groupedSkills[category.value];
                  const bgColor =
                    COLOR_BG_MAP[category.color] || "bg-gray-400/10";

                  return (
                    <motion.div key={category.value} variants={fadeInUp}>
                      <GlassCard hover>
                        <div className="flex items-center gap-3 mb-6">
                          <div
                            className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center`}
                          >
                            <Icon className={category.color} size={20} />
                          </div>
                          <h3 className="text-lg font-semibold text-dark-100">
                            {category.label}
                          </h3>
                          <span className="text-xs text-dark-500 bg-dark-800 rounded-full px-2 py-0.5">
                            {categorySkills.length}
                          </span>
                        </div>

                        <div className="space-y-4">
                          {categorySkills.map((skill, index) => (
                            <SkillBar
                              key={skill._id}
                              name={skill.name}
                              level={skill.level}
                              index={index}
                            />
                          ))}
                        </div>
                      </GlassCard>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SectionWrapper>
  );
};

export default Skills;
