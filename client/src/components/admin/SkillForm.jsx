import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { FiX } from "react-icons/fi";

import Spinner from "../ui/Spinner";
import * as skillService from "../../services/skillService";
import { SKILL_CATEGORIES } from "../../utils/constants";

const INITIAL_FORM_DATA = {
  name: "",
  category: "",
  level: 50,
  order: 0,
};

const SkillForm = ({ isOpen, onClose, editingSkill, onSuccess }) => {
  const isEditMode = Boolean(editingSkill);
  const modalRef = useRef(null);

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (editingSkill) {
      setFormData({
        name: editingSkill.name || "",
        category: editingSkill.category || "",
        level: editingSkill.level ?? 50,
        order: editingSkill.order ?? 0,
      });
    } else {
      setFormData(INITIAL_FORM_DATA);
    }
  }, [isOpen, editingSkill]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();

      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleLevelChange = useCallback((e) => {
    const value = Math.min(100, Math.max(0, parseInt(e.target.value, 10) || 0));
    setFormData((prev) => ({ ...prev, level: value }));
  }, []);

  const handleOrderChange = useCallback((e) => {
    const value = Math.max(0, parseInt(e.target.value, 10) || 0);
    setFormData((prev) => ({ ...prev, order: value }));
  }, []);

  const validate = useCallback(() => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return false;
    }
    if (formData.name.length > 50) {
      toast.error("Name must be under 50 characters");
      return false;
    }
    if (!formData.category) {
      toast.error("Category is required");
      return false;
    }
    if (formData.level < 0 || formData.level > 100) {
      toast.error("Level must be between 0 and 100");
      return false;
    }
    return true;
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await skillService.updateSkill(editingSkill._id, formData);
        toast.success("Skill updated");
      } else {
        await skillService.createSkill(formData);
        toast.success("Skill created");
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg bg-dark-800 border border-dark-700 text-dark-50 placeholder-dark-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors text-sm";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            ref={modalRef}
            className="glass rounded-2xl w-full max-w-lg"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="skill-form-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-0">
              <h2
                id="skill-form-title"
                className="text-lg font-semibold text-dark-50"
              >
                {isEditMode ? "Edit Skill" : "New Skill"}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg text-dark-400 hover:text-dark-50 hover:bg-dark-800 transition-colors"
                aria-label="Close modal"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-5">
                {/* Name */}
                <div>
                  <label
                    htmlFor="sf-name"
                    className="block text-sm font-medium text-dark-300 mb-1.5"
                  >
                    Name <span className="text-error-500">*</span>
                  </label>
                  <input
                    id="sf-name"
                    name="name"
                    type="text"
                    required
                    maxLength={50}
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="React"
                    className={inputClass}
                  />
                </div>

                {/* Category */}
                <div>
                  <label
                    htmlFor="sf-category"
                    className="block text-sm font-medium text-dark-300 mb-1.5"
                  >
                    Category <span className="text-error-500">*</span>
                  </label>
                  <select
                    id="sf-category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className={`${inputClass} appearance-none`}
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {SKILL_CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Level — Range Slider + Number */}
                <div>
                  <label
                    htmlFor="sf-level"
                    className="block text-sm font-medium text-dark-300 mb-1.5"
                  >
                    Level <span className="text-error-500">*</span>
                  </label>

                  <div className="flex items-center gap-4">
                    <span className="text-primary-400 font-mono text-lg font-bold min-w-[3ch]">
                      {formData.level}%
                    </span>

                    <input
                      id="sf-level"
                      type="range"
                      min={0}
                      max={100}
                      step={1}
                      value={formData.level}
                      onChange={handleLevelChange}
                      className="skill-range-slider flex-1 h-2 rounded-full appearance-none bg-dark-700 cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, var(--color-primary-500) ${formData.level}%, var(--color-dark-700) ${formData.level}%)`,
                      }}
                    />

                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={formData.level}
                      onChange={handleLevelChange}
                      aria-label="Level value"
                      className="w-16 px-2 py-2 rounded-lg bg-dark-800 border border-dark-700 text-dark-50 text-center font-mono text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Order */}
                <div>
                  <label
                    htmlFor="sf-order"
                    className="block text-sm font-medium text-dark-300 mb-1.5"
                  >
                    Order
                  </label>
                  <input
                    id="sf-order"
                    name="order"
                    type="number"
                    min={0}
                    value={formData.order}
                    onChange={handleOrderChange}
                    placeholder="0"
                    className="w-24 px-4 py-2.5 rounded-lg bg-dark-800 border border-dark-700 text-dark-50 placeholder-dark-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors text-sm"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-dark-800 p-6 pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
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
                  {isEditMode ? "Save Changes" : "Create Skill"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SkillForm;
