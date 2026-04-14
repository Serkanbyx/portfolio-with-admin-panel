import { useState } from "react";
import {
  FiImage,
  FiStar,
  FiEdit2,
  FiTrash2,
  FiFolder,
  FiPlus,
} from "react-icons/fi";

import GlassCard from "../ui/GlassCard";
import StatusBadge from "../ui/StatusBadge";
import ConfirmModal from "../ui/ConfirmModal";
import Skeleton from "../ui/Skeleton";

const ProjectTable = ({
  projects,
  isLoading,
  onEdit,
  onDelete,
  onToggleFeatured,
  onAddNew,
}) => {
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

  if (projects.length === 0) {
    return (
      <GlassCard className="text-center py-16">
        <FiFolder className="w-12 h-12 text-dark-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-dark-200 mb-2">
          No projects yet
        </h3>
        <p className="text-dark-400 text-sm mb-6">
          Create your first project to get started.
        </p>
        <button
          type="button"
          onClick={onAddNew}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white font-medium text-sm hover:bg-primary-600 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Add New Project
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
                <th className="w-16 px-4 py-3 text-left">Image</th>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="w-28 px-4 py-3 text-left">Status</th>
                <th className="w-20 px-4 py-3 text-center">Featured</th>
                <th className="w-16 px-4 py-3 text-center">Order</th>
                <th className="w-24 px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr
                  key={project._id}
                  className="border-b border-dark-800/50 hover:bg-dark-800/30 transition-colors"
                >
                  {/* Image */}
                  <td className="px-4 py-3">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-dark-700 flex items-center justify-center">
                        <FiImage className="w-4 h-4 text-dark-500" />
                      </div>
                    )}
                  </td>

                  {/* Title & Slug */}
                  <td className="px-4 py-3">
                    <div className="font-medium text-dark-100">
                      {project.title}
                    </div>
                    <div className="text-dark-500 text-xs font-mono">
                      {project.slug}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <StatusBadge status={project.status} />
                  </td>

                  {/* Featured */}
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => onToggleFeatured(project)}
                      className="p-1.5 rounded-lg hover:bg-dark-700/50 transition-colors"
                      aria-label={
                        project.featured
                          ? "Remove from featured"
                          : "Mark as featured"
                      }
                    >
                      <FiStar
                        className={`w-4 h-4 ${
                          project.featured
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-dark-500 hover:text-dark-300"
                        }`}
                      />
                    </button>
                  </td>

                  {/* Order */}
                  <td className="px-4 py-3 text-dark-400 text-center font-mono">
                    {project.order}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(project)}
                        className="p-2 rounded-lg text-dark-400 hover:text-primary-400 hover:bg-dark-700/50 transition-colors"
                        aria-label={`Edit ${project.title}`}
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(project)}
                        className="p-2 rounded-lg text-dark-400 hover:text-error-500 hover:bg-dark-700/50 transition-colors"
                        aria-label={`Delete ${project.title}`}
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Project"
        message={`Are you sure you want to delete '${deleteTarget?.title}'? This action cannot be undone.`}
        confirmText="Delete"
        confirmColor="red"
        isLoading={isDeleting}
      />
    </>
  );
};

export default ProjectTable;
