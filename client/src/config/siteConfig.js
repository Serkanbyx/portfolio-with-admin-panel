/**
 * Central site configuration — edit this file to personalize your portfolio.
 * Every placeholder across the entire app reads from here.
 */

const siteConfig = {
  /* ── Personal ─────────────────────────────────────────── */
  name: "Your Name",
  role: "Full-Stack Developer",
  greeting: "Hello, I'm",
  tagline:
    "I build modern web applications with clean code and great user experiences.",
  location: "Istanbul, Turkey",
  email: "your.email@example.com",
  availabilityText: "Available for freelance",

  /* ── Profile Image ────────────────────────────────────── */
  // Replace with your real photo URL (e.g. Cloudinary, GitHub avatar, etc.)
  // Set to "" or null to show the initials fallback.
  profileImageUrl: "",

  /* ── Social Links ─────────────────────────────────────── */
  social: {
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    twitter: "https://x.com/yourusername",
  },

  /* ── Site / SEO ───────────────────────────────────────── */
  siteUrl: "https://yourdomain.com",
  ogImage: "/og-image.png",
  titleTemplate: "{name} | {role} Portfolio",
  metaDescription:
    "Full-stack developer portfolio showcasing modern web projects built with React, Node.js, MongoDB, and more. Open to new opportunities.",

  /* ── About Section ────────────────────────────────────── */
  bio: [
    "I'm a passionate full-stack developer who thrives on turning complex ideas into elegant, user-friendly digital experiences. Driven by curiosity and a love for problem-solving, I constantly push the boundaries of what's possible on the web.",
    "My technical focus revolves around the modern JavaScript ecosystem — React, Node.js, MongoDB, and TypeScript form my core stack. I believe in writing clean, maintainable code and building scalable architectures that stand the test of time.",
    "I'm always open to exciting new opportunities and collaborations. Whether it's a groundbreaking startup idea or an enterprise-level project, I bring dedication, creativity, and a relentless pursuit of quality to every line of code.",
  ],
  techStack: "React • Node.js • MongoDB • TypeScript",
  stats: [
    { target: 10, suffix: "+", label: "Projects Completed" },
    { target: 15, suffix: "+", label: "Technologies" },
    { target: 3, suffix: "+", label: "Years Experience" },
    { target: 100, suffix: "%", label: "Passion" },
  ],
};

/* ── Derived helpers (do not edit) ─────────────────────── */

export const getFullTitle = () =>
  siteConfig.titleTemplate
    .replace("{name}", siteConfig.name)
    .replace("{role}", siteConfig.role);

export const getOgImageUrl = () => {
  if (siteConfig.ogImage.startsWith("http")) return siteConfig.ogImage;
  return `${siteConfig.siteUrl}${siteConfig.ogImage}`;
};

export const getInitials = () =>
  siteConfig.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export default siteConfig;
