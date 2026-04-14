import { motion } from "framer-motion";
import { FiExternalLink, FiGithub, FiCode } from "react-icons/fi";
import GlassCard from "./GlassCard";
import TechBadge from "./TechBadge";

const GRADIENT_COMBOS = [
  "from-primary-900/50 to-accent-900/50",
  "from-accent-900/50 to-primary-900/50",
  "from-primary-800/40 to-dark-800",
  "from-accent-800/40 to-dark-800",
];

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
};

const ProjectCard = ({ project, index = 0 }) => {
  const gradientClass = GRADIENT_COMBOS[index % GRADIENT_COMBOS.length];
  const techList = project.tech || [];
  const visibleTechs = techList.slice(0, 3);
  const remainingCount = techList.length - 3;

  return (
    <motion.div className="group" whileHover={{ y: -4, transition: { duration: 0.2 } }}>
      <GlassCard hover padding="p-0">
        {/* Image */}
        <div className="relative overflow-hidden rounded-t-xl">
          {project.image?.url ? (
            <motion.img
              src={project.image.url}
              alt={project.title}
              className="aspect-video object-cover w-full"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
            />
          ) : (
            <div
              className={`aspect-video w-full bg-linear-to-br ${gradientClass} flex items-center justify-center`}
            >
              <FiCode className="text-dark-500" size={40} />
            </div>
          )}

          {/* Hover overlay with action icons */}
          {(project.liveUrl || project.githubUrl) && (
            <div className="absolute inset-0 bg-linear-to-t from-dark-950/80 via-dark-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-primary-600/90 hover:bg-primary-500 text-white flex items-center justify-center transition-colors"
                  aria-label="Live demo"
                >
                  <FiExternalLink size={16} />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-dark-800/90 hover:bg-dark-700 text-white flex items-center justify-center transition-colors"
                  aria-label="Source code"
                >
                  <FiGithub size={16} />
                </a>
              )}
            </div>
          )}

          {project.featured && (
            <span className="absolute top-3 right-3 bg-primary-600/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Featured
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-semibold text-dark-50 mb-2 line-clamp-1 group-hover:text-primary-400 transition-colors">
            {project.title}
          </h3>

          <p className="text-dark-400 text-sm leading-relaxed line-clamp-2 mb-4">
            {project.description}
          </p>

          {visibleTechs.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {visibleTechs.map((tech) => (
                <TechBadge key={tech} name={tech} size="sm" />
              ))}
              {remainingCount > 0 && (
                <span className="inline-block px-2 py-0.5 text-[10px] text-dark-400 border border-dark-700 rounded-full font-mono">
                  +{remainingCount}
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-dark-800">
            <span className="text-dark-500 text-xs">
              {formatDate(project.createdAt)}
            </span>

            <div className="flex items-center gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg p-1.5 transition-colors duration-200"
                  aria-label="Live demo"
                >
                  <FiExternalLink size={16} />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg p-1.5 transition-colors duration-200"
                  aria-label="Source code"
                >
                  <FiGithub size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default ProjectCard;
