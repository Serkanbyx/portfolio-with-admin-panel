const Settings = require("../models/Settings");

const getSettings = async (_req, res, next) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

const ALLOWED_FIELDS = [
  "name",
  "role",
  "greeting",
  "tagline",
  "location",
  "email",
  "profileImageUrl",
  "bio",
  "social",
];

const updateSettings = async (req, res, next) => {
  try {
    const updates = {};

    for (const field of ALLOWED_FIELDS) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create(updates);
    } else {
      Object.assign(settings, updates);
      await settings.save();
    }

    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSettings, updateSettings };
