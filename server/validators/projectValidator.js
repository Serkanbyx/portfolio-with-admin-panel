const { body } = require("express-validator");

const createProjectValidator = [
  body("title")
    .notEmpty()
    .withMessage("Title is required (max 100 chars)")
    .trim()
    .escape()
    .isLength({ max: 100 })
    .withMessage("Title is required (max 100 chars)"),

  body("description")
    .notEmpty()
    .withMessage("Description is required (max 1000 chars)")
    .trim()
    .escape()
    .isLength({ max: 1000 })
    .withMessage("Description is required (max 1000 chars)"),

  body("tech")
    .isArray({ min: 1 })
    .withMessage("At least one technology is required"),

  body("tech.*")
    .trim()
    .escape()
    .isLength({ max: 30 })
    .withMessage("Each tech must be max 30 chars"),

  body("liveUrl")
    .optional({ values: "falsy" })
    .trim()
    .isURL()
    .withMessage("Must be a valid URL"),

  body("githubUrl")
    .optional({ values: "falsy" })
    .trim()
    .isURL()
    .withMessage("Must be a valid URL"),

  body("featured")
    .optional()
    .isBoolean()
    .withMessage("Featured must be a boolean"),

  body("order")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Order must be a non-negative integer")
    .toInt(),

  body("status")
    .optional()
    .isIn(["published", "draft"])
    .withMessage("Status must be published or draft"),
];

const updateProjectValidator = [
  body("title")
    .optional()
    .trim()
    .escape()
    .isLength({ max: 100 })
    .withMessage("Title is required (max 100 chars)"),

  body("description")
    .optional()
    .trim()
    .escape()
    .isLength({ max: 1000 })
    .withMessage("Description is required (max 1000 chars)"),

  body("tech")
    .optional()
    .isArray({ min: 1 })
    .withMessage("At least one technology is required"),

  body("tech.*")
    .trim()
    .escape()
    .isLength({ max: 30 })
    .withMessage("Each tech must be max 30 chars"),

  body("liveUrl")
    .optional({ values: "falsy" })
    .trim()
    .isURL()
    .withMessage("Must be a valid URL"),

  body("githubUrl")
    .optional({ values: "falsy" })
    .trim()
    .isURL()
    .withMessage("Must be a valid URL"),

  body("featured")
    .optional()
    .isBoolean()
    .withMessage("Featured must be a boolean"),

  body("order")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Order must be a non-negative integer")
    .toInt(),

  body("status")
    .optional()
    .isIn(["published", "draft"])
    .withMessage("Status must be published or draft"),
];

module.exports = { createProjectValidator, updateProjectValidator };
