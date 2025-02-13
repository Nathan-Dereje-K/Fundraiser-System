import Categories from "../components/Categories";
import FeaturedCampaign from "../components/FeaturedCampaign";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <>
      <div>
        <Navbar />
        <div className="ml-6 mr-6 md:mr-14 md:ml-14 lg:mr-20 lg:ml-20 mb-10">
          <Hero />
          {/* Catagories and Featured Campaigns */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1, ease: "easeOut" }}
          >
            <h1 className="font-bold py-10 text-3xl">Categories</h1>
            <div className=" flex justify-start flex-wrap gap-9">
              <Categories />
              <Categories />
              <Categories />
              <Categories />
            </div>
            <h1 className="font-bold py-12 text-3xl">Featured Campaigns</h1>
            {/* featured campaign hlder div */}
            <div className="flex flex-col gap-10">
              <FeaturedCampaign />
              <FeaturedCampaign />
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Home;
