const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const swaggerUi = require("swagger-ui-express");
const config = require("./config/env");
const connectDB = require("./config/db");
const swaggerSpec = require("./config/swagger");
const { globalLimiter } = require("./middlewares/rateLimiter");
const errorHandler = require("./middlewares/errorHandler");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const skillRoutes = require("./routes/skillRoutes");
const contactRoutes = require("./routes/contactRoutes");
const { version } = require("./package.json");

const app = express();

// Trust first proxy (Render, Railway, etc.)
app.set("trust proxy", 1);

// Security headers (CSP relaxed for Swagger UI and welcome page inline assets)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https://validator.swagger.io"],
      },
    },
  })
);

// Hide Express fingerprint
app.disable("x-powered-by");

// CORS — strict origin
app.use(cors({ origin: config.clientUrl, credentials: true }));

// Body parsers with size limit
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// NoSQL injection prevention (Express 5 compatible — req.query is read-only)
app.use((req, _res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);
  next();
});

// Global rate limiter
app.use("/api", globalLimiter);

// Swagger UI
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Portfolio API Docs",
  })
);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/contact", contactRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    environment: config.nodeEnv,
  });
});

// Root — Welcome page
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Portfolio API</title>
      <style>
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
          background: #0a0a1a;
          color: #e2e8f0;
          overflow: hidden;
          position: relative;
        }

        body::before {
          content: "";
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 600px 400px at 20% 30%, rgba(99, 102, 241, 0.12), transparent),
            radial-gradient(ellipse 500px 350px at 80% 70%, rgba(168, 85, 247, 0.10), transparent),
            radial-gradient(ellipse 300px 300px at 50% 50%, rgba(59, 130, 246, 0.06), transparent);
          pointer-events: none;
          z-index: 0;
        }

        body::after {
          content: "";
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
          z-index: 0;
        }

        .container {
          position: relative;
          z-index: 1;
          text-align: center;
          padding: 3rem 2.5rem;
          max-width: 480px;
          width: 90%;
          background: rgba(15, 15, 35, 0.65);
          border: 1px solid rgba(99, 102, 241, 0.15);
          border-radius: 20px;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow:
            0 0 40px rgba(99, 102, 241, 0.06),
            0 25px 50px rgba(0, 0, 0, 0.4);
        }

        h1 {
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #818cf8, #a78bfa, #c084fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
        }

        .version {
          display: inline-block;
          font-size: 0.8rem;
          font-weight: 500;
          color: #818cf8;
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.2);
          padding: 0.2rem 0.75rem;
          border-radius: 999px;
          letter-spacing: 0.04em;
          margin-bottom: 2rem;
        }

        .links {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 2.5rem;
        }

        .links a {
          display: block;
          padding: 0.85rem 1.5rem;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          letter-spacing: 0.01em;
          transition: all 0.25s ease;
        }

        .btn-primary {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
          border: none;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
        }

        .btn-secondary {
          background: rgba(99, 102, 241, 0.08);
          color: #a5b4fc;
          border: 1px solid rgba(99, 102, 241, 0.2);
        }

        .btn-secondary:hover {
          background: rgba(99, 102, 241, 0.15);
          border-color: rgba(99, 102, 241, 0.35);
          transform: translateY(-2px);
        }

        .sign {
          font-size: 0.8rem;
          color: #64748b;
        }

        .sign a {
          color: #818cf8;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .sign a:hover {
          color: #a78bfa;
        }

        @media (max-width: 480px) {
          .container { padding: 2rem 1.5rem; }
          h1 { font-size: 1.6rem; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Portfolio API</h1>
        <p class="version">v${version}</p>
        <div class="links">
          <a href="/api-docs" class="btn-primary">API Documentation</a>
          <a href="/api/health" class="btn-secondary">Health Check</a>
        </div>
        <footer class="sign">
          Created by
          <a href="https://serkanbayraktar.com/" target="_blank" rel="noopener noreferrer">Serkanby</a>
          |
          <a href="https://github.com/Serkanbyx" target="_blank" rel="noopener noreferrer">Github</a>
        </footer>
      </div>
    </body>
    </html>
  `);
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
