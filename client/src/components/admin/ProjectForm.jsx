import { useState, useEffect, useMemo, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { FiX, FiExternalLink, FiGithub } from "react-icons/fi";

import ImageUploader from "./ImageUploader";
import ConfirmModal from "../ui/ConfirmModal";
import Spinner from "../ui/Spinner";
import * as projectService from "../../services/projectService";

const INITIAL_FORM_DATA = {
  title: "",
  description: "",
  tech: [],
  liveUrl: "",
  githubUrl: "",
  featured: false,
  status: "draft",
  order: 0,
};

const slideVariants = {
  hidden: { x: "100%" },
  visible: { x: 0, transition: { type: "spring", damping: 30, stiffness: 300 } },
  exit: { x: "100%", transition: { type: "spring", damping: 30, stiffness: 300 } },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const ProjectForm = ({ isOpen, onClose, editingProject, onSuccess }) => {
  const isEditMode = Boolean(editingProject);

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [techInput, setTechInput] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  const initialSnapshot = useMemo(() => {
    if (!isOpen) return null;
    if (editingProject) {
      return JSON.stringify({
        title: editingProject.title || "",
        description: editingProject.description || "",
        tech: editingProject.tech || [],
        liveUrl: editingProject.liveUrl || "",
        githubUrl: editingProject.githubUrl || "",
        featured: editingProject.featured || false,
        status: editingProject.status || "draft",
        order: editingProject.order ?? 0,
      });
    }
    return JSON.stringify(INITIAL_FORM_DATA);
  }, [isOpen, editingProject]);

  useEffect(() => {
    if (!isOpen) return;

    if (editingProject) {
      setFormData({
        title: editingProject.title || "",
        description: editingProject.description || "",
        tech: editingProject.tech || [],
        liveUrl: editingProject.liveUrl || "",
        githubUrl: editingProject.githubUrl || "",
        featured: editingProject.featured || false,
        status: editingProject.status || "draft",
        order: editingProject.order ?? 0,
      });
      setCurrentImage(editingProject.image?.url || null);
    } else {
      setFormData(INITIAL_FORM_DATA);
      setCurrentImage(null);
    }

    setTechInput("");
    setImageFile(null);
  }, [isOpen, editingProject]);

  // Lock body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const hasUnsavedChanges = useMemo(() => {
    if (!initialSnapshot) return false;
    return JSON.stringify(formData) !== initialSnapshot || imageFile !== null;
  }, [formData, initialSnapshot, imageFile]);

  const handleClose = useCallback(() => {
    if (hasUnsavedChanges) {
      setShowDiscardModal(true);
    } else {
      onClose();
    }
  }, [hasUnsavedChanges, onClose]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleNumberChange = useCallback((e) => {
    const value = Math.max(0, parseInt(e.target.value, 10) || 0);
    setFormData((prev) => ({ ...prev, order: value }));
  }, []);

  const addTechTag = useCallback(
    (rawValue) => {
      const value = rawValue.trim();
      if (!value) return;

      const isDuplicate = formData.tech.some(
        (t) => t.toLowerCase() === value.toLowerCase()
      );
      if (isDuplicate) return;

      setFormData((prev) => ({
        ...prev,
        tech: [...prev.tech, value],
      }));
      setTechInput("");
    },
    [formData.technologies]
  );

  const handleTechKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        addTechTag(techInput);
      }
    },
    [techInput, addTechTag]
  );

  const handleTechBlur = useCallback(() => {
    addTechTag(techInput);
  }, [techInput, addTechTag]);

  const removeTechTag = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      tech: prev.tech.filter((_, i) => i !== index),
    }));
  }, []);

  const handleImageSelect = useCallback((file) => {
    setImageFile(file);
  }, []);

  const handleImageRemove = useCallback(() => {
    setImageFile(null);
    setCurrentImage(null);
  }, []);

  const validate = useCallback(() => {
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return false;
    }
    if (formData.title.length > 100) {
      toast.error("Title must be under 100 characters");
      return false;
    }
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return false;
    }
    if (formData.description.length > 1000) {
      toast.error("Description must be under 1000 characters");
      return false;
    }
    if (formData.tech.length === 0) {
      toast.error("At least one technology is required");
      return false;
    }
    return true;
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      let projectId;

      if (isEditMode) {
        await projectService.updateProject(editingProject._id, formData);
        projectId = editingProject._id;
      } else {
        const res = await projectService.createProject(formData);
        projectId = res.data._id;
      }

      if (imageFile) {
        const fd = new FormData();
        fd.append("image", imageFile);
        await projectService.uploadProjectImage(projectId, fd);
      }

      toast.success(
        isEditMode
          ? "Project updated successfully"
          : "Project created successfully"
      );
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const descriptionLength = formData.description.length;
  const descriptionCounterColor =
    descriptionLength >= 1000
      ? "text-error-500"
      : descriptionLength >= 900
        ? "text-warning-500"
        : "text-dark-500";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleClose}
          />

          {/* Slide-in Panel */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-dark-900 border-l border-dark-800 z-50 flex flex-col"
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-dark-800 shrink-0">
              <h2 className="text-lg font-semibold text-dark-50">
                {isEditMode ? "Edit Project" : "New Project"}
              </h2>
              <button
                type="button"
                onClick={handleClose}
                className="p-2 rounded-lg text-dark-400 hover:text-dark-50 hover:bg-dark-800 transition-colors"
                aria-label="Close panel"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Title */}
                <div>
                  <label
                    htmlFor="pf-title"
                    className="block text-sm font-medium text-dark-300 mb-1.5"
                  >
                    Title <span className="text-error-500">*</span>
                  </label>
                  <input
                    id="pf-title"
                    name="title"
                    type="text"
                    required
                    maxLength={100}
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="My Awesome Project"
                    className="w-full px-4 py-2.5 rounded-lg bg-dark-800 border border-dark-700 text-dark-50 placeholder-dark-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors text-sm"
                  />
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="pf-description"
                    className="block text-sm font-medium text-dark-300 mb-1.5"
                  >
                    Description <span className="text-error-500">*</span>
                  </label>
                  <textarea
                    id="pf-description"
                    name="description"
                    rows={4}
                    required
                    maxLength={1000}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your project..."
                    className="w-full px-4 py-2.5 rounded-lg bg-dark-800 border border-dark-700 text-dark-50 placeholder-dark-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors text-sm resize-none"
                  />
                  <p className={`text-xs text-right mt-1 ${descriptionCounterColor}`}>
                    {descriptionLength} / 1000
                  </p>
                </div>

                {/* Technologies */}
                <div>
                  <label
                    htmlFor="pf-tech"
                    className="block text-sm font-medium text-dark-300 mb-1.5"
                  >
                    Technologies <span className="text-error-500">*</span>
                  </label>
                  <input
                    id="pf-tech"
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={handleTechKeyDown}
                    onBlur={handleTechBlur}
                    placeholder="Type and press Enter or comma to add"
                    className="w-full px-4 py-2.5 rounded-lg bg-dark-800 border border-dark-700 text-dark-50 placeholder-dark-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors text-sm"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    <AnimatePresence>
                      {formData.tech.map((tech, index) => (
                        <motion.span
                          key={tech}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                          className="bg-primary-500/10 text-primary-300 border border-primary-500/20 rounded-full px-3 py-1 text-sm flex items-center gap-1.5"
                        >
                          {tech}
                          <button
                            type="button"
                            onClick={() => removeTechTag(index)}
                            className="text-primary-400 hover:text-primary-200 transition-colors"
                            aria-label={`Remove ${tech}`}
                          >
                            <FiX className="w-3 h-3" />
                          </button>
                        </motion.span>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Live URL */}
                <div>
                  <label
                    htmlFor="pf-liveUrl"
                    className="block text-sm font-medium text-dark-300 mb-1.5"
                  >
                    Live URL
                  </label>
                  <div className="relative">
                    <FiExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                    <input
                      id="pf-liveUrl"
                      name="liveUrl"
                      type="url"
                      value={formData.liveUrl}
                      onChange={handleChange}
                      placeholder="https://myproject.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-dark-800 border border-dark-700 text-dark-50 placeholder-dark-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors text-sm"
                    />
                  </div>
                </div>

                {/* GitHub URL */}
                <div>
                  <label
                    htmlFor="pf-githubUrl"
                    className="block text-sm font-medium text-dark-300 mb-1.5"
                  >
                    GitHub URL
                  </label>
                  <div className="relative">
                    <FiGithub className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                    <input
                      id="pf-githubUrl"
                      name="githubUrl"
                      type="url"
                      value={formData.githubUrl}
                      onChange={handleChange}
                      placeholder="https://github.com/user/repo"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-dark-800 border border-dark-700 text-dark-50 placeholder-dark-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors text-sm"
                    />
                  </div>
                </div>

                {/* Featured Toggle + Status + Order Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Featured Toggle */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={formData.featured}
                      aria-label="Featured Project"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          featured: !prev.featured,
                        }))
                      }
                      className={`
                        relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0
                        ${formData.featured ? "bg-primary-600" : "bg-dark-700"}
                      `}
                    >
                      <span
                        className={`
                          absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white
                          transition-transform duration-200
                          ${formData.featured ? "translate-x-5" : "translate-x-0"}
                        `}
                      />
                    </button>
                    <span className="text-sm text-dark-300">Featured Project</span>
                  </div>

                  {/* Status Select */}
                  <div>
                    <label
                      htmlFor="pf-status"
                      className="block text-sm font-medium text-dark-300 mb-1.5"
                    >
                      Status
                    </label>
                    <select
                      id="pf-status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg bg-dark-800 border border-dark-700 text-dark-50 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors text-sm appearance-none"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>

                  {/* Order */}
                  <div>
                    <label
                      htmlFor="pf-order"
                      className="block text-sm font-medium text-dark-300 mb-1.5"
                    >
                      Order
                    </label>
                    <input
                      id="pf-order"
                      name="order"
                      type="number"
                      min={0}
                      value={formData.order}
                      onChange={handleNumberChange}
                      placeholder="0"
                      className="w-24 px-4 py-2.5 rounded-lg bg-dark-800 border border-dark-700 text-dark-50 placeholder-dark-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors text-sm"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <span className="block text-sm font-medium text-dark-300 mb-1.5">
                    Project Image
                  </span>
                  <ImageUploader
                    currentImage={currentImage}
                    onFileSelect={handleImageSelect}
                    onRemove={handleImageRemove}
                  />
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="border-t border-dark-800 p-4 flex gap-3 justify-end shrink-0">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg border border-dark-700 text-dark-300 text-sm font-medium hover:text-dark-50 hover:border-dark-600 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors disabled:opacity-50"
                >
                  {isSubmitting && <Spinner size="sm" />}
                  {isEditMode ? "Save Changes" : "Create Project"}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Discard Confirm Modal */}
          <ConfirmModal
            isOpen={showDiscardModal}
            onClose={() => setShowDiscardModal(false)}
            onConfirm={() => {
              setShowDiscardModal(false);
              onClose();
            }}
            title="Unsaved Changes"
            message="You have unsaved changes. Discard?"
            confirmText="Discard"
            confirmColor="red"
          />
        </>
      )}
    </AnimatePresence>
  );
};

export default ProjectForm;
