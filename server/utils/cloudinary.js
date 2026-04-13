const { v2: cloudinary } = require("cloudinary");
const config = require("../config/env");

cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
});

module.exports = cloudinary;
