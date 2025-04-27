import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeftCircle } from "lucide-react";

const ForbiddenPage = () => {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 flex flex-col items-center justify-center text-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
        className="flex flex-col items-center"
      >
        <motion.h1
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-9xl font-extrabold text-white drop-shadow-xl"
        >
          403
        </motion.h1>
        <motion.h2
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-3xl font-semibold text-gray-100 mt-4"
        >
          Oops! Forbidden Page
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-lg text-gray-200 mt-2 max-w-lg"
        >
          You do not have permission to access this page.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-6"
        >
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg shadow-lg hover:bg-gray-100 transition duration-300"
          >
            <ArrowLeftCircle className="w-5 h-5" />
            Go Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForbiddenPage;
