import { useState } from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiShield,
  FiHome,
  FiFolder,
  FiCode,
  FiMessageSquare,
  FiSettings,
  FiExternalLink,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import GradientText from "../ui/GradientText";

const NAV_LINKS = [
  { to: "/admin", label: "Dashboard", icon: FiHome, end: true },
  { to: "/admin/projects", label: "Projects", icon: FiFolder },
  { to: "/admin/skills", label: "Skills", icon: FiCode },
  { to: "/admin/messages", label: "Messages", icon: FiMessageSquare },
  { to: "/admin/settings", label: "Settings", icon: FiSettings },
];

const navLinkClasses = ({ isActive }) =>
  `flex items-center gap-3 py-3 px-4 rounded-lg transition-colors ${
    isActive
      ? "bg-primary-500/10 text-primary-400 border-l-2 border-primary-500"
      : "text-dark-400 hover:text-dark-100 hover:bg-dark-800/50"
  }`;

const SidebarContent = ({ onClose }) => {
  const { logout } = useAuth();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FiShield className="text-primary-400 text-xl" />
          <GradientText as="h2" className="text-lg font-bold">
            Admin Panel
          </GradientText>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden text-dark-400 hover:text-dark-100 transition-colors"
            aria-label="Close menu"
          >
            <FiX size={22} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {NAV_LINKS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={navLinkClasses}
            onClick={onClose}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-dark-800 space-y-1">
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 py-3 px-4 rounded-lg text-dark-400 hover:text-dark-100 hover:bg-dark-800/50 transition-colors"
        >
          <FiExternalLink size={18} />
          <span>View Portfolio</span>
        </Link>

        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-3 py-3 px-4 rounded-lg text-dark-400 hover:text-red-400 hover:bg-dark-800/50 transition-colors w-full"
        >
          <FiLogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

const AdminLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const closeMobile = () => setIsMobileOpen(false);

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col bg-dark-900 border-r border-dark-800 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center gap-3 p-4 bg-dark-900 border-b border-dark-800 sticky top-0 z-20">
        <button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          className="text-dark-400 hover:text-dark-100 transition-colors"
          aria-label="Open menu"
        >
          <FiMenu size={22} />
        </button>
        <GradientText as="span" className="font-bold">
          Admin Panel
        </GradientText>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={closeMobile}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-dark-900 border-r border-dark-800 z-50 lg:hidden"
            >
              <SidebarContent onClose={closeMobile} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Content Area */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
