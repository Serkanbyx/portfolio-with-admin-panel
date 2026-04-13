const jwt = require("jsonwebtoken");
const config = require("../config/env");

const generateToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

const escapeHtml = (str) => {
  const htmlEntities = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
  };

  return str.replace(/[&<>"']/g, (char) => htmlEntities[char]);
};

module.exports = { generateToken, escapeHtml };
