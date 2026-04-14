import { motion } from "framer-motion";
import { FiExternalLink, FiGithub } from "react-icons/fi";
import GlassCard from "./GlassCard";
import TechBadge from "./TechBadge";

const getProjectInitials = (title) =>
  title
    ?.split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "P";

const FeaturedProjectCard = ({ project, index }) => {
  const isEven = index % 2 === 0;

  return (
    <motion.div className="group" whileHover={{ y: -4, transition: { duration: 0.2 } }}>
      <GlassCard hover padding="p-6 lg:p-8">
        <div className="lg:grid lg:grid-cols-2 gap-8 items-center">
          {/* Image Side */}
          <div
            className={`relative overflow-hidden rounded-xl group ${!isEven ? "lg:order-1" : ""}`}
          >
            {project.image?.url ? (
              <motion.img
                src={project.image.url}
                alt={project.title}
                className="aspect-video object-cover w-full"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
              />
            ) : (
              <div className="aspect-video w-full bg-linear-to-br from-primary-900/50 to-accent-900/50 flex items-center justify-center">
                <span className="text-4xl font-bold text-dark-300">
                  {getProjectInitials(project.title)}
                </span>
              </div>
            )}

            <div className="absolute inset-0 bg-linear-to-t from-dark-950/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6 gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary-600 hover:bg-primary-500 text-white text-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <FiExternalLink size={14} />
                  View Demo
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-dark-800 hover:bg-dark-700 text-white text-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <FiGithub size={14} />
                  Source
                </a>
              )}
            </div>
          </div>

          {/* Content Side */}
          <div className="mt-6 lg:mt-0">
            <h3 className="text-2xl font-bold text-dark-50 mb-3 group-hover:text-primary-400 transition-colors">
              {project.title}
            </h3>

            <p className="text-dark-300 leading-relaxed mb-4">
              {project.description}
            </p>

            {project.tech?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech.map((tech) => (
                  <TechBadge key={tech} name={tech} />
                ))}
              </div>
            )}

            <div className="flex gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                >
                  <FiExternalLink size={14} />
                  Live Demo
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-dark-600 hover:border-dark-400 text-dark-200 text-sm px-4 py-2 rounded-lg transition-colors"
                >
                  <FiGithub size={14} />
                  Source Code
                </a>
              )}
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default FeaturedProjectCard;
