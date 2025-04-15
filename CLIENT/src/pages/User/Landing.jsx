import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Categories from "../../components/ui/Categories";
import FeaturedCampaign from "../../components/ui/FeaturedCampaign";
import Footer from "../../components/layout/Footer";
import Hero from "../../components/ui/Hero";
import Navbar from "../../components/layout/user/Navbar";
import AutoMovingCards from "../../components/ui/AutoMovingCards";

// Existing category animation variants
const categoryVariants = {
  initial: { opacity: 0, y: 50 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.1,
    },
  },
};

const featuredCampaignVariants = {
  initial: { opacity: 0, y: 50 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      staggerChildren: 0.15,
    },
  },
};

const Landing = () => {
  const categoriesRef = useRef(null);
  const campaignsRef = useRef(null);
  const storiesRef = useRef(null);

  const isCategoriesInView = useInView(categoriesRef, {
    once: true,
    amount: 0.35,
  });

  const isCampaignsInView = useInView(campaignsRef, {
    once: true,
    amount: 0.35,
  });

  const isStoriesInView = useInView(storiesRef, {
    once: true,
    amount: 0.35,
  });

  return (
    <div className="relative min-h-screen bg-gray-50">
      <Navbar />
      <div className="m-2">
        <Hero />
      </div>

      <div className="container mx-auto px-6 md:px-14 lg:px-20 ">
        {/* Categories Section */}
        <motion.div
          ref={categoriesRef}
          initial="initial"
          animate={isCategoriesInView ? "animate" : "initial"}
          variants={staggerContainer}
          className="py-8"
        >
          {/* Enhanced "Discover Causes" heading */}
          <motion.h1
            className="font-bold text-3xl sm:text-4xl mb-6 md:mb-8"
            variants={textVariants}
            initial="hidden"
            animate={isCategoriesInView ? "visible" : "visible"}
          >
            {["Discover", "Categories"].map((word, index) => (
              <motion.span
                key={index}
                className="inline-block mr-2 last:mr-0"
                variants={textVariants}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          {/* Category cards with reduced spacing */}
          <div className="flex justify-center py-4 md:py-6 md:justify-start flex-wrap gap-6 md:gap-8">
            <motion.div variants={categoryVariants}>
              <Categories
                img="https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg"
                title="Education"
              />
            </motion.div>
            <motion.div variants={categoryVariants}>
              <Categories
                img="https://images.pexels.com/photos/208512/pexels-photo-208512.jpeg"
                title="Medical"
              />
            </motion.div>
            <motion.div variants={categoryVariants}>
              <Categories
                img="https://images.pexels.com/photos/31115077/pexels-photo-31115077.jpeg"
                title="Individual"
              />
            </motion.div>
            <motion.div variants={categoryVariants}>
              <Categories
                img="https://images.pexels.com/photos/2917381/pexels-photo-2917381.jpeg"
                title="Religious"
              />
            </motion.div>
            <motion.div variants={categoryVariants}>
              <Categories
                img="https://images.pexels.com/photos/208512/pexels-photo-208512.jpeg"
                title="Other"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Featured Campaigns Section */}
        <motion.div
          ref={campaignsRef}
          initial="initial"
          animate={isCampaignsInView ? "animate" : "initial"}
          variants={staggerContainer}
          className="py-6 md:py-8"
        >
          {/* Enhanced "Spotlight Initiatives" heading */}
          <motion.h1
            className="font-bold text-3xl sm:text-4xl mb-6 md:mb-8"
            variants={textVariants}
            initial="hidden"
            animate={isCampaignsInView ? "visible" : "hidden"}
          >
            {["Spotlight", "Initiatives"].map((word, index) => (
              <motion.span
                key={index}
                className="inline-block mr-2 last:mr-0"
                variants={textVariants}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          <div className="flex flex-col gap-8 md:gap-10">
            <motion.div variants={featuredCampaignVariants}>
              <FeaturedCampaign />
            </motion.div>
            <motion.div variants={featuredCampaignVariants}>
              <FeaturedCampaign />
            </motion.div>
          </div>
        </motion.div>

        {/* User Stories Section */}
        <motion.div
          ref={storiesRef}
          initial="hidden"
          animate={isStoriesInView ? "visible" : "hidden"}
          variants={textVariants}
          className="py-6 md:py-8"
        >
          {/* Enhanced "Impact Chronicles" heading */}
          <motion.h1
            className="font-bold text-3xl sm:text-4xl mb-6 md:mb-8"
            variants={textVariants}
            initial="hidden"
            animate={isStoriesInView ? "visible" : "hidden"}
          >
            {["Impact", "Chronicles"].map((word, index) => (
              <motion.span
                key={index}
                className="inline-block mr-2 last:mr-0"
                variants={textVariants}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          <AutoMovingCards />
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Landing;
