const Skill = require("../models/Skill");

const ALLOWED_FIELDS = ["name", "level", "category", "order"];

const pickFields = (source, fields) => {
  const picked = {};

  for (const field of fields) {
    if (source[field] !== undefined) {
      picked[field] = source[field];
    }
  }

  return picked;
};

const getAllSkills = async (req, res, next) => {
  try {
    const skills = await Skill.find().sort({ category: 1, order: 1 });

    res.json({ success: true, data: skills });
  } catch (error) {
    next(error);
  }
};

const createSkill = async (req, res, next) => {
  try {
    const fields = pickFields(req.body, ALLOWED_FIELDS);
    const skill = await Skill.create(fields);

    res.status(201).json({ success: true, data: skill });
  } catch (error) {
    next(error);
  }
};

const updateSkill = async (req, res, next) => {
  try {
    const updates = pickFields(req.body, ALLOWED_FIELDS);

    const skill = await Skill.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!skill) {
      return res
        .status(404)
        .json({ success: false, message: "Skill not found" });
    }

    res.json({ success: true, data: skill });
  } catch (error) {
    next(error);
  }
};

const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res
        .status(404)
        .json({ success: false, message: "Skill not found" });
    }

    await skill.deleteOne();

    res.json({ success: true, message: "Skill deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllSkills, createSkill, updateSkill, deleteSkill };
