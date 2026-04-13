const { body } = require("express-validator");

const contactValidator = [
  body("name")
    .notEmpty()
    .withMessage("Name is required (2-50 chars)")
    .trim()
    .escape()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name is required (2-50 chars)"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),

  body("message")
    .notEmpty()
    .withMessage("Message must be 10-1000 characters")
    .trim()
    .escape()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Message must be 10-1000 characters"),
];

module.exports = { contactValidator };
