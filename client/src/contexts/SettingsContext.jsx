import { createContext, useContext, useState, useEffect, useMemo } from "react";
import siteConfig from "../config/siteConfig";
import * as settingsService from "../services/settingsService";

const SettingsContext = createContext(null);

const SOCIAL_ICON_MAP = {
  github: "FiGithub",
  linkedin: "FiLinkedin",
  twitter: "FaXTwitter",
};

const SOCIAL_LABEL_MAP = {
  github: "GitHub",
  linkedin: "LinkedIn",
  twitter: "X",
};

export const SettingsProvider = ({ children }) => {
  const [apiSettings, setApiSettings] = useState(null);

  useEffect(() => {
    settingsService
      .getSettings()
      .then((res) => setApiSettings(res.data?.data || null))
      .catch(() => {});
  }, []);

  const settings = useMemo(() => {
    const base = { ...siteConfig };

    if (!apiSettings) return base;

    // Only customized (non-empty) admin values override the siteConfig
    // defaults; empty fields fall back to siteConfig.
    const SCALAR_FIELDS = [
      "name",
      "role",
      "greeting",
      "tagline",
      "location",
      "email",
      "profileImageUrl",
    ];

    for (const field of SCALAR_FIELDS) {
      if (apiSettings[field]) base[field] = apiSettings[field];
    }

    if (apiSettings.bio?.length > 0) {
      base.bio = apiSettings.bio;
    }

    if (apiSettings.social) {
      const apiSocial = Object.fromEntries(
        Object.entries(apiSettings.social).filter(([, value]) => value)
      );
      if (Object.keys(apiSocial).length > 0) {
        base.social = { ...base.social, ...apiSocial };
      }
    }

    return base;
  }, [apiSettings]);

  const socialLinks = useMemo(
    () =>
      Object.entries(settings.social)
        .filter(([, href]) => href)
        .map(([key, href]) => ({
          label: SOCIAL_LABEL_MAP[key] || key,
          href,
          icon: SOCIAL_ICON_MAP[key] || "FiGithub",
        })),
    [settings.social]
  );

  const initials = useMemo(
    () =>
      settings.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
    [settings.name]
  );

  const value = useMemo(
    () => ({ settings, socialLinks, initials }),
    [settings, socialLinks, initials]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
