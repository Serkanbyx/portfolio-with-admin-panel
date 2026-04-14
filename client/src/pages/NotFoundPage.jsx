import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { FiHome, FiArrowLeft } from "react-icons/fi";

import GradientText from "../components/ui/GradientText";
import { scaleIn } from "../utils/animations";

const floatingAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>404 — Page Not Found</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background gradient orb */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* 404 Text */}
          <motion.div animate={floatingAnimation}>
            <GradientText as="h1" className="text-8xl sm:text-9xl font-bold">
              404
            </GradientText>
          </motion.div>

          {/* Decorative line */}
          <div className="w-12 h-1 bg-primary-500 rounded-full mx-auto my-6" />

          {/* Heading */}
          <h2 className="text-2xl font-semibold text-dark-100">
            Page Not Found
          </h2>

          {/* Description */}
          <p className="text-dark-400 mt-3 max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-medium text-sm px-6 py-3 rounded-xl transition-colors"
            >
              <FiHome className="w-4 h-4" />
              Go Home
            </Link>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 border border-dark-600 hover:border-dark-400 text-dark-200 font-medium text-sm px-6 py-3 rounded-xl transition-colors"
            >
              <FiArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default NotFoundPage;
