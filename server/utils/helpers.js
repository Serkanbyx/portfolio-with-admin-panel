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

const DURATION_MULTIPLIERS = {
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
  w: 7 * 24 * 60 * 60 * 1000,
};

const parseDuration = (duration) => {
  const match = duration.match(/^(\d+)([smhdw])$/);
  if (!match) return 7 * DURATION_MULTIPLIERS.d;
  return parseInt(match[1], 10) * (DURATION_MULTIPLIERS[match[2]] || DURATION_MULTIPLIERS.d);
};

const getCookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: config.nodeEnv === "production",
  sameSite: config.nodeEnv === "production" ? "none" : "lax",
  maxAge,
});

module.exports = { generateToken, escapeHtml, parseDuration, getCookieOptions };
