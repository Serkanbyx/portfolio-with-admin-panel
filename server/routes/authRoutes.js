const express = require("express");
const { login, getMe } = require("../controllers/authController");
const { authLimiter } = require("../middlewares/rateLimiter");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.post("/login", authLimiter, login);
router.get("/me", protect, getMe);

module.exports = router;
