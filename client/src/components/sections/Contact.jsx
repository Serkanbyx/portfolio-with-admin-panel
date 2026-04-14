import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  FiMail,
  FiMapPin,
  FiCheckCircle,
  FiSend,
  FiGithub,
  FiLinkedin,
  FiAlertCircle,
} from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";
import { toast } from "react-hot-toast";

import SectionWrapper from "../ui/SectionWrapper";
import SectionHeading from "../ui/SectionHeading";
import GlassCard from "../ui/GlassCard";
import Spinner from "../ui/Spinner";
import { SOCIAL_LINKS } from "../../utils/constants";
import {
  scaleIn,
  fadeInLeft,
  fadeInRight,
  fadeInUp,
  staggerContainer,
} from "../../utils/animations";
import * as contactService from "../../services/contactService";
import siteConfig from "../../config/siteConfig";

const SOCIAL_ICON_MAP = {
  FiGithub,
  FiLinkedin,
  FaXTwitter,
};

const CONTACT_INFO = [
  {
    icon: FiMail,
    label: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
    type: "link",
  },
  {
    icon: FiMapPin,
    label: siteConfig.location,
    type: "text",
  },
  {
    icon: FiCheckCircle,
    label: siteConfig.availabilityText,
    type: "availability",
  },
];

const INITIAL_FORM_DATA = { name: "", email: "", message: "" };
const INITIAL_ERRORS = { name: "", email: "", message: "" };
const INITIAL_TOUCHED = { name: false, email: false, message: false };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MESSAGE_MAX = 1000;

const INPUT_BASE_CLASSES =
  "w-full bg-dark-800/50 border rounded-xl px-4 py-3 text-dark-100 placeholder:text-dark-500 focus:ring-1 focus:outline-none transition-all duration-200";

const getInputStateClasses = (fieldName, errors, touched, formData) => {
  if (touched[fieldName] && errors[fieldName]) {
    return "border-error-500 focus:border-error-500 focus:ring-error-500/50";
  }
  const hasAllErrors = Object.values(errors).every((e) => e === "");
  if (touched[fieldName] && !errors[fieldName] && formData[fieldName]?.trim() && hasAllErrors) {
    return "border-success-500/50 focus:border-primary-500 focus:ring-primary-500/50";
  }
  return "border-dark-700 focus:border-primary-500 focus:ring-primary-500/50";
};

const validateField = (name, value) => {
  switch (name) {
    case "name":
      if (!value.trim()) return "Name is required";
      if (value.trim().length < 2) return "Name must be at least 2 characters";
      return "";
    case "email":
      if (!value.trim()) return "Email is required";
      if (!EMAIL_REGEX.test(value)) return "Please enter a valid email";
      return "";
    case "message":
      if (!value.trim()) return "Message is required";
      if (value.trim().length < 10)
        return "Message must be at least 10 characters";
      return "";
    default:
      return "";
  }
};

const errorAnimation = {
  hidden: { opacity: 0, height: 0, y: -4 },
  visible: {
    opacity: 1,
    height: "auto",
    y: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    height: 0,
    y: -4,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

const getCharCountColor = (length) => {
  if (length >= MESSAGE_MAX) return "text-error-500";
  if (length >= 900) return "text-warning-500";
  return "text-dark-500";
};

const Contact = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [touched, setTouched] = useState(INITIAL_TOUCHED);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const isLeftInView = useInView(leftRef, { once: true, margin: "-80px" });
  const isRightInView = useInView(rightRef, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!isSuccess) return;
    const timer = setTimeout(() => resetForm(), 5000);
    return () => clearTimeout(timer);
  }, [isSuccess]);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      if (name === "message" && value.length > MESSAGE_MAX) return;

      setFormData((prev) => ({ ...prev, [name]: value }));
      setSubmitError("");

      if (touched[name]) {
        setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
      }
    },
    [touched],
  );

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  }, []);

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setErrors(INITIAL_ERRORS);
    setTouched(INITIAL_TOUCHED);
    setIsSuccess(false);
    setSubmitError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allTouched = { name: true, email: true, message: true };
    setTouched(allTouched);

    const newErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      message: validateField("message", formData.message),
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err !== "")) return;

    setIsSubmitting(true);
    setSubmitError("");
    try {
      await contactService.sendMessage(formData);
      setIsSuccess(true);
      toast.success("Message sent successfully!");
    } catch (error) {
      const errorMessage =
        error.message || "Failed to send message. Please try again.";
      setSubmitError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SectionWrapper id="contact">
      <SectionHeading
        title="Get In Touch"
        subtitle="Have a project in mind? Let's talk about it."
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Left Column — Contact Info */}
        <motion.div
          ref={leftRef}
          variants={fadeInLeft}
          initial="hidden"
          animate={isLeftInView ? "visible" : "hidden"}
          className="lg:col-span-2"
        >
          <p className="text-dark-300 leading-relaxed mb-8">
            I&apos;m always open to new opportunities, collaborations, and
            interesting projects. Feel free to reach out!
          </p>

          <div className="space-y-4">
            {CONTACT_INFO.map((item) => (
              <GlassCard key={item.label} padding="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary-500/10 text-primary-400 flex items-center justify-center">
                    <item.icon className="w-5 h-5" />
                  </div>

                  {item.type === "link" ? (
                    <a
                      href={item.href}
                      className="text-dark-300 hover:text-primary-400 transition-colors link-hover"
                    >
                      {item.label}
                    </a>
                  ) : item.type === "availability" ? (
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                      </span>
                      <span className="text-dark-300">{item.label}</span>
                    </div>
                  ) : (
                    <span className="text-dark-300">{item.label}</span>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Social Links */}
          <div className="mt-8">
            <p className="text-dark-500 text-sm mb-3">Find me on</p>
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
                    <Icon className="w-6 h-6" />
                  </a>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Right Column — Contact Form */}
        <motion.div
          ref={rightRef}
          variants={fadeInRight}
          initial="hidden"
          animate={isRightInView ? "visible" : "hidden"}
          className="lg:col-span-3"
        >
          <GlassCard padding="p-8">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <SuccessMessage onReset={resetForm} />
              ) : (
                <ContactForm
                  formData={formData}
                  errors={errors}
                  touched={touched}
                  isSubmitting={isSubmitting}
                  submitError={submitError}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onSubmit={handleSubmit}
                />
              )}
            </AnimatePresence>
          </GlassCard>
        </motion.div>
      </div>
    </SectionWrapper>
  );
};

const ContactForm = ({
  formData,
  errors,
  touched,
  isSubmitting,
  submitError,
  onChange,
  onBlur,
  onSubmit,
}) => (
  <motion.form
    key="contact-form"
    variants={staggerContainer(0.08)}
    initial="hidden"
    animate="visible"
    exit={{ opacity: 0 }}
    onSubmit={onSubmit}
    noValidate
    className="space-y-6"
  >
    {/* Name */}
    <motion.div variants={fadeInUp}>
      <FormField
        label="Your Name"
        name="name"
        type="text"
        placeholder="John Doe"
        value={formData.name}
        error={errors.name}
        isTouched={touched.name}
        disabled={isSubmitting}
        onChange={onChange}
        onBlur={onBlur}
        errors={errors}
        touched={touched}
        formData={formData}
      />
    </motion.div>

    {/* Email */}
    <motion.div variants={fadeInUp}>
      <FormField
        label="Your Email"
        name="email"
        type="email"
        placeholder="john@example.com"
        value={formData.email}
        error={errors.email}
        isTouched={touched.email}
        disabled={isSubmitting}
        onChange={onChange}
        onBlur={onBlur}
        errors={errors}
        touched={touched}
        formData={formData}
      />
    </motion.div>

    {/* Message */}
    <motion.div variants={fadeInUp}>
      <label htmlFor="message" className="text-sm font-medium text-dark-300 mb-2 block">
        Your Message
      </label>
      <textarea
        id="message"
        name="message"
        rows={5}
        placeholder="Tell me about your project..."
        value={formData.message}
        disabled={isSubmitting}
        onChange={onChange}
        onBlur={onBlur}
        className={`${INPUT_BASE_CLASSES} ${getInputStateClasses("message", errors, touched, formData)} resize-y`}
      />
      <div className="flex justify-between items-center mt-1">
        <InlineError show={touched.message && errors.message} message={errors.message} />
        <span className={`text-xs ${getCharCountColor(formData.message.length)}`}>
          {formData.message.length}/{MESSAGE_MAX}
        </span>
      </div>
    </motion.div>

    {/* Submit Error */}
    <AnimatePresence>
      {submitError && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="flex items-center gap-2 bg-error-500/10 border border-error-500/20 text-error-500 text-sm px-4 py-3 rounded-xl"
        >
          <FiAlertCircle className="w-4 h-4 shrink-0" />
          <span>{submitError}</span>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Submit */}
    <motion.div variants={fadeInUp}>
      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className="w-full bg-primary-600 hover:bg-primary-500 text-white py-3.5 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Spinner size="sm" />
            <span>Sending...</span>
          </>
        ) : (
          <>
            <FiSend className="w-4 h-4" />
            <span>Send Message</span>
          </>
        )}
      </motion.button>
    </motion.div>
  </motion.form>
);

const FormField = ({
  label,
  name,
  type,
  placeholder,
  value,
  disabled,
  onChange,
  onBlur,
  errors,
  touched,
  formData,
}) => (
  <div>
    <label htmlFor={name} className="text-sm font-medium text-dark-300 mb-2 block">
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      disabled={disabled}
      onChange={onChange}
      onBlur={onBlur}
      className={`${INPUT_BASE_CLASSES} ${getInputStateClasses(name, errors, touched, formData)}`}
    />
    <InlineError show={touched[name] && errors[name]} message={errors[name]} />
  </div>
);

const InlineError = ({ show, message }) => (
  <AnimatePresence>
    {show && (
      <motion.p
        variants={errorAnimation}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="text-error-500 text-xs mt-1"
      >
        {message}
      </motion.p>
    )}
  </AnimatePresence>
);

const SuccessMessage = ({ onReset }) => (
  <motion.div
    key="success-message"
    initial="hidden"
    animate="visible"
    exit={{ opacity: 0 }}
    className="flex flex-col items-center justify-center py-12 text-center"
  >
    <motion.div
      variants={scaleIn}
      className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-6"
    >
      <FiCheckCircle className="w-8 h-8 text-green-500" />
    </motion.div>

    <h3 className="text-2xl font-bold text-dark-100 mb-2">Message Sent!</h3>
    <p className="text-dark-400 mb-8">
      Thank you for reaching out. I&apos;ll get back to you soon.
    </p>

    <motion.button
      type="button"
      onClick={onReset}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
    >
      Send Another
    </motion.button>
  </motion.div>
);

export default Contact;
