import { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-hot-toast";
import {
  FiSave,
  FiUser,
  FiMail,
  FiMapPin,
  FiGithub,
  FiLinkedin,
} from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";

import GlassCard from "../components/ui/GlassCard";
import Spinner from "../components/ui/Spinner";
import * as settingsService from "../services/settingsService";

const INPUT_CLASS =
  "w-full px-4 py-2.5 rounded-lg bg-dark-800 border border-dark-700 text-dark-50 placeholder-dark-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors text-sm";

const AdminSettingsPage = () => {
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await settingsService.getSettings();
      const s = res.data?.data;
      setFormData({
        name: s.name || "",
        role: s.role || "",
        greeting: s.greeting || "",
        tagline: s.tagline || "",
        location: s.location || "",
        email: s.email || "",
        profileImageUrl: s.profileImageUrl || "",
        bio: (s.bio || []).join("\n\n"),
        github: s.social?.github || "",
        linkedin: s.social?.linkedin || "",
        twitter: s.social?.twitter || "",
      });
    } catch {
      toast.error("Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData) return;

    setIsSaving(true);
    try {
      await settingsService.updateSettings({
        name: formData.name,
        role: formData.role,
        greeting: formData.greeting,
        tagline: formData.tagline,
        location: formData.location,
        email: formData.email,
        profileImageUrl: formData.profileImageUrl,
        bio: formData.bio
          .split("\n\n")
          .map((p) => p.trim())
          .filter(Boolean),
        social: {
          github: formData.github,
          linkedin: formData.linkedin,
          twitter: formData.twitter,
        },
      });
      toast.success("Settings saved");
    } catch (error) {
      toast.error(error.message || "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !formData) {
    return (
      <>
        <Helmet>
          <title>Settings | Admin</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <h1 className="text-2xl font-bold text-dark-50 mb-8">Site Settings</h1>
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Settings | Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-dark-50">Site Settings</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {/* Personal Info */}
        <GlassCard>
          <h2 className="text-sm font-semibold text-dark-300 uppercase tracking-wider mb-4">
            Personal Information
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="s-name" className="block text-sm font-medium text-dark-300 mb-1.5">
                  Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                  <input
                    id="s-name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className={`${INPUT_CLASS} pl-10`}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="s-role" className="block text-sm font-medium text-dark-300 mb-1.5">
                  Role / Title
                </label>
                <input
                  id="s-role"
                  name="role"
                  type="text"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="Full-Stack Developer"
                  className={INPUT_CLASS}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="s-email" className="block text-sm font-medium text-dark-300 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                  <input
                    id="s-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    className={`${INPUT_CLASS} pl-10`}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="s-location" className="block text-sm font-medium text-dark-300 mb-1.5">
                  Location
                </label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                  <input
                    id="s-location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Istanbul, Turkey"
                    className={`${INPUT_CLASS} pl-10`}
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="s-greeting" className="block text-sm font-medium text-dark-300 mb-1.5">
                Greeting
              </label>
              <input
                id="s-greeting"
                name="greeting"
                type="text"
                value={formData.greeting}
                onChange={handleChange}
                placeholder="Hello, I'm"
                className={INPUT_CLASS}
              />
            </div>

            <div>
              <label htmlFor="s-tagline" className="block text-sm font-medium text-dark-300 mb-1.5">
                Tagline
              </label>
              <input
                id="s-tagline"
                name="tagline"
                type="text"
                value={formData.tagline}
                onChange={handleChange}
                placeholder="I build modern web applications..."
                className={INPUT_CLASS}
              />
            </div>

            <div>
              <label htmlFor="s-profileImage" className="block text-sm font-medium text-dark-300 mb-1.5">
                Profile Image URL
              </label>
              <input
                id="s-profileImage"
                name="profileImageUrl"
                type="url"
                value={formData.profileImageUrl}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
                className={INPUT_CLASS}
              />
            </div>
          </div>
        </GlassCard>

        {/* Bio */}
        <GlassCard>
          <h2 className="text-sm font-semibold text-dark-300 uppercase tracking-wider mb-4">
            About / Bio
          </h2>
          <div>
            <label htmlFor="s-bio" className="block text-sm font-medium text-dark-300 mb-1.5">
              Bio Paragraphs
              <span className="text-dark-500 font-normal ml-1">(separate paragraphs with a blank line)</span>
            </label>
            <textarea
              id="s-bio"
              name="bio"
              rows={8}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Write about yourself..."
              className={`${INPUT_CLASS} resize-none`}
            />
          </div>
        </GlassCard>

        {/* Social Links */}
        <GlassCard>
          <h2 className="text-sm font-semibold text-dark-300 uppercase tracking-wider mb-4">
            Social Links
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="s-github" className="block text-sm font-medium text-dark-300 mb-1.5">
                GitHub
              </label>
              <div className="relative">
                <FiGithub className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <input
                  id="s-github"
                  name="github"
                  type="url"
                  value={formData.github}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                  className={`${INPUT_CLASS} pl-10`}
                />
              </div>
            </div>
            <div>
              <label htmlFor="s-linkedin" className="block text-sm font-medium text-dark-300 mb-1.5">
                LinkedIn
              </label>
              <div className="relative">
                <FiLinkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <input
                  id="s-linkedin"
                  name="linkedin"
                  type="url"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                  className={`${INPUT_CLASS} pl-10`}
                />
              </div>
            </div>
            <div>
              <label htmlFor="s-twitter" className="block text-sm font-medium text-dark-300 mb-1.5">
                X (Twitter)
              </label>
              <div className="relative">
                <FaXTwitter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <input
                  id="s-twitter"
                  name="twitter"
                  type="url"
                  value={formData.twitter}
                  onChange={handleChange}
                  placeholder="https://x.com/username"
                  className={`${INPUT_CLASS} pl-10`}
                />
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            {isSaving ? <Spinner size="sm" /> : <FiSave className="w-4 h-4" />}
            Save Settings
          </button>
        </div>
      </form>
    </>
  );
};

export default AdminSettingsPage;
