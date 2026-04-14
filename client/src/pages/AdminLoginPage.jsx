import { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiShield,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiArrowLeft,
} from "react-icons/fi";

import GlassCard from "../components/ui/GlassCard";
import GradientText from "../components/ui/GradientText";
import Spinner from "../components/ui/Spinner";
import { useAuth } from "../contexts/AuthContext";
import { scaleIn, fadeInDown } from "../utils/animations";
import siteConfig from "../config/siteConfig";

const INPUT_CLASSES =
  "w-full bg-dark-800/50 border border-dark-700 rounded-xl pl-11 pr-4 py-3 text-dark-100 placeholder:text-dark-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 focus:outline-none transition-all duration-200";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const clearError = useCallback(() => {
    if (error) setError("");
  }, [error]);

  const handleEmailChange = useCallback(
    (e) => {
      setEmail(e.target.value);
      clearError();
    },
    [clearError]
  );

  const handlePasswordChange = useCallback(
    (e) => {
      setPassword(e.target.value);
      clearError();
    },
    [clearError]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!email.trim() || !password.trim()) {
        setError("Please fill in all fields");
        return;
      }

      setIsSubmitting(true);
      setError("");

      try {
        await login(email, password);
        navigate("/admin", { replace: true });
      } catch (err) {
        setError(err.message || "Invalid email or password");
      } finally {
        setIsSubmitting(false);
      }
    },
    [email, password, login, navigate]
  );

  return (
    <>
      <Helmet>
        <title>{`Admin Login | ${siteConfig.name}`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background gradient orb */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          className="max-w-md w-full mx-auto"
        >
          <GlassCard padding="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <FiShield className="text-primary-400 text-3xl" />
              </div>
              <GradientText as="h1" className="text-2xl font-bold">
                Admin Login
              </GradientText>
              <p className="text-dark-400 text-sm mt-2">
                Sign in to manage your portfolio
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-dark-300 text-sm font-medium mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="admin@example.com"
                    disabled={isSubmitting}
                    autoComplete="email"
                    className={INPUT_CLASSES}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-dark-300 text-sm font-medium mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    disabled={isSubmitting}
                    autoComplete="current-password"
                    className={`${INPUT_CLASSES} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              {/* Error Display */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    variants={fadeInDown}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="bg-error-500/10 border border-error-500/20 text-error-500 rounded-xl p-3 text-sm text-center"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-xl transition-all duration-200"
              >
                {isSubmitting ? (
                  <Spinner size="sm" />
                ) : (
                  <>
                    Sign In
                    <FiArrowRight />
                  </>
                )}
              </button>
            </form>
          </GlassCard>

          {/* Back Link */}
          <div className="text-center mt-6">
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-dark-400 hover:text-primary-400 text-sm transition-colors duration-200"
            >
              <FiArrowLeft className="text-xs" />
              Back to Portfolio
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AdminLoginPage;
