# 🎨 Portfolio With Admin Panel

A modern, production-ready portfolio website with a **CMS-like admin panel**, built with the **MERN** stack (MongoDB, Express, React, Node.js). Features JWT authentication, Cloudinary image uploads, contact form with email notifications, glassmorphism dark theme, smooth scroll animations with Framer Motion, and a security-hardened backend.

[![Created by Serkanby](https://img.shields.io/badge/Created%20by-Serkanby-blue?style=flat-square)](https://serkanbayraktar.com/)
[![GitHub](https://img.shields.io/badge/GitHub-Serkanbyx-181717?style=flat-square&logo=github)](https://github.com/Serkanbyx)

---

## Features

- **Responsive Single-Page Portfolio** — Fully responsive design with smooth scroll animations and glassmorphism dark theme
- **Admin Panel (CMS)** — JWT-authenticated admin dashboard for managing all portfolio content without touching code
- **Project Management** — Full CRUD operations with Cloudinary image uploads, featured project highlighting, and draft/published status
- **Skill Management** — Create, edit, and delete skills with category grouping and proficiency levels (0–100)
- **Contact Form** — Visitors can send messages directly; admin receives email notifications via Nodemailer (SMTP)
- **Message Inbox** — Admin inbox to view, read, and manage contact form submissions with read/unread status
- **Site Settings** — Dynamic site configuration (name, role, bio, social links) editable from admin panel; changes reflect on the public portfolio in real-time via SettingsContext
- **Unread Message Badge** — Admin sidebar shows live unread message count; dashboard displays message statistics
- **SEO Optimized** — Server-side meta tags with react-helmet-async and Open Graph support
- **Scroll Progress Bar** — Visual scroll indicator, animated counters, and micro-interactions throughout the UI
- **Route Protection** — Admin routes are guarded; unauthenticated users are redirected to login
- **Ownership Isolation** — Single admin user model with role-based access control
- **Security Hardened** — Helmet, CORS whitelist, rate limiting, input sanitization, HPP protection, and bcrypt password hashing
- **Swagger API Docs** — Interactive OpenAPI 3.0 documentation at `/api-docs` with full schema definitions and try-it-out

---

## Live Demo

[🚀 View Live Demo](https://portfolio-with-admin-panel.netlify.app/)

---

## Technologies

### Frontend

- **React 19** — Modern UI library with hooks and context for state management
- **Vite 8** — Lightning-fast build tool and dev server with HMR
- **Tailwind CSS 4** — Utility-first CSS framework with @tailwindcss/vite plugin
- **Framer Motion 12** — Production-ready animation library for smooth transitions and scroll effects
- **React Router 7** — Declarative client-side routing with nested layouts
- **Axios** — Promise-based HTTP client with interceptors for auth and error handling
- **React Helmet Async** — SEO management with dynamic meta tags and Open Graph support
- **React Hot Toast** — Elegant toast notifications for user feedback
- **React Icons** — Icon library for consistent visual elements

### Backend

- **Node.js** — Server-side JavaScript runtime
- **Express 5** — Minimal and flexible web application framework
- **MongoDB (Mongoose 9)** — NoSQL database with elegant object modeling and schema validation
- **JWT (jsonwebtoken)** — Stateless authentication with token-based sessions
- **Cloudinary** — Cloud-based image upload, storage, and transformation
- **Nodemailer** — Email sending for contact form notifications via SMTP
- **Multer 2** — Multipart form-data handling for image uploads (memory storage)
- **bcryptjs** — Secure password hashing with configurable salt rounds
- **express-validator** — Request validation and sanitization middleware
- **Helmet** — Secure HTTP headers
- **express-rate-limit** — Rate limiting for API protection
- **express-mongo-sanitize** — NoSQL injection prevention
- **hpp** — HTTP parameter pollution protection

---

## Installation

### Prerequisites

- **Node.js** v18+ and **npm**
- **MongoDB** — [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier) or local instance
- **[Cloudinary](https://cloudinary.com)** account (free tier) for image uploads
- **SMTP email account** — Gmail with App Password or any SMTP provider

### Local Development

**1. Clone the repository:**

```bash
git clone https://github.com/Serkanbyx/portfolio-with-admin-panel.git
cd portfolio-with-admin-panel
```

**2. Set up environment variables:**

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

**server/.env**

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your_jwt_secret_min_32_chars_here_change_this
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
CONTACT_TO_EMAIL=your_email@gmail.com
```

**client/.env**

```env
VITE_API_URL=http://localhost:5000/api
```

**3. Install dependencies:**

```bash
cd server && npm install
cd ../client && npm install
```

**4. Seed the admin user:**

```bash
cd ../server && npm run seed
```

**5. Run the application:**

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

The frontend runs at `http://localhost:5173` and the backend at `http://localhost:5000`.

---

## Usage

1. **Visit the portfolio** — Open `http://localhost:5173` to see the public-facing portfolio
2. **Navigate to admin** — Go to `/admin/login` and sign in with the `ADMIN_EMAIL` and `ADMIN_PASSWORD` from your `.env`
3. **Manage projects** — Add, edit, delete, and reorder projects; upload images via Cloudinary; toggle featured/draft status
4. **Manage skills** — Create skills with categories (frontend, backend, database, devops, tools) and proficiency levels
5. **View dashboard** — See stats overview for total projects, skills, and content status
6. **Contact form** — Visitors can send messages from the public portfolio; you receive them via email
7. **Message inbox** — View and manage contact form submissions from the admin panel; messages are marked as read automatically
8. **Site settings** — Update your name, role, bio, profile image URL, and social links from the settings page
9. **Logout** — Click logout from the admin panel to end the session

---

## How It Works?

### Authentication Flow

The application uses a single-admin JWT authentication model. The admin user is created via a seed script (`npm run seed`) that reads credentials from environment variables. On login, the server validates credentials with bcrypt, generates a JWT token with an expiration time, and returns it to the client. The client stores the token in `localStorage` and attaches it to every subsequent API request via an Axios request interceptor.

```javascript
// Axios interceptor — auto-attaches JWT to requests
requestInterceptor: (config) => {
  const token = localStorage.getItem("portfolio_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}
```

### Route Protection

On the frontend, `AdminRoute` and `GuestOnlyRoute` guards wrap protected routes. `AdminRoute` checks `AuthContext` for an authenticated admin user before rendering child routes; otherwise, it redirects to `/admin/login`. On the backend, `protect` middleware verifies the JWT, and `adminOnly` middleware checks the user role.

### Data Flow

1. **Public visitors** → React fetches published projects, skills, and site settings from public API endpoints (no auth required) → SettingsContext merges API data with siteConfig defaults
2. **Admin** → Authenticated requests hit protected endpoints → Express validates input with `express-validator` → Controllers interact with Mongoose models → Response sent back to client
3. **Image uploads** → Multer processes the file in memory → Controller uploads to Cloudinary → URL and public ID stored in MongoDB
4. **Contact form** → Validated message data → Stored in Messages collection → Nodemailer sends email via SMTP → Toast confirmation shown to visitor
5. **Settings sync** → Admin edits site settings → Saved to MongoDB → Public portfolio reads updated settings via SettingsContext on next visit

---

## API Endpoints

| Method   | Endpoint                   | Auth       | Description              |
| -------- | -------------------------- | ---------- | ------------------------ |
| `POST`   | `/api/auth/login`          | No         | Admin login              |
| `GET`    | `/api/auth/me`             | JWT        | Get current user         |
| `GET`    | `/api/projects`            | No         | Get published projects   |
| `GET`    | `/api/projects/admin/all`  | JWT+Admin  | Get all projects (admin) |
| `GET`    | `/api/projects/:slug`      | No         | Get project by slug      |
| `POST`   | `/api/projects`            | JWT+Admin  | Create project           |
| `PUT`    | `/api/projects/:id`        | JWT+Admin  | Update project           |
| `DELETE` | `/api/projects/:id`        | JWT+Admin  | Delete project           |
| `POST`   | `/api/projects/:id/image`  | JWT+Admin  | Upload project image     |
| `DELETE` | `/api/projects/:id/image`  | JWT+Admin  | Delete project image     |
| `GET`    | `/api/skills`              | No         | Get all skills           |
| `POST`   | `/api/skills`              | JWT+Admin  | Create skill             |
| `PUT`    | `/api/skills/:id`          | JWT+Admin  | Update skill             |
| `DELETE` | `/api/skills/:id`          | JWT+Admin  | Delete skill             |
| `POST`   | `/api/contact`             | No         | Send contact message     |
| `GET`    | `/api/messages`            | JWT+Admin  | Get all messages         |
| `PATCH`  | `/api/messages/:id/read`   | JWT+Admin  | Mark message as read     |
| `DELETE` | `/api/messages/:id`        | JWT+Admin  | Delete message           |
| `GET`    | `/api/settings`            | No         | Get site settings        |
| `PUT`    | `/api/settings`            | JWT+Admin  | Update site settings     |
| `GET`    | `/api/health`              | No         | Health check             |
| `GET`    | `/api-docs`                | No         | Swagger API documentation|

> Auth endpoints require `Authorization: Bearer <token>` header.

---

## Project Structure

```
portfolio-with-admin-panel/
├── client/                          # React frontend (Vite)
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosInstance.js      # Axios config with interceptors
│   │   ├── components/
│   │   │   ├── admin/                # Admin panel components
│   │   │   │   ├── AdminStats.jsx    # Dashboard statistics
│   │   │   │   ├── ImageUploader.jsx # Cloudinary image upload
│   │   │   │   ├── ProjectForm.jsx   # Project create/edit form
│   │   │   │   ├── ProjectTable.jsx  # Project list table
│   │   │   │   ├── SkillForm.jsx     # Skill create/edit form
│   │   │   │   └── SkillTable.jsx    # Skill list table
│   │   │   ├── layout/               # Layout components
│   │   │   │   ├── AdminLayout.jsx   # Admin panel layout wrapper
│   │   │   │   ├── Footer.jsx        # Public footer
│   │   │   │   ├── MainLayout.jsx    # Public layout wrapper
│   │   │   │   └── Navbar.jsx        # Public navigation bar
│   │   │   ├── sections/             # Portfolio sections
│   │   │   │   ├── About.jsx         # About section
│   │   │   │   ├── Contact.jsx       # Contact form section
│   │   │   │   ├── Hero.jsx          # Hero/landing section
│   │   │   │   ├── Projects.jsx      # Projects showcase
│   │   │   │   └── Skills.jsx        # Skills display
│   │   │   └── ui/                   # Reusable UI components
│   │   │       ├── AnimatedCounter.jsx
│   │   │       ├── ConfirmModal.jsx
│   │   │       ├── FeaturedProjectCard.jsx
│   │   │       ├── GlassCard.jsx
│   │   │       ├── GradientText.jsx
│   │   │       ├── ProfileAvatar.jsx
│   │   │       ├── ProjectCard.jsx
│   │   │       ├── ScrollProgressBar.jsx
│   │   │       ├── ScrollToTop.jsx
│   │   │       ├── SectionHeading.jsx
│   │   │       ├── SectionWrapper.jsx
│   │   │       ├── Skeleton.jsx
│   │   │       ├── SkillBar.jsx
│   │   │       ├── Spinner.jsx
│   │   │       ├── StatusBadge.jsx
│   │   │       └── TechBadge.jsx
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx       # Auth state management
│   │   │   └── SettingsContext.jsx   # Dynamic site settings from API
│   │   ├── guards/
│   │   │   ├── AdminRoute.jsx        # Protected admin route guard
│   │   │   └── GuestOnlyRoute.jsx    # Guest-only route guard
│   │   ├── hooks/
│   │   │   ├── useDebounce.js        # Debounce hook
│   │   │   ├── useMediaQuery.js      # Responsive media query hook
│   │   │   └── useScrollSpy.js       # Scroll spy for active nav
│   │   ├── config/
│   │   │   └── siteConfig.js         # Site-level configuration
│   │   ├── pages/
│   │   │   ├── AdminDashboardPage.jsx
│   │   │   ├── AdminLoginPage.jsx
│   │   │   ├── AdminMessagesPage.jsx
│   │   │   ├── AdminProjectsPage.jsx
│   │   │   ├── AdminSettingsPage.jsx
│   │   │   ├── AdminSkillsPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── services/
│   │   │   ├── authService.js        # Auth API calls
│   │   │   ├── contactService.js     # Contact API calls
│   │   │   ├── messageService.js     # Message API calls
│   │   │   ├── projectService.js     # Project API calls
│   │   │   ├── settingsService.js    # Settings API calls
│   │   │   └── skillService.js       # Skill API calls
│   │   ├── utils/
│   │   │   ├── animations.js         # Framer Motion variants
│   │   │   └── constants.js          # App constants
│   │   ├── App.jsx                   # Root component with routing
│   │   ├── main.jsx                  # Entry point
│   │   └── index.css                 # Global styles (Tailwind)
│   ├── netlify.toml                  # SPA redirect & build config
│   └── vite.config.js                # Vite configuration
│
├── server/                           # Express backend
│   ├── config/
│   │   ├── db.js                     # MongoDB connection
│   │   ├── env.js                    # Environment config loader
│   │   └── swagger.js                # Swagger/OpenAPI configuration
│   ├── controllers/
│   │   ├── authController.js         # Auth handlers
│   │   ├── contactController.js      # Contact form handler
│   │   ├── messageController.js      # Message inbox handlers
│   │   ├── projectController.js      # Project CRUD handlers
│   │   ├── settingsController.js     # Site settings handlers
│   │   └── skillController.js        # Skill CRUD handlers
│   ├── middlewares/
│   │   ├── auth.js                   # JWT protect & adminOnly
│   │   ├── errorHandler.js           # Global error handler
│   │   ├── rateLimiter.js            # Rate limiting configs
│   │   ├── uploadMiddleware.js       # Multer image upload
│   │   └── validate.js              # express-validator runner
│   ├── models/
│   │   ├── Message.js                # Message schema
│   │   ├── Project.js                # Project schema
│   │   ├── Settings.js               # Site settings schema
│   │   ├── Skill.js                  # Skill schema
│   │   └── User.js                   # User schema (admin)
│   ├── routes/
│   │   ├── authRoutes.js             # Auth endpoints
│   │   ├── contactRoutes.js          # Contact endpoints
│   │   ├── messageRoutes.js          # Message endpoints
│   │   ├── projectRoutes.js          # Project endpoints
│   │   ├── settingsRoutes.js         # Settings endpoints
│   │   └── skillRoutes.js            # Skill endpoints
│   ├── utils/
│   │   ├── cloudinary.js             # Cloudinary config
│   │   ├── helpers.js                # Utility functions
│   │   └── sendEmail.js              # Nodemailer transporter
│   ├── validators/
│   │   ├── authValidator.js          # Auth validation rules
│   │   ├── contactValidator.js       # Contact validation rules
│   │   ├── projectValidator.js       # Project validation rules
│   │   └── skillValidator.js         # Skill validation rules
│   ├── index.js                      # Express entry point
│   ├── seed.js                       # Admin user seeder
│   └── .env.example                  # Environment template
│
└── README.md
```

---

## Security

- **Helmet** — Sets secure HTTP headers to protect against common web vulnerabilities
- **CORS** — Strict origin whitelist; no wildcards in production, only the configured `CLIENT_URL` is allowed
- **Rate Limiting** — Multiple tiers: global (100/15min), auth (10/15min), contact (5/hour), upload (20/15min)
- **express-mongo-sanitize** — Strips `$` and `.` from user input to prevent NoSQL injection attacks
- **hpp** — HTTP parameter pollution protection to prevent query string manipulation
- **bcryptjs** — Password hashing with 12 salt rounds; passwords are never stored in plain text
- **JWT** — Stateless authentication with configurable expiration; tokens are validated on every protected request
- **Input Validation** — All endpoints validated with express-validator; structured error responses
- **File Upload Restrictions** — Multer enforces JPEG/PNG/WebP only, 5MB max file size, memory storage
- **Request Size Limits** — JSON and URL-encoded body parsing limited to 10KB

---

## Deployment

### Backend — Render

1. Create a new **Web Service** on [Render](https://render.com) and connect your GitHub repository.
2. Configure the service:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** `Node`
3. Add environment variables:

| Variable              | Value                                         |
| --------------------- | --------------------------------------------- |
| `NODE_ENV`            | `production`                                  |
| `MONGO_URI`           | MongoDB Atlas connection string               |
| `JWT_SECRET`          | Random 64-char hex (`openssl rand -hex 32`)   |
| `JWT_EXPIRES_IN`      | `7d`                                          |
| `CLIENT_URL`          | Netlify frontend URL (no trailing slash)      |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary dashboard → Cloud name          |
| `CLOUDINARY_API_KEY`  | Cloudinary dashboard → API Key                |
| `CLOUDINARY_API_SECRET` | Cloudinary dashboard → API Secret           |
| `ADMIN_EMAIL`         | Admin email address                           |
| `ADMIN_PASSWORD`      | Strong password (min 8 chars)                 |
| `SMTP_HOST`           | `smtp.gmail.com`                              |
| `SMTP_PORT`           | `587`                                         |
| `SMTP_USER`           | Your Gmail address                            |
| `SMTP_PASS`           | Gmail App Password                            |
| `CONTACT_TO_EMAIL`    | Contact form recipient email                  |

4. Deploy and verify: `GET https://your-app.onrender.com/api/health`
5. Run `npm run seed` via Render Shell tab to create the admin user.

### Frontend — Netlify

1. Create a new site on [Netlify](https://www.netlify.com) and connect your GitHub repository.
2. Configure the build:
   - **Base Directory:** `client`
   - **Build Command:** `npm run build`
   - **Publish Directory:** `client/dist`
3. Add environment variable:

| Variable       | Value                                           |
| -------------- | ----------------------------------------------- |
| `VITE_API_URL` | Render backend URL + `/api` (e.g. `https://your-app.onrender.com/api`) |

4. Deploy.

> **Note:** SPA client-side routing is handled by `client/netlify.toml` — all routes redirect to `index.html`.

### MongoDB Atlas Setup

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a database user with a **strong generated password** (different from `ADMIN_PASSWORD`).
3. Network Access: add `0.0.0.0/0` to allow connections from Render.
4. Get the connection string (`mongodb+srv://...`). **Never commit it.**

### Post-Deployment

- Update `CLIENT_URL` on Render to your exact Netlify URL (no trailing slash).
- Redeploy the backend for CORS to take effect.
- Run the seed script via Render Shell to create the admin user in production.

### Custom Domain (Optional)

- **Netlify:** Site Settings → Domain Management → Add custom domain → Configure DNS.
- **Render:** Settings → Custom Domains → Add domain (e.g. `api.yourname.dev`) → Configure DNS.
- Update `VITE_API_URL` and `CLIENT_URL` accordingly.

---

## Features in Detail

### Completed Features

- ✅ Responsive single-page portfolio with glassmorphism dark theme
- ✅ Framer Motion scroll animations and page transitions
- ✅ Admin dashboard with project and skill statistics
- ✅ Full CRUD for projects with image upload (Cloudinary)
- ✅ Full CRUD for skills with category grouping
- ✅ Featured project highlighting with custom ordering
- ✅ Draft/Published status management for projects
- ✅ Contact form with SMTP email notifications
- ✅ Admin message inbox with read/unread status tracking
- ✅ Dynamic site settings management from admin panel
- ✅ SettingsContext — public portfolio reads settings from API with siteConfig fallback
- ✅ Unread message badge in admin sidebar with live count
- ✅ Dashboard message statistics (unread messages stat card)
- ✅ JWT authentication with protected routes
- ✅ SEO optimization with react-helmet-async
- ✅ Scroll progress bar and animated counters
- ✅ Skeleton loading states for better UX
- ✅ Toast notifications for all user actions
- ✅ Custom hooks (useDebounce, useMediaQuery, useScrollSpy)
- ✅ Production security hardening (Helmet, CORS, rate limiting, sanitization)

### Future Features

- 🔮 [ ] Blog section with rich text editor
- 🔮 [ ] Analytics dashboard with visitor tracking
- 🔮 [ ] Dark/Light theme toggle for visitors
- 🔮 [ ] Multi-language support (i18n)
- 🔮 [ ] Resume/CV download feature

---

## Contributing

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feat/amazing-feature`)
3. **Commit** your changes (`git commit -m "feat: add amazing feature"`)
4. **Push** to the branch (`git push origin feat/amazing-feature`)
5. **Open** a Pull Request

### Commit Message Format

| Prefix      | Description                        |
| ----------- | ---------------------------------- |
| `feat:`     | New feature                        |
| `fix:`      | Bug fix                            |
| `refactor:` | Code refactoring                   |
| `docs:`     | Documentation changes              |
| `chore:`    | Maintenance and dependency updates |

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Developer

**Serkanby**

- Website: [serkanbayraktar.com](https://serkanbayraktar.com/)
- GitHub: [@Serkanbyx](https://github.com/Serkanbyx)
- Email: [serkanbyx1@gmail.com](mailto:serkanbyx1@gmail.com)

---

## Acknowledgments

- [React](https://react.dev/) — UI library
- [Vite](https://vite.dev/) — Build tool
- [Tailwind CSS](https://tailwindcss.com/) — CSS framework
- [Framer Motion](https://motion.dev/) — Animation library
- [Express](https://expressjs.com/) — Web framework
- [MongoDB](https://www.mongodb.com/) — Database
- [Cloudinary](https://cloudinary.com/) — Image management
- [Render](https://render.com/) — Backend hosting
- [Netlify](https://www.netlify.com/) — Frontend hosting

---

## Contact

- [Open an Issue](https://github.com/Serkanbyx/portfolio-with-admin-panel/issues)
- Email: [serkanbyx1@gmail.com](mailto:serkanbyx1@gmail.com)
- Website: [serkanbayraktar.com](https://serkanbayraktar.com/)

---

⭐ If you like this project, don't forget to give it a star!
