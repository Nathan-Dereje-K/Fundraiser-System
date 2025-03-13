import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import Categories from "../components/Categories";
import FeaturedCampaign from "../components/FeaturedCampaign";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";

const categoryVariants = {
  initial: { opacity: 0, y: 100 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.4, delayChildren: 0.3 },
  },
};

const featuredCampaignVariants = {
  initial: { opacity: 0, y: 100 },
  animate: { opacity: 1, y: 0 },
};

const Home = () => {
  const controls = useAnimation();
  const [inView, setInView] = useState(false);

  const checkInView = () => {
    const campaignElement = document.getElementById("featured-campaign");
    const rect = campaignElement.getBoundingClientRect();
    if (rect.top <= window.innerHeight && rect.bottom >= 0) {
      setInView(true);
    } else {
      setInView(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", checkInView);
    checkInView(); // Check if it's in view on initial load

    return () => {
      window.removeEventListener("scroll", checkInView);
    };
  }, []);

  useEffect(() => {
    if (inView) {
      controls.start("animate");
    } else {
      controls.start("initial");
    }
  }, [inView, controls]);

  return (
    <>
      <div>
        <Navbar />
        <div className="ml-6 mr-6 md:mr-14 md:ml-14 lg:mr-20 lg:ml-20 mb-10">
          <Hero />

          {/* Categories with Staggered Animation */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="py-7"
          >
            <h1 className="font-bold text-3xl">Categories</h1>
            <div className="flex justify-center md:justify-start flex-wrap py-7 gap-9">
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
            </div>
          </motion.div>

          {/* Featured Campaigns with Staggered Animation */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <h1 className="font-bold py-12 text-3xl">Featured Campaigns</h1>
            <div className="flex flex-col gap-10">
              <motion.div
                id="featured-campaign"
                variants={featuredCampaignVariants}
                animate={controls}
                transition={{ ease: "easeOut", duration: 0.6 }}
              >
                <FeaturedCampaign />
              </motion.div>
              <motion.div variants={featuredCampaignVariants}>
                <FeaturedCampaign />
              </motion.div>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Home;
