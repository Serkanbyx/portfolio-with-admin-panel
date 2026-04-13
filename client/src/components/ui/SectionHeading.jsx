import GradientText from "./GradientText";

const SectionHeading = ({ title, subtitle, align = "center" }) => {
  const isCenter = align === "center";

  return (
    <div className={`mb-16 ${isCenter ? "mx-auto text-center" : "text-left"}`}>
      <div
        className={`w-12 h-1 bg-primary-500 rounded-full mb-4 ${isCenter ? "mx-auto" : ""}`}
      />
      <GradientText as="h2" className="text-3xl sm:text-4xl font-bold">
        {title}
      </GradientText>
      {subtitle && (
        <p
          className={`text-dark-400 mt-4 max-w-2xl ${isCenter ? "mx-auto" : ""}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
