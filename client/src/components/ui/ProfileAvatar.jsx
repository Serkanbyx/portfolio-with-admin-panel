import { useState } from "react";
import { useSettings } from "../../contexts/SettingsContext";

const ProfileAvatar = ({ className = "" }) => {
  const { settings, initials } = useSettings();
  const [hasError, setHasError] = useState(false);
  const showFallback = !settings.profileImageUrl || hasError;

  if (showFallback) {
    return (
      <div
        className={`flex items-center justify-center bg-primary-600 select-none ${className}`}
        role="img"
        aria-label={`${settings.name} profile`}
      >
        <span className="text-white font-bold text-7xl sm:text-8xl lg:text-9xl leading-none">
          {initials}
        </span>
      </div>
    );
  }

  return (
    <img
      src={settings.profileImageUrl}
      alt={`${settings.name} profile`}
      className={className}
      onError={() => setHasError(true)}
    />
  );
};

export default ProfileAvatar;
