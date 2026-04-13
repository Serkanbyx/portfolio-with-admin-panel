const express = require("express");
const {
  getAllProjects,
  getProjectBySlug,
  getAdminProjects,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const { protect, adminOnly } = require("../middlewares/auth");
const { globalLimiter } = require("../middlewares/rateLimiter");

const router = express.Router();

router.get("/", globalLimiter, getAllProjects);

// /admin/all must be defined before /:slug to avoid "admin" being treated as a slug
router.get("/admin/all", protect, adminOnly, getAdminProjects);
router.get("/:slug", globalLimiter, getProjectBySlug);

router.post("/", protect, adminOnly, createProject);
router.put("/:id", protect, adminOnly, updateProject);
router.delete("/:id", protect, adminOnly, deleteProject);

module.exports = router;
