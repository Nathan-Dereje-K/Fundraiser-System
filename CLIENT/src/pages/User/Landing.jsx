import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ShieldCheck, Eye, Rocket, HeartPulse } from "lucide-react";
import Categories from "../../components/ui/Categories";
import FeaturedCampaign from "../../components/ui/FeaturedCampaign";
import Footer from "../../components/layout/Footer";
import Hero from "../../components/ui/Hero";
import Navbar from "../../components/layout/user/Navbar";
import AutoMovingCards from "../../components/ui/AutoMovingCards";
import { useCampaigns } from "../../hooks/useCampaign";
import { useTranslation } from "react-i18next";

// Animation variants remain the same
const categoryVariants = {
  initial: { opacity: 0, y: 50 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

const featureCardVariants = {
  initial: { opacity: 0, scale: 0.9, y: 30 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.4,
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
  const { t } = useTranslation();
  const categoriesRef = useRef(null);
  const campaignsRef = useRef(null);
  const whyPlatformRef = useRef(null);
  const storiesRef = useRef(null);

  const isCategoriesInView = useInView(categoriesRef, {
    once: true,
    amount: 0.25,
  });

  const isCampaignsInView = useInView(campaignsRef, {
    once: true,
    amount: 0.2,
  });

  const isWhyPlatformInView = useInView(whyPlatformRef, {
    once: true,
    amount: 0.2,
  });

  const isStoriesInView = useInView(storiesRef, {
    once: true,
    amount: 0.2,
  });

  const { data: campaigns } = useCampaigns();

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
          className="py-8  md:py-4"
        >
          <motion.h1
            className="font-bold text-3xl sm:text-4xl mb-6 md:mb-14 text-center md:text-left"
            variants={textVariants}
            initial="hidden"
            animate={isCategoriesInView ? "visible" : "visible"}
          >
            {t("Discover Causes")
              .split(" ")
              .map((word, index) => (
                <motion.span
                  key={index}
                  className="inline-block mr-2 last:mr-0"
                  variants={textVariants}
                >
                  {word}
                </motion.span>
              ))}
          </motion.h1>
          <div className="flex justify-center py-4 md:py-6 md:justify-start flex-wrap gap-6 md:gap-8">
            <motion.div variants={categoryVariants}>
              <Categories
                img="https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg"
                title={t("Education")}
                categoryKey="Education"
              />
            </motion.div>
            <motion.div variants={categoryVariants}>
              <Categories
                img="https://images.pexels.com/photos/208512/pexels-photo-208512.jpeg"
                title={t("Medical")}
                categoryKey="Medical"
              />
            </motion.div>
            <motion.div variants={categoryVariants}>
              <Categories
                img="https://images.pexels.com/photos/31115077/pexels-photo-31115077.jpeg"
                title={t("Individual")}
                categoryKey="Individual"
              />
            </motion.div>
            <motion.div variants={categoryVariants}>
              <Categories
                img="https://images.pexels.com/photos/2917381/pexels-photo-2917381.jpeg"
                title={t("Religious")}
                categoryKey="Religious"
              />
            </motion.div>
            <motion.div variants={categoryVariants}>
              <Categories
                img="https://images.pexels.com/photos/545014/pexels-photo-545014.jpeg"
                title={t("Other")}
                categoryKey="Other"
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
          className="py-8 md:py-12"
        >
          {/* === UPDATED Featured Campaigns heading === */}
          <motion.h1
            className="font-bold text-3xl sm:text-4xl mb-6 md:mb-10 text-center md:text-left"
            variants={textVariants}
            initial="hidden"
            animate={isCampaignsInView ? "visible" : "hidden"}
          >
            {/* Check if campaigns exists AND has one or more items */}
            {campaigns && campaigns.length > 0
              ? ["Spotlight", "Initiatives"].map((word, index) => (
                  <motion.span
                    key={index}
                    className="inline-block mr-2 last:mr-0"
                    variants={textVariants}
                  >
                    {word}
                  </motion.span>
                ))
              : null}
          </motion.h1>

          <div className="flex flex-col gap-8 md:gap-10">
            <motion.div variants={featuredCampaignVariants}>
              <FeaturedCampaign />
            </motion.div>

            {(!campaigns || campaigns.length === 0) && isCampaignsInView && (
              <motion.p
                className="text-center text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                No featured campaigns available at the moment.
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Why Our Platform Section */}
        <motion.section
          ref={whyPlatformRef}
          initial="initial"
          animate={isWhyPlatformInView ? "animate" : "initial"}
          variants={staggerContainer}
          className="py-16 md:py-24 bg-gradient-to-br from-teal-50 via-cyan-50 to-light-blue-50 rounded-xl shadow-inner my-12"
        >
          <div className="container mx-auto px-6 md:px-10 lg:px-16">
            <motion.h2
              className="text-3xl sm:text-4xl font-bold text-center mb-4 text-gray-800"
              variants={textVariants}
              initial="hidden"
              animate={isWhyPlatformInView ? "visible" : "hidden"}
            >
              {t("Why Choose Us?")
                .split(" ")
                .map((word, index) => (
                  <motion.span
                    key={index}
                    className="inline-block mr-2 last:mr-0"
                    variants={textVariants}
                  >
                    {word}
                  </motion.span>
                ))}
            </motion.h2>
            <motion.p
              className="text-center text-gray-600 mb-10 md:mb-16 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={
                isWhyPlatformInView
                  ? {
                      opacity: 1,
                      y: 0,
                      transition: { delay: 0.5, duration: 0.6 },
                    }
                  : {}
              }
            >
              {t(
                "We provide a secure, transparent, and user-friendly platform to maximize the impact of your generosity and fundraising efforts."
              )}
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
              <motion.div
                className="bg-white p-6 rounded-lg shadow-lg text-center flex flex-col items-center hover:shadow-xl transition-shadow duration-300"
                variants={featureCardVariants}
              >
                <div className="text-teal-500 bg-teal-100 rounded-full p-3 mb-4 inline-block">
                  <ShieldCheck size={28} strokeWidth={2} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {t("Secure Platform")}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t(
                    "Your data and transactions are protected with industry-standard security measures."
                  )}
                </p>
              </motion.div>

              <motion.div
                className="bg-white p-6 rounded-lg shadow-lg text-center flex flex-col items-center hover:shadow-xl transition-shadow duration-300"
                variants={featureCardVariants}
              >
                <div className="text-cyan-500 bg-cyan-100 rounded-full p-3 mb-4 inline-block">
                  <Eye size={28} strokeWidth={2} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {t("Full Transparency")}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t(
                    "Track donations and campaign progress with clear, real-time reporting. Know where your money goes."
                  )}
                </p>
              </motion.div>

              <motion.div
                className="bg-white p-6 rounded-lg shadow-lg text-center flex flex-col items-center hover:shadow-xl transition-shadow duration-300"
                variants={featureCardVariants}
              >
                <div className="text-blue-500 bg-blue-100 rounded-full p-3 mb-4 inline-block">
                  <Rocket size={28} strokeWidth={2} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {t("Simple & Fast")}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t(
                    "Easily create campaigns or donate in minutes with our intuitive interface."
                  )}
                </p>
              </motion.div>

              <motion.div
                className="bg-white p-6 rounded-lg shadow-lg text-center flex flex-col items-center hover:shadow-xl transition-shadow duration-300"
                variants={featureCardVariants}
              >
                <div className="text-red-500 bg-red-100 rounded-full p-3 mb-4 inline-block">
                  <HeartPulse size={28} strokeWidth={2} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {t("Maximize Impact")}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t(
                    "Reach a wider audience and connect with donors passionate about your cause."
                  )}
                </p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* User Stories Section */}
        <motion.div
          ref={storiesRef}
          initial="hidden"
          animate={isStoriesInView ? "visible" : "hidden"}
          variants={textVariants}
          className="py-8 md:py-12"
        >
          <motion.h1
            className="font-bold text-3xl sm:text-4xl mb-6 md:mb-10 text-center md:text-left"
            variants={textVariants}
            initial="hidden"
            animate={isStoriesInView ? "visible" : "hidden"}
          >
            {t("Impact Chronicles")
              .split(" ")
              .map((word, index) => (
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
