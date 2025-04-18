import { useInView } from "react-intersection-observer";
import React from "react";
import { motion } from "framer-motion";

const ExpandSection = () => {
  const { ref, inView } = useInView({
    threshold: 0.55, 
  });

  return (
    <div className="w-full">
      <motion.section
        ref={ref}
        className="h-screen bg-blue-900 flex flex-col items-center justify-center rounded-lg mt-2 mx-auto transition-all duration-500 dark:bg-gray-800"
        animate={{ width: inView ? "100%" : "75%" }} 
        initial={{ width: "75%" }} 
        transition={{ delay: 0.5 }} 
      >
        <div className="text-center max-w-2xl px-4">
          <h1 className="text-5xl font-bold text-white mb-6">
            Secure & Modern Fundraising System
          </h1>
          <p className="text-xl text-gray-200">
            Our fundraising platform is designed with cutting-edge security
            features to ensure your data and transactions are always protected.
            With real-time updates, seamless campaign management, and a
            user-friendly interface, we provide the best tools for creators and
            donors alike. Join us and experience the future of fundraising today!
          </p>
        </div>
      </motion.section>
    </div>
  );
};

export default ExpandSection;