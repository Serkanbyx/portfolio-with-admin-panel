const { body } = require("express-validator");

const loginValidator = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),

  body("password").trim().notEmpty().withMessage("Password is required"),
];

module.exports = { loginValidator };
