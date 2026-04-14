import { useState } from "react";
import siteConfig, { getInitials } from "../../config/siteConfig";

const ProfileAvatar = ({ className = "" }) => {
  const [hasError, setHasError] = useState(false);
  const showFallback = !siteConfig.profileImageUrl || hasError;

  if (showFallback) {
    return (
      <div
        className={`flex items-center justify-center bg-primary-600 select-none ${className}`}
        role="img"
        aria-label={`${siteConfig.name} profile`}
      >
        <span className="text-white font-bold text-7xl sm:text-8xl lg:text-9xl leading-none">
          {getInitials()}
        </span>
      </div>
    );
  }

  return (
    <img
      src={siteConfig.profileImageUrl}
      alt={`${siteConfig.name} profile`}
      className={className}
      onError={() => setHasError(true)}
    />
  );
};

export default ProfileAvatar;
