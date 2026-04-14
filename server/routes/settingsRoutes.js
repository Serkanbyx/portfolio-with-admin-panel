const express = require("express");
const { getSettings, updateSettings } = require("../controllers/settingsController");
const { protect, adminOnly } = require("../middlewares/auth");

const router = express.Router();

router.get("/", getSettings);
router.put("/", protect, adminOnly, updateSettings);

module.exports = router;
