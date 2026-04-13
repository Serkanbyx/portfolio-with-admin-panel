const SectionWrapper = ({ id, className = "", children }) => {
  return (
    <section
      id={id}
      className={`py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${className}`}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {children}
      </div>
    </section>
  );
};

export default SectionWrapper;
