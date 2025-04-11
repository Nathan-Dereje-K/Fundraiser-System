/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const Categories = ({ img, title }) => {
  return (
    <motion.div
      className="w-60 rounded-xl overflow-hidden shadow-md transition-shadow duration-300 bg-white hover:shadow-lg"
      whileHover={{
        scale: 1.05,
        boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.2)",
        backgroundColor: "#f9fafb", // Slightly darker than white for contrast
      }}
      whileTap={{ scale: 0.98 }}
    >
      <Link
        to={`/category/${title}`}
        className="block text-decoration-none outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label={`Explore ${title} category`}
      >
        {/* Image Section */}
        <div className="relative overflow-hidden">
          <motion.img
            className="w-full h-48 object-cover rounded-t-xl transition-transform duration-300 transform scale-100 group-hover:scale-110"
            src={img}
            alt={`${title} category`}
            loading="lazy" // Improve performance for images
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 flex items-end p-4">
            <motion.h2
              className="text-white font-bold text-lg sm:text-xl truncate"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {title}
            </motion.h2>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 flex items-center justify-between">
          <span className="text-gray-700 font-medium text-sm sm:text-base">
            Discover {title}
          </span>
          <motion.div
            className="flex items-center cursor-pointer"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowRight className="text-gray-700 w-5 h-5 sm:w-6 sm:h-6" />
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
};

export default Categories;
