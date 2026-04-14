import { Helmet } from "react-helmet-async";
import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import Projects from "../components/sections/Projects";
import Skills from "../components/sections/Skills";
import Contact from "../components/sections/Contact";
import siteConfig, { getFullTitle, getOgImageUrl } from "../config/siteConfig";

const HomePage = () => {
  const fullTitle = getFullTitle();
  const ogImageUrl = getOgImageUrl();

  return (
    <>
      <Helmet>
        <title>{fullTitle}</title>
        <meta name="description" content={siteConfig.metaDescription} />
        <meta property="og:title" content={fullTitle} />
        <meta
          property="og:description"
          content={siteConfig.metaDescription}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteConfig.siteUrl} />
        <meta property="og:image" content={ogImageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={siteConfig.metaDescription} />
        <meta name="twitter:image" content={ogImageUrl} />
        <link rel="canonical" href={siteConfig.siteUrl} />
      </Helmet>

      <Hero />
      <About />
      <Projects />
      <Skills />
      <Contact />
    </>
  );
};

export default HomePage;
