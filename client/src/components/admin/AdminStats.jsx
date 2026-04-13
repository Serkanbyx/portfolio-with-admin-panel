import { FiFolder, FiCheckCircle, FiEdit, FiCode } from "react-icons/fi";

import GlassCard from "../ui/GlassCard";

const STATS_CONFIG = [
  {
    key: "totalProjects",
    label: "Total Projects",
    icon: FiFolder,
    iconColor: "text-primary-400",
    iconBg: "bg-primary-500/10",
  },
  {
    key: "published",
    label: "Published",
    icon: FiCheckCircle,
    iconColor: "text-success-500",
    iconBg: "bg-success-500/10",
  },
  {
    key: "drafts",
    label: "Drafts",
    icon: FiEdit,
    iconColor: "text-warning-500",
    iconBg: "bg-warning-500/10",
  },
  {
    key: "totalSkills",
    label: "Total Skills",
    icon: FiCode,
    iconColor: "text-accent-400",
    iconBg: "bg-accent-500/10",
  },
];

const AdminStats = ({ projects = [], skills = [] }) => {
  const statsValues = {
    totalProjects: projects.length,
    published: projects.filter((p) => p.status === "published").length,
    drafts: projects.filter((p) => p.status === "draft").length,
    totalSkills: skills.length,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {STATS_CONFIG.map(({ key, label, icon: Icon, iconColor, iconBg }) => (
        <GlassCard key={key} padding="p-5">
          <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center mb-3`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
          <p className="text-3xl font-bold text-dark-50">{statsValues[key]}</p>
          <p className="text-sm text-dark-400 mt-1">{label}</p>
        </GlassCard>
      ))}
    </div>
  );
};

export default AdminStats;
