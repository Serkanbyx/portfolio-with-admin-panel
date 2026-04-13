const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");

const config = require("./config/env");
const connectDB = require("./config/db");
const { globalLimiter } = require("./middlewares/rateLimiter");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// Security headers
app.use(helmet());

// Hide Express fingerprint
app.disable("x-powered-by");

// CORS — strict origin
app.use(cors({ origin: config.clientUrl, credentials: true }));

// Body parsers with size limit
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// NoSQL injection prevention
app.use(mongoSanitize());

// HTTP parameter pollution protection
app.use(hpp());

// Global rate limiter
app.use("/api", globalLimiter);

// API routes (will be implemented in later steps)
// app.use("/api/auth", authRoutes);
// app.use("/api/projects", projectRoutes);
// app.use("/api/skills", skillRoutes);
// app.use("/api/contact", contactRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    environment: config.nodeEnv,
  });
});

// Global error handler (must be last)
app.use(errorHandler);

const startServer = async () => {
  await connectDB();

  app.listen(config.port, () => {
    console.log(
      `Server running in ${config.nodeEnv} mode on port ${config.port}`
    );
  });
};

startServer();
