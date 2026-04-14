const swaggerJsdoc = require("swagger-jsdoc");
const { version } = require("../package.json");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Portfolio With Admin Panel API",
    version,
    description:
      "RESTful API for a modern portfolio website with CMS-like admin panel. " +
      "Built with Express 5, MongoDB, JWT authentication, Cloudinary image uploads, " +
      "and Nodemailer contact form.",
    contact: {
      name: "Serkanby",
      url: "https://serkanbayraktar.com/",
    },
    license: {
      name: "MIT",
      url: "https://github.com/Serkanbyx/portfolio-with-admin-panel/blob/main/LICENSE",
    },
  },
  servers: [
    {
      url: "/api",
      description: "API base path",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your JWT token obtained from POST /api/auth/login",
      },
    },
    schemas: {
      Error: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Error message" },
        },
      },
      ValidationError: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          errors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                field: { type: "string", example: "email" },
                message: { type: "string", example: "Valid email is required" },
              },
            },
          },
        },
      },

      // ─── Auth ───
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "admin@example.com",
          },
          password: { type: "string", example: "your_password" },
        },
      },
      LoginResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          token: {
            type: "string",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          },
          user: { $ref: "#/components/schemas/UserSummary" },
        },
      },
      UserSummary: {
        type: "object",
        properties: {
          id: { type: "string", example: "664a1b2c3d4e5f6a7b8c9d0e" },
          email: { type: "string", example: "admin@example.com" },
          role: { type: "string", enum: ["admin"], example: "admin" },
        },
      },

      // ─── Project ───
      ProjectImage: {
        type: "object",
        properties: {
          url: {
            type: "string",
            example: "https://res.cloudinary.com/.../image.jpg",
          },
          publicId: { type: "string", example: "projects/abc123" },
        },
      },
      Project: {
        type: "object",
        properties: {
          _id: { type: "string", example: "664a1b2c3d4e5f6a7b8c9d0e" },
          title: { type: "string", example: "Portfolio Website" },
          slug: { type: "string", example: "portfolio-website" },
          description: {
            type: "string",
            example: "A modern portfolio built with MERN stack",
          },
          tech: {
            type: "array",
            items: { type: "string" },
            example: ["React", "Node.js", "MongoDB"],
          },
          image: { $ref: "#/components/schemas/ProjectImage" },
          liveUrl: {
            type: "string",
            example: "https://example.com",
          },
          githubUrl: {
            type: "string",
            example: "https://github.com/user/repo",
          },
          featured: { type: "boolean", example: true },
          order: { type: "integer", example: 1 },
          status: {
            type: "string",
            enum: ["published", "draft"],
            example: "published",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2026-04-14T12:00:00.000Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2026-04-14T12:00:00.000Z",
          },
        },
      },
      CreateProjectRequest: {
        type: "object",
        required: ["title", "description", "tech"],
        properties: {
          title: {
            type: "string",
            maxLength: 100,
            example: "Portfolio Website",
          },
          description: {
            type: "string",
            maxLength: 1000,
            example: "A modern portfolio built with MERN stack",
          },
          tech: {
            type: "array",
            items: { type: "string", maxLength: 30 },
            minItems: 1,
            example: ["React", "Node.js", "MongoDB"],
          },
          liveUrl: { type: "string", format: "uri", example: "https://example.com" },
          githubUrl: { type: "string", format: "uri", example: "https://github.com/user/repo" },
          featured: { type: "boolean", default: false },
          order: { type: "integer", minimum: 0, default: 0 },
          status: {
            type: "string",
            enum: ["published", "draft"],
            default: "published",
          },
        },
      },
      UpdateProjectRequest: {
        type: "object",
        properties: {
          title: { type: "string", maxLength: 100 },
          description: { type: "string", maxLength: 1000 },
          tech: {
            type: "array",
            items: { type: "string", maxLength: 30 },
            minItems: 1,
          },
          liveUrl: { type: "string", format: "uri" },
          githubUrl: { type: "string", format: "uri" },
          featured: { type: "boolean" },
          order: { type: "integer", minimum: 0 },
          status: { type: "string", enum: ["published", "draft"] },
        },
      },
      ProjectListResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/Project" },
          },
          pagination: {
            type: "object",
            properties: {
              page: { type: "integer", example: 1 },
              totalPages: { type: "integer", example: 3 },
              total: { type: "integer", example: 25 },
            },
          },
        },
      },

      // ─── Skill ───
      Skill: {
        type: "object",
        properties: {
          _id: { type: "string", example: "664a1b2c3d4e5f6a7b8c9d0e" },
          name: { type: "string", example: "React" },
          level: { type: "integer", example: 90 },
          category: {
            type: "string",
            enum: ["frontend", "backend", "database", "devops", "tools", "other"],
            example: "frontend",
          },
          order: { type: "integer", example: 1 },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CreateSkillRequest: {
        type: "object",
        required: ["name", "level", "category"],
        properties: {
          name: { type: "string", maxLength: 50, example: "React" },
          level: {
            type: "integer",
            minimum: 0,
            maximum: 100,
            example: 90,
          },
          category: {
            type: "string",
            enum: ["frontend", "backend", "database", "devops", "tools", "other"],
            example: "frontend",
          },
          order: { type: "integer", minimum: 0, default: 0 },
        },
      },
      UpdateSkillRequest: {
        type: "object",
        properties: {
          name: { type: "string", maxLength: 50 },
          level: { type: "integer", minimum: 0, maximum: 100 },
          category: {
            type: "string",
            enum: ["frontend", "backend", "database", "devops", "tools", "other"],
          },
          order: { type: "integer", minimum: 0 },
        },
      },

      // ─── Contact ───
      ContactRequest: {
        type: "object",
        required: ["name", "email", "message"],
        properties: {
          name: {
            type: "string",
            minLength: 2,
            maxLength: 50,
            example: "John Doe",
          },
          email: {
            type: "string",
            format: "email",
            example: "john@example.com",
          },
          message: {
            type: "string",
            minLength: 10,
            maxLength: 1000,
            example: "Hello, I would like to discuss a project with you.",
          },
        },
      },

      // ─── Health ───
      HealthResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Server is running" },
          environment: { type: "string", example: "development" },
        },
      },
    },

    responses: {
      Unauthorized: {
        description: "Authentication required or invalid token",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Error" },
            example: { success: false, message: "Authentication required" },
          },
        },
      },
      Forbidden: {
        description: "Admin access required",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Error" },
            example: { success: false, message: "Admin access required" },
          },
        },
      },
      NotFound: {
        description: "Resource not found",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Error" },
            example: { success: false, message: "Resource not found" },
          },
        },
      },
      ValidationFailed: {
        description: "Validation failed",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ValidationError" },
          },
        },
      },
      TooManyRequests: {
        description: "Rate limit exceeded",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Error" },
            example: {
              success: false,
              message: "Too many requests, please try again later",
            },
          },
        },
      },
    },
  },

  tags: [
    { name: "Auth", description: "Authentication endpoints" },
    { name: "Projects", description: "Portfolio project management" },
    { name: "Skills", description: "Skill management" },
    { name: "Contact", description: "Contact form" },
    { name: "Health", description: "Server health check" },
  ],

  paths: {
    // ─── Auth ───
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Admin login",
        description: "Authenticate with email and password to receive a JWT token.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginResponse" },
              },
            },
          },
          401: {
            description: "Invalid credentials",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: {
                  success: false,
                  message: "Invalid email or password",
                },
              },
            },
          },
          422: { $ref: "#/components/responses/ValidationFailed" },
          429: { $ref: "#/components/responses/TooManyRequests" },
        },
      },
    },
    "/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get current user",
        description: "Returns the authenticated admin user's profile.",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Current user info",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    user: { $ref: "#/components/schemas/UserSummary" },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },

    // ─── Projects ───
    "/projects": {
      get: {
        tags: ["Projects"],
        summary: "Get published projects",
        description:
          "Returns a paginated list of published projects. Supports filtering by featured status and tech stack.",
        parameters: [
          {
            name: "featured",
            in: "query",
            schema: { type: "string", enum: ["true"] },
            description: "Filter featured projects only",
          },
          {
            name: "tech",
            in: "query",
            schema: { type: "string" },
            description: "Filter by technology name",
          },
          {
            name: "page",
            in: "query",
            schema: { type: "integer", minimum: 1, default: 1 },
            description: "Page number",
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", minimum: 1, maximum: 50, default: 20 },
            description: "Items per page (max 50)",
          },
          {
            name: "sort",
            in: "query",
            schema: { type: "string", default: "order" },
            description: "Sort field",
          },
        ],
        responses: {
          200: {
            description: "List of published projects",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProjectListResponse" },
              },
            },
          },
        },
      },
      post: {
        tags: ["Projects"],
        summary: "Create project",
        description: "Create a new portfolio project. Requires admin authentication.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateProjectRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Project created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/Project" },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          422: { $ref: "#/components/responses/ValidationFailed" },
        },
      },
    },
    "/projects/admin/all": {
      get: {
        tags: ["Projects"],
        summary: "Get all projects (admin)",
        description:
          "Returns all projects including drafts. Requires admin authentication.",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "All projects",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Project" },
                    },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/projects/{slug}": {
      get: {
        tags: ["Projects"],
        summary: "Get project by slug",
        description: "Returns a single published project by its URL slug.",
        parameters: [
          {
            name: "slug",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Project URL slug",
            example: "portfolio-website",
          },
        ],
        responses: {
          200: {
            description: "Project details",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/Project" },
                  },
                },
              },
            },
          },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/projects/{id}": {
      put: {
        tags: ["Projects"],
        summary: "Update project",
        description: "Update an existing project. Requires admin authentication.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Project MongoDB ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateProjectRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Project updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/Project" },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
          422: { $ref: "#/components/responses/ValidationFailed" },
        },
      },
      delete: {
        tags: ["Projects"],
        summary: "Delete project",
        description:
          "Permanently delete a project and its Cloudinary image. Requires admin authentication.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Project MongoDB ID",
          },
        ],
        responses: {
          200: {
            description: "Project deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Project deleted" },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/projects/{id}/image": {
      post: {
        tags: ["Projects"],
        summary: "Upload project image",
        description:
          "Upload or replace a project's image via Cloudinary. Accepts JPEG, PNG, WebP (max 5MB). Requires admin authentication.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Project MongoDB ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["image"],
                properties: {
                  image: {
                    type: "string",
                    format: "binary",
                    description: "Image file (JPEG, PNG, WebP — max 5MB)",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Image uploaded",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/Project" },
                  },
                },
              },
            },
          },
          400: {
            description: "No image file provided",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
          429: { $ref: "#/components/responses/TooManyRequests" },
        },
      },
      delete: {
        tags: ["Projects"],
        summary: "Delete project image",
        description:
          "Remove a project's image from Cloudinary and clear the reference. Requires admin authentication.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Project MongoDB ID",
          },
        ],
        responses: {
          200: {
            description: "Image deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/Project" },
                  },
                },
              },
            },
          },
          400: {
            description: "Project has no image",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },

    // ─── Skills ───
    "/skills": {
      get: {
        tags: ["Skills"],
        summary: "Get all skills",
        description:
          "Returns all skills sorted by category and display order.",
        responses: {
          200: {
            description: "List of skills",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Skill" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Skills"],
        summary: "Create skill",
        description: "Add a new skill to the portfolio. Requires admin authentication.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateSkillRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Skill created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/Skill" },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          422: { $ref: "#/components/responses/ValidationFailed" },
        },
      },
    },
    "/skills/{id}": {
      put: {
        tags: ["Skills"],
        summary: "Update skill",
        description: "Update an existing skill. Requires admin authentication.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Skill MongoDB ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateSkillRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Skill updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/Skill" },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
          422: { $ref: "#/components/responses/ValidationFailed" },
        },
      },
      delete: {
        tags: ["Skills"],
        summary: "Delete skill",
        description: "Remove a skill permanently. Requires admin authentication.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Skill MongoDB ID",
          },
        ],
        responses: {
          200: {
            description: "Skill deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Skill deleted" },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },

    // ─── Contact ───
    "/contact": {
      post: {
        tags: ["Contact"],
        summary: "Send contact message",
        description:
          "Submit a contact form message. The admin receives an email notification via SMTP.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ContactRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Message sent successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Message sent successfully",
                    },
                  },
                },
              },
            },
          },
          422: { $ref: "#/components/responses/ValidationFailed" },
          429: { $ref: "#/components/responses/TooManyRequests" },
          500: {
            description: "Email sending failed",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: {
                  success: false,
                  message: "Failed to send message. Please try again later.",
                },
              },
            },
          },
        },
      },
    },

    // ─── Health ───
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        description: "Returns server status and current environment.",
        responses: {
          200: {
            description: "Server is healthy",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HealthResponse" },
              },
            },
          },
        },
      },
    },
  },
};

const swaggerSpec = swaggerJsdoc({
  swaggerDefinition,
  apis: [],
});

module.exports = swaggerSpec;
