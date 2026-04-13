import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Spinner from "./Spinner";

const springTransition = { type: "spring", stiffness: 400, damping: 17 };

const CONFIRM_COLORS = {
  red: "bg-red-500 hover:bg-red-600 focus:ring-red-500/30",
  primary: "bg-primary-500 hover:bg-primary-600 focus:ring-primary-500/30",
};

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  confirmColor = "red",
  isLoading = false,
}) => {
  const cancelRef = useRef(null);
  const modalRef = useRef(null);

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
    cancelRef.current?.focus();

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

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
            className="glass rounded-2xl p-6 max-w-md w-full"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
            aria-describedby="confirm-modal-message"
          >
            <h3
              id="confirm-modal-title"
              className="text-lg font-semibold text-dark-50 mb-2"
            >
              {title}
            </h3>
            <p
              id="confirm-modal-message"
              className="text-dark-400 text-sm mb-6"
            >
              {message}
            </p>

            <div className="flex items-center justify-end gap-3">
              <motion.button
                ref={cancelRef}
                type="button"
                onClick={onClose}
                disabled={isLoading}
                whileTap={{ scale: 0.97 }}
                transition={springTransition}
                className="px-4 py-2 rounded-lg text-sm font-medium text-dark-300 hover:text-dark-50 hover:bg-dark-700/50 transition-colors disabled:opacity-50"
              >
                Cancel
              </motion.button>
              <motion.button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={springTransition}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium text-white
                  transition-colors focus:ring-2 disabled:opacity-50
                  flex items-center gap-2
                  ${CONFIRM_COLORS[confirmColor]}
                `}
              >
                {isLoading && <Spinner size="sm" />}
                {confirmText}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
