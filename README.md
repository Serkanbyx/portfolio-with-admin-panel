# Portfolio With Admin Panel

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?logo=framer&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-✓-3448C5?logo=cloudinary&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?logo=jsonwebtokens&logoColor=white)

> A modern, production-ready portfolio website with a CMS-like admin panel for managing projects and skills.

## Features

- Responsive single-page portfolio with smooth scroll animations
- Glassmorphism dark theme with gradient accents
- Admin panel with JWT authentication (single admin user)
- Project management with Cloudinary image uploads
- Skill management with category grouping
- Contact form with email notifications via Nodemailer
- SEO optimized with react-helmet-async and Open Graph tags
- Scroll progress bar, animated counters, and micro-interactions
- Production-ready security (Helmet, CORS, rate limiting, input sanitization)

## Tech Stack

| Category   | Technologies                                                            |
| ---------- | ----------------------------------------------------------------------- |
| Frontend   | React 19, Vite, TailwindCSS v4, Framer Motion, React Router v7, Axios  |
| Backend    | Node.js, Express 5, MongoDB, Mongoose, JWT                              |
| Services   | Cloudinary (images), Nodemailer (email)                                 |
| Security   | Helmet, CORS, Rate Limiting, express-mongo-sanitize, hpp, bcryptjs      |
| Deployment | Render (backend), Netlify (frontend), MongoDB Atlas                     |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or [Atlas](https://www.mongodb.com/atlas))
- [Cloudinary](https://cloudinary.com) account
- SMTP email account (e.g. Gmail App Password)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/portfolio-with-admin-panel.git
cd portfolio-with-admin-panel

# 2. Install server dependencies
cd server && npm install

# 3. Install client dependencies
cd ../client && npm install

# 4. Create server environment variables
cd ../server
cp .env.example .env
# Edit .env with your actual values

# 5. Create client environment variables
cd ../client
cp .env.example .env
# Edit .env with your API URL

# 6. Seed the admin user
cd ../server && npm run seed

# 7. Start development servers
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

### Admin Access

Navigate to `/admin/login` and use the `ADMIN_EMAIL` / `ADMIN_PASSWORD` credentials from your `server/.env` file.

## API Endpoints

| Method | Path                      | Auth      | Description            |
| ------ | ------------------------- | --------- | ---------------------- |
| POST   | `/api/auth/login`         | No        | Admin login            |
| GET    | `/api/auth/me`            | JWT       | Get current user       |
| GET    | `/api/projects`           | No        | Get published projects |
| GET    | `/api/projects/:slug`     | No        | Get project by slug    |
| GET    | `/api/projects/admin/all` | JWT+Admin | Get all projects       |
| POST   | `/api/projects`           | JWT+Admin | Create project         |
| PUT    | `/api/projects/:id`       | JWT+Admin | Update project         |
| DELETE | `/api/projects/:id`       | JWT+Admin | Delete project         |
| POST   | `/api/projects/:id/image` | JWT+Admin | Upload project image   |
| DELETE | `/api/projects/:id/image` | JWT+Admin | Delete project image   |
| GET    | `/api/skills`             | No        | Get all skills         |
| POST   | `/api/skills`             | JWT+Admin | Create skill           |
| PUT    | `/api/skills/:id`         | JWT+Admin | Update skill           |
| DELETE | `/api/skills/:id`         | JWT+Admin | Delete skill           |
| POST   | `/api/contact`            | No        | Send contact message   |
| GET    | `/api/health`             | No        | Health check           |

## Security

- **Helmet** — Secure HTTP headers
- **CORS** — Strict origin whitelist (no wildcards in production)
- **Rate Limiting** — Protects against brute-force and DDoS
- **express-mongo-sanitize** — Prevents NoSQL injection
- **hpp** — HTTP parameter pollution protection
- **bcryptjs** — Password hashing with salt rounds
- **JWT** — Stateless authentication with expiration
- **Input Validation** — express-validator on all endpoints
- **File Upload** — Type and size restrictions via Multer

## Folder Structure

```
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── api/            # Axios instance
│   │   ├── components/
│   │   │   ├── admin/      # Admin panel components
│   │   │   ├── layout/     # Navbar, Footer, Layouts
│   │   │   ├── sections/   # Hero, About, Projects, Skills, Contact
│   │   │   └── ui/         # Reusable UI components
│   │   ├── contexts/       # Auth context (React Context API)
│   │   ├── guards/         # Route guards (AdminRoute, GuestOnly)
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service functions
│   │   └── utils/          # Constants, animations
│   ├── netlify.toml        # SPA redirect & build config
│   └── vite.config.js
│
├── server/                 # Express backend
│   ├── config/             # DB connection, environment config
│   ├── controllers/        # Route handlers
│   ├── middlewares/         # Auth, error handler, rate limiter, upload
│   ├── models/             # Mongoose schemas (User, Project, Skill)
│   ├── routes/             # API route definitions
│   ├── utils/              # Cloudinary, email, helpers
│   ├── validators/         # express-validator schemas
│   ├── seed.js             # Admin user seeder
│   └── index.js            # Entry point
│
└── README.md
```

## Deployment

### MongoDB Atlas Setup

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a database user with a **strong generated password** (different from `ADMIN_PASSWORD`).
3. Network Access: add `0.0.0.0/0` to allow connections from Render.
4. Get the connection string (`mongodb+srv://...`). **Never commit it.**

### Backend — Render

1. Create a new **Web Service** on [Render](https://render.com) and connect your GitHub repository.
2. Configure the service:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** `Node`
3. Add environment variables:

| Variable           | Value                                       |
| ------------------ | ------------------------------------------- |
| `NODE_ENV`         | `production`                                |
| `MONGO_URI`        | MongoDB Atlas connection string             |
| `JWT_SECRET`       | Random 64-char hex (`openssl rand -hex 32`) |
| `JWT_EXPIRES_IN`   | `7d`                                        |
| `CLIENT_URL`       | Netlify frontend URL                        |
| `CLOUDINARY_*`     | Cloudinary credentials                      |
| `ADMIN_EMAIL`      | Admin email address                         |
| `ADMIN_PASSWORD`   | Strong password (min 8 chars)               |
| `SMTP_*`           | SMTP credentials                            |
| `CONTACT_TO_EMAIL` | Contact form recipient email                |

4. Deploy and verify: `GET https://your-app.onrender.com/api/health`.
5. Run `npm run seed` via Render Shell tab if needed.

### Frontend — Netlify

1. Create a new site on [Netlify](https://www.netlify.com) and connect your GitHub repository.
2. Configure the build:
   - **Base Directory:** `client`
   - **Build Command:** `npm run build`
   - **Publish Directory:** `client/dist`
3. Add environment variable: `VITE_API_URL` = Render URL + `/api` (e.g. `https://your-app.onrender.com/api`).
4. Deploy.

> **Note:** SPA client-side routing is handled by `client/netlify.toml` — all routes redirect to `index.html`.

### Post-Deployment

- Update `CLIENT_URL` on Render to your exact Netlify URL (no trailing slash).
- Redeploy the backend for CORS to take effect.

### Custom Domain (Optional)

- **Netlify:** Site Settings → Domain Management → Add custom domain → Configure DNS.
- **Render:** Settings → Custom Domains → Add domain (e.g. `api.yourname.dev`) → Configure DNS.
- Update `VITE_API_URL` and `CLIENT_URL` accordingly.

## Environment Variables

### Server (`server/.env`)

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

### Client (`client/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

## License

This project is licensed under the [MIT License](LICENSE).
