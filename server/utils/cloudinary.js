const { v2: cloudinary } = require("cloudinary");
const config = require("../config/env");

cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
});

/**
 * Uploads a file buffer to Cloudinary with auto-optimization.
 * @param {Buffer} fileBuffer - Image file buffer from multer memory storage
 * @param {string} folder - Subfolder name under "portfolio/" (e.g. "projects")
 * @returns {Promise<{url: string, publicId: string}>}
 */
const uploadImage = async (fileBuffer, folder) => {
  const base64 = fileBuffer.toString("base64");
  const dataUri = `data:image/png;base64,${base64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: `portfolio/${folder}`,
    resource_type: "image",
    transformation: [
      {
        width: 1200,
        height: 630,
        crop: "limit",
        quality: "auto",
        fetch_format: "auto",
      },
    ],
  });

  return { url: result.secure_url, publicId: result.public_id };
};

/**
 * Deletes an image from Cloudinary by its public ID.
 * @param {string} publicId - Cloudinary public ID of the image
 * @returns {Promise<object>} Cloudinary destroy result
 */
const deleteImage = async (publicId) => {
  const result = await cloudinary.uploader.destroy(publicId);
  return result;
};

module.exports = { cloudinary, uploadImage, deleteImage };
