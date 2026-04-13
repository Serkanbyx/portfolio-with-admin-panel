import { useState, useRef, useCallback } from "react";
import { toast } from "react-hot-toast";
import { FiUploadCloud, FiTrash2 } from "react-icons/fi";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ImageUploader = ({ currentImage, onFileSelect, onRemove }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const validateFile = useCallback((file) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Only JPEG, PNG, and WebP images are allowed");
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image must be less than 5MB");
      return false;
    }
    return true;
  }, []);

  const handleFile = useCallback(
    (file) => {
      if (!validateFile(file)) return;

      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      onFileSelect(file);
    },
    [validateFile, onFileSelect]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);

      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleInputChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = "";
    },
    [handleFile]
  );

  const handleRemove = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    onRemove();
  }, [previewUrl, onRemove]);

  const displayImage = previewUrl || currentImage;

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`
        relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
        transition-colors duration-200
        ${
          isDragOver
            ? "border-primary-500 bg-primary-500/5"
            : "border-dark-600 hover:border-dark-500"
        }
      `}
      role="button"
      tabIndex={0}
      aria-label="Upload image"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          fileInputRef.current?.click();
        }
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleInputChange}
        className="hidden"
        aria-hidden="true"
      />

      {displayImage ? (
        <div className="relative group">
          <img
            src={displayImage}
            alt="Project preview"
            className="w-full object-cover rounded-lg aspect-video"
          />

          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="px-4 py-2 rounded-lg bg-white/20 text-white text-sm font-medium hover:bg-white/30 transition-colors backdrop-blur-sm"
            >
              Change Image
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="p-2 rounded-lg bg-red-500/80 text-white hover:bg-red-500 transition-colors"
              aria-label="Remove image"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 py-4">
          <FiUploadCloud className="w-10 h-10 text-dark-500" />
          <p className="text-dark-300 font-medium">
            Drag & drop an image here
          </p>
          <p className="text-dark-500 text-sm">or click to browse</p>
          <p className="text-dark-600 text-xs mt-1">
            JPEG, PNG, WebP — max 5MB
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
