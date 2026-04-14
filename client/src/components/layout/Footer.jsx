import { FiGithub, FiLinkedin } from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";
import { SOCIAL_LINKS } from "../../utils/constants";
import siteConfig from "../../config/siteConfig";

const SOCIAL_ICON_MAP = {
  FiGithub: FiGithub,
  FiLinkedin: FiLinkedin,
  FaXTwitter: FaXTwitter,
};

const Footer = () => {
  return (
    <footer className="relative bg-dark-900/50 border-t border-dark-800">
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary-500/20 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center gap-4">
          {/* Social Links */}
          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map((social) => {
              const Icon = SOCIAL_ICON_MAP[social.icon];
              if (!Icon) return null;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg p-2 transition-colors duration-200"
                  aria-label={`Visit ${social.label} profile`}
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>

          {/* Copyright */}
          <p className="text-dark-500 text-sm">
            &copy; {new Date().getFullYear()} {siteConfig.name}. Built with React
            &amp; Node.js
          </p>

          {/* Signature */}
          <p className="text-dark-500 text-sm">
            Created by{" "}
            <a
              href="https://serkanbayraktar.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300 transition-colors duration-200"
            >
              Serkanby
            </a>
            {" | "}
            <a
              href="https://github.com/Serkanbyx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300 transition-colors duration-200"
            >
              Github
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
