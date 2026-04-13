const express = require("express");
const {
  getAllSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} = require("../controllers/skillController");
const { protect, adminOnly } = require("../middlewares/auth");
const { globalLimiter } = require("../middlewares/rateLimiter");
const { createSkillValidator, updateSkillValidator } = require("../validators/skillValidator");
const validate = require("../middlewares/validate");

const router = express.Router();

router.get("/", globalLimiter, getAllSkills);
router.post("/", protect, adminOnly, createSkillValidator, validate, createSkill);
router.put("/:id", protect, adminOnly, updateSkillValidator, validate, updateSkill);
router.delete("/:id", protect, adminOnly, deleteSkill);

module.exports = router;
