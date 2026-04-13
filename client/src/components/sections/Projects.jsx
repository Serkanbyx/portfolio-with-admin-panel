import { useState, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FiFolder, FiRefreshCw } from "react-icons/fi";
import SectionWrapper from "../ui/SectionWrapper";
import SectionHeading from "../ui/SectionHeading";
import GlassCard from "../ui/GlassCard";
import Skeleton from "../ui/Skeleton";
import FeaturedProjectCard from "../ui/FeaturedProjectCard";
import ProjectCard from "../ui/ProjectCard";
import { getProjects } from "../../services/projectService";
import { staggerContainer, fadeInUp } from "../../utils/animations";

const MAX_FEATURED = 3;

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data } = await getProjects();
      setProjects(data.data || data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load projects.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const featuredProjects = projects
    .filter((p) => p.featured)
    .slice(0, MAX_FEATURED);
  const otherProjects = projects.filter((p) => !p.featured);
  const hasFeatured = featuredProjects.length > 0;

  return (
    <SectionWrapper id="projects">
      <SectionHeading
        title="My Projects"
        subtitle="A selection of my recent work and side projects"
      />

      <div ref={sectionRef}>
        {/* Loading State */}
        {isLoading && (
          <div className="space-y-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={`feat-skel-${i}`} variant="card" />
            ))}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={`grid-skel-${i}`} variant="card" />
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <GlassCard className="text-center py-12">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchProjects}
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white text-sm px-5 py-2.5 rounded-lg transition-colors"
            >
              <FiRefreshCw size={14} />
              Retry
            </button>
          </GlassCard>
        )}

        {/* Empty State */}
        {!isLoading && !error && projects.length === 0 && (
          <GlassCard className="text-center py-16">
            <FiFolder className="mx-auto text-dark-500 mb-4" size={48} />
            <p className="text-dark-400">
              Projects coming soon! Check back later.
            </p>
          </GlassCard>
        )}

        {/* Projects Content */}
        {!isLoading && !error && projects.length > 0 && (
          <motion.div
            variants={staggerContainer(0.15)}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {/* Featured Projects */}
            {hasFeatured && (
              <div className="mb-16">
                <p className="text-primary-400 text-sm font-mono tracking-wider uppercase mb-6">
                  Featured
                </p>
                <div className="space-y-8">
                  {featuredProjects.map((project, index) => (
                    <motion.div key={project._id} variants={fadeInUp}>
                      <FeaturedProjectCard
                        project={project}
                        index={index}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Other Projects Grid */}
            {otherProjects.length > 0 && (
              <div>
                {hasFeatured && (
                  <p className="text-primary-400 text-sm font-mono tracking-wider uppercase mb-6">
                    Other Projects
                  </p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherProjects.map((project, index) => (
                    <motion.div key={project._id} variants={fadeInUp}>
                      <ProjectCard project={project} index={index} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </SectionWrapper>
  );
};

export default Projects;
