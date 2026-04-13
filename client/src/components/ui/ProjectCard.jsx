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
  const techList = project.technologies || [];
  const visibleTechs = techList.slice(0, 3);
  const remainingCount = techList.length - 3;

  return (
    <GlassCard hover padding="p-0">
      {/* Image */}
      <div className="relative overflow-hidden rounded-t-xl">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="aspect-video object-cover w-full hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className={`aspect-video w-full bg-linear-to-br ${gradientClass} flex items-center justify-center`}
          >
            <FiCode className="text-dark-500" size={40} />
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
        <h3 className="text-lg font-semibold text-dark-50 mb-2 line-clamp-1">
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
                className="text-dark-400 hover:text-primary-400 transition-colors"
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
                className="text-dark-400 hover:text-primary-400 transition-colors"
                aria-label="Source code"
              >
                <FiGithub size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default ProjectCard;
