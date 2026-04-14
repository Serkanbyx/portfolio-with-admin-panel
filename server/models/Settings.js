const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    name: { type: String, default: "Your Name", trim: true },
    role: { type: String, default: "Full-Stack Developer", trim: true },
    greeting: { type: String, default: "Hello, I'm", trim: true },
    tagline: {
      type: String,
      default: "I build modern web applications with clean code and great user experiences.",
      trim: true,
    },
    location: { type: String, default: "Istanbul, Turkey", trim: true },
    email: { type: String, default: "your.email@example.com", trim: true },
    profileImageUrl: { type: String, default: "", trim: true },
    bio: { type: [String], default: [] },
    social: {
      github: { type: String, default: "", trim: true },
      linkedin: { type: String, default: "", trim: true },
      twitter: { type: String, default: "", trim: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);
