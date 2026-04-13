const multer = require("multer");

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and WebP images are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});

const uploadSingle = upload.single("image");

const handleMulterError = (err, _req, res, next) => {
  if (err instanceof multer.MulterError) {
    const messages = {
      LIMIT_FILE_SIZE: "File is too large. Maximum size is 5MB",
      LIMIT_UNEXPECTED_FILE: "Unexpected file field",
    };

    return res.status(400).json({
      success: false,
      message: messages[err.code] || err.message,
    });
  }

  if (err.message === "Only JPEG, PNG, and WebP images are allowed") {
    return res.status(400).json({ success: false, message: err.message });
  }

  next(err);
};

module.exports = { uploadSingle, handleMulterError };
