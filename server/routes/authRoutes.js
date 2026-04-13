const express = require("express");
const { login, getMe } = require("../controllers/authController");
const { authLimiter } = require("../middlewares/rateLimiter");
const { protect } = require("../middlewares/auth");
const { loginValidator } = require("../validators/authValidator");
const validate = require("../middlewares/validate");

const router = express.Router();

router.post("/login", authLimiter, loginValidator, validate, login);
router.get("/me", protect, getMe);

module.exports = router;
