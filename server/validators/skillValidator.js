const { body } = require("express-validator");

const VALID_CATEGORIES = [
  "frontend",
  "backend",
  "database",
  "devops",
  "tools",
  "other",
];

const createSkillValidator = [
  body("name")
    .notEmpty()
    .withMessage("Name is required (max 50 chars)")
    .trim()
    .escape()
    .isLength({ max: 50 })
    .withMessage("Name is required (max 50 chars)"),

  body("level")
    .notEmpty()
    .withMessage("Level must be between 0 and 100")
    .isInt({ min: 0, max: 100 })
    .withMessage("Level must be between 0 and 100")
    .toInt(),

  body("category")
    .notEmpty()
    .withMessage("Invalid category")
    .isIn(VALID_CATEGORIES)
    .withMessage("Invalid category"),

  body("order")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Order must be a non-negative integer")
    .toInt(),
];

const updateSkillValidator = [
  body("name")
    .optional()
    .trim()
    .escape()
    .isLength({ max: 50 })
    .withMessage("Name is required (max 50 chars)"),

  body("level")
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage("Level must be between 0 and 100")
    .toInt(),

  body("category")
    .optional()
    .isIn(VALID_CATEGORIES)
    .withMessage("Invalid category"),

  body("order")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Order must be a non-negative integer")
    .toInt(),
];

module.exports = { createSkillValidator, updateSkillValidator };
