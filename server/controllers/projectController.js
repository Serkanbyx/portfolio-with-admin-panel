const Project = require("../models/Project");
const { cloudinary, uploadImage, deleteImage } = require("../utils/cloudinary");

const ALLOWED_FIELDS = [
  "title",
  "description",
  "tech",
  "liveUrl",
  "githubUrl",
  "featured",
  "order",
  "status",
];

const pickFields = (source, fields) => {
  const picked = {};

  for (const field of fields) {
    if (source[field] !== undefined) {
      picked[field] = source[field];
    }
  }

  return picked;
};

const getAllProjects = async (req, res, next) => {
  try {
    const filter = { status: "published" };

    if (req.query.featured === "true") {
      filter.featured = true;
    }

    if (req.query.tech) {
      filter.tech = req.query.tech;
    }

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const sortField = req.query.sort || "order";
    const sort = { [sortField]: 1, createdAt: -1 };

    const [projects, total] = await Promise.all([
      Project.find(filter).sort(sort).skip(skip).limit(limit),
      Project.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: projects,
      pagination: { page, totalPages, total },
    });
  } catch (error) {
    next(error);
  }
};

const getProjectBySlug = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      slug: req.params.slug,
      status: "published",
    });

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

const getAdminProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });

    res.json({ success: true, data: projects });
  } catch (error) {
    next(error);
  }
};

const createProject = async (req, res, next) => {
  try {
    const fields = pickFields(req.body, ALLOWED_FIELDS);
    const project = await Project.create(fields);

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const updates = pickFields(req.body, ALLOWED_FIELDS);

    const project = await Project.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    if (project.image?.publicId) {
      await cloudinary.uploader.destroy(project.image.publicId);
    }

    await project.deleteOne();

    res.json({ success: true, message: "Project deleted" });
  } catch (error) {
    next(error);
  }
};

const uploadProjectImage = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No image file provided" });
    }

    if (project.image?.publicId) {
      await deleteImage(project.image.publicId);
    }

    const { url, publicId } = await uploadImage(req.file.buffer, "projects");

    project.image = { url, publicId };
    await project.save();

    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

const deleteProjectImage = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    if (!project.image?.publicId) {
      return res
        .status(400)
        .json({ success: false, message: "Project has no image" });
    }

    await deleteImage(project.image.publicId);

    project.image = {};
    await project.save();

    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProjects,
  getProjectBySlug,
  getAdminProjects,
  createProject,
  updateProject,
  deleteProject,
  uploadProjectImage,
  deleteProjectImage,
};
