const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Skill name is required"],
      trim: true,
      maxlength: [50, "Skill name cannot exceed 50 characters"],
      unique: true,
    },
    level: {
      type: Number,
      required: [true, "Skill level is required"],
      min: [0, "Level cannot be less than 0"],
      max: [100, "Level cannot be greater than 100"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      lowercase: true,
      enum: {
        values: ["frontend", "backend", "database", "devops", "tools", "other"],
        message:
          "Category must be one of: frontend, backend, database, devops, tools, other",
      },
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

skillSchema.index({ category: 1, order: 1 });
skillSchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model("Skill", skillSchema);
