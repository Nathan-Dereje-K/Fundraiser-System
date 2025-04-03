import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Categories from "../../components/ui/Categories";
import FeaturedCampaign from "../../components/ui/FeaturedCampaign";
import Footer from "../../components/layout/Footer";
import Hero from "../../components/ui/Hero";
import Navbar from "../../components/layout/user/Navbar";

const categoryVariants = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.3, delayChildren: 0.2 },
  },
};

const featuredCampaignVariants = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const Landing = () => {
  // Refs for detecting visibility
  const categoriesRef = useRef(null);
  const campaignsRef = useRef(null);

  // Use useInView to detect when sections are in view (35% threshold)
  const isCategoriesInView = useInView(categoriesRef, {
    once: true,
    amount: 0.35,
  });
  const isCampaignsInView = useInView(campaignsRef, {
    once: true,
    amount: 0.35,
  });

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto px-6 md:px-14 lg:px-20 py-10">
        {/* Hero Section */}
        <Hero />

        {/* Categories Section */}
        <motion.div
          ref={categoriesRef} // Attach the ref to trigger animation on view
          initial="initial"
          animate={isCategoriesInView ? "animate" : "initial"}
          variants={staggerContainer}
          className="py-12"
        >
          <h1 className="font-bold text-3xl sm:text-4xl text-center md:text-left mb-8">
            Explore Categories
          </h1>
          <div className="flex justify-center md:justify-start flex-wrap gap-8">
            <motion.div variants={categoryVariants}>
              <Categories
                img="https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                title="Education"
              />
            </motion.div>
            <motion.div variants={categoryVariants}>
              <Categories
                img="https://images.pexels.com/photos/208512/pexels-photo-208512.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                title="Medical"
              />
            </motion.div>
            <motion.div variants={categoryVariants}>
              <Categories
                img="https://images.pexels.com/photos/31115077/pexels-photo-31115077/free-photo-of-stylish-young-man-in-modern-cafe-interior.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                title="Individual"
              />
            </motion.div>
            <motion.div variants={categoryVariants}>
              <Categories
                img="https://images.pexels.com/photos/2917381/pexels-photo-2917381.jpeg?auto=compress&cs=tinysrgb&w=600"
                title="Religious"
              />
            </motion.div>
            <motion.div variants={categoryVariants}>
              <Categories
                img="https://images.pexels.com/photos/208512/pexels-photo-208512.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                title="Other"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Featured Campaigns Section */}
        <motion.div
          ref={campaignsRef} // Attach the ref to trigger animation on view
          initial="initial"
          animate={isCampaignsInView ? "animate" : "initial"}
          variants={staggerContainer}
          className="py-12"
        >
          <h1 className="font-bold text-3xl sm:text-4xl text-center md:text-left mb-8">
            Featured Campaigns
          </h1>
          <div className="flex flex-col gap-10">
            <motion.div variants={featuredCampaignVariants}>
              <FeaturedCampaign />
            </motion.div>
            <motion.div variants={featuredCampaignVariants}>
              <FeaturedCampaign />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Landing;
