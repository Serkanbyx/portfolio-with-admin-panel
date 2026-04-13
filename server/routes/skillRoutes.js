const express = require("express");
const {
  getAllSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} = require("../controllers/skillController");
const { protect, adminOnly } = require("../middlewares/auth");
const { globalLimiter } = require("../middlewares/rateLimiter");

const router = express.Router();

router.get("/", globalLimiter, getAllSkills);
router.post("/", protect, adminOnly, createSkill);
router.put("/:id", protect, adminOnly, updateSkill);
router.delete("/:id", protect, adminOnly, deleteSkill);

module.exports = router;
