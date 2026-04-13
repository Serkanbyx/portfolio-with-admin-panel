const express = require("express");
const { sendContactMessage } = require("../controllers/contactController");
const { contactLimiter } = require("../middlewares/rateLimiter");
const { contactValidator } = require("../validators/contactValidator");
const validate = require("../middlewares/validate");

const router = express.Router();

router.post("/", contactLimiter, contactValidator, validate, sendContactMessage);

module.exports = router;
