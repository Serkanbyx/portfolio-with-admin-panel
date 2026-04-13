const dotenv = require("dotenv");

dotenv.config();

const requiredVars = [
  "MONGO_URI",
  "JWT_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
  "SMTP_HOST",
  "SMTP_USER",
  "SMTP_PASS",
  "CONTACT_TO_EMAIL",
];

const missingVars = requiredVars.filter((key) => !process.env[key]);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVars.join(", ")}`
  );
}

const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT, 10) || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  smtpHost: process.env.SMTP_HOST,
  smtpPort: parseInt(process.env.SMTP_PORT, 10) || 587,
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  contactToEmail: process.env.CONTACT_TO_EMAIL,
};

if (config.nodeEnv === "production") {
  if (config.jwtSecret.length < 32) {
    throw new Error(
      "JWT_SECRET must be at least 32 characters in production"
    );
  }

  if (config.adminPassword.length < 8) {
    throw new Error(
      "ADMIN_PASSWORD must be at least 8 characters in production"
    );
  }

  if (config.clientUrl === "*" || config.clientUrl.includes("localhost")) {
    throw new Error(
      "CLIENT_URL must not be '*' or localhost in production"
    );
  }
}

module.exports = config;
