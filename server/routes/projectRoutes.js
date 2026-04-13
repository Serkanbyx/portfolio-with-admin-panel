const express = require("express");
const {
  getAllProjects,
  getProjectBySlug,
  getAdminProjects,
  createProject,
  updateProject,
  deleteProject,
  uploadProjectImage,
  deleteProjectImage,
} = require("../controllers/projectController");
const { protect, adminOnly } = require("../middlewares/auth");
const { globalLimiter, uploadLimiter } = require("../middlewares/rateLimiter");
const { uploadSingle, handleMulterError } = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.get("/", globalLimiter, getAllProjects);

// /admin/all must be defined before /:slug to avoid "admin" being treated as a slug
router.get("/admin/all", protect, adminOnly, getAdminProjects);
router.get("/:slug", globalLimiter, getProjectBySlug);

router.post("/", protect, adminOnly, createProject);
router.put("/:id", protect, adminOnly, updateProject);
router.delete("/:id", protect, adminOnly, deleteProject);

router.post("/:id/image", protect, adminOnly, uploadLimiter, uploadSingle, handleMulterError, uploadProjectImage);
router.delete("/:id/image", protect, adminOnly, deleteProjectImage);

module.exports = router;
