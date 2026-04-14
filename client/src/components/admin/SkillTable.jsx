import { useState } from "react";
import { FiEdit2, FiTrash2, FiCode, FiPlus } from "react-icons/fi";

import GlassCard from "../ui/GlassCard";
import ConfirmModal from "../ui/ConfirmModal";
import Skeleton from "../ui/Skeleton";

const CATEGORY_COLORS = {
  frontend: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  backend: "bg-green-500/10 text-green-400 border-green-500/20",
  database: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  devops: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  tools: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  other: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

const LEVEL_COLORS = {
  frontend: "bg-blue-500",
  backend: "bg-green-500",
  database: "bg-purple-500",
  devops: "bg-orange-500",
  tools: "bg-cyan-500",
  other: "bg-gray-500",
};

const SkillTable = ({ skills, isLoading, onEdit, onDelete, onAddNew }) => {
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await onDelete(deleteTarget._id);
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  if (isLoading) {
    return (
      <GlassCard padding="p-0">
        <div className="p-4 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      </GlassCard>
    );
  }

  if (skills.length === 0) {
    return (
      <GlassCard className="text-center py-16">
        <FiCode className="w-12 h-12 text-dark-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-dark-200 mb-2">
          No skills added yet
        </h3>
        <p className="text-dark-400 text-sm mb-6">
          Add your first skill to showcase your expertise.
        </p>
        <button
          type="button"
          onClick={onAddNew}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white font-medium text-sm hover:bg-primary-600 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Add New Skill
        </button>
      </GlassCard>
    );
  }

  return (
    <>
      <GlassCard padding="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-dark-800/50 text-dark-400 text-xs uppercase tracking-wider font-medium">
                <th className="px-4 py-3 text-left">Name</th>
                <th className="w-32 px-4 py-3 text-left">Category</th>
                <th className="w-48 px-4 py-3 text-left">Level</th>
                <th className="w-20 px-4 py-3 text-center">Order</th>
                <th className="w-24 px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((skill) => {
                const categoryClass =
                  CATEGORY_COLORS[skill.category] || CATEGORY_COLORS.other;
                const levelColor =
                  LEVEL_COLORS[skill.category] || LEVEL_COLORS.other;

                return (
                  <tr
                    key={skill._id}
                    className="border-b border-dark-800/50 hover:bg-dark-800/30 transition-colors"
                  >
                    {/* Name */}
                    <td className="px-4 py-3 font-medium text-dark-100">
                      {skill.name}
                    </td>

                    {/* Category Badge */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${categoryClass}`}
                      >
                        {skill.category}
                      </span>
                    </td>

                    {/* Level */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-dark-400 text-sm w-10 shrink-0">
                          {skill.level}%
                        </span>
                        <div className="w-24 h-1.5 rounded-full bg-dark-700">
                          <div
                            className={`h-full rounded-full ${levelColor} transition-all duration-300`}
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Order */}
                    <td className="px-4 py-3 text-dark-500 text-center">
                      {skill.order}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onEdit(skill)}
                          className="p-2 rounded-lg text-dark-400 hover:text-primary-400 hover:bg-dark-700/50 transition-colors"
                          aria-label={`Edit ${skill.name}`}
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(skill)}
                          className="p-2 rounded-lg text-dark-400 hover:text-error-500 hover:bg-dark-700/50 transition-colors"
                          aria-label={`Delete ${skill.name}`}
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Skill"
        message={`Are you sure you want to delete '${deleteTarget?.name}'?`}
        confirmText="Delete"
        confirmColor="red"
        isLoading={isDeleting}
      />
    </>
  );
};

export default SkillTable;
