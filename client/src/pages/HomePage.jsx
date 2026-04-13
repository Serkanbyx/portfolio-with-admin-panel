import { Helmet } from "react-helmet-async";
import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import Contact from "../components/sections/Contact";

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Your Name | Full-Stack Developer Portfolio</title>
        <meta
          name="description"
          content="Full-stack developer portfolio showcasing modern web projects built with React, Node.js, MongoDB, and more. Open to new opportunities."
        />
        <meta property="og:title" content="Your Name | Full-Stack Developer" />
        <meta
          property="og:description"
          content="Full-stack developer portfolio showcasing modern web projects."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com" />
        <meta
          property="og:image"
          content="https://yourdomain.com/og-image.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://yourdomain.com" />
      </Helmet>

      <Hero />
      <About />
      <Contact />
    </>
  );
};

export default HomePage;
