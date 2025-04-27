/* eslint-disable react/prop-types */
import { motion } from "framer-motion";

const UserStoryCard = ({ imageUrl, userName, message }) => {
  return (
    <motion.div
      className="flex-shrink-0 w-64 h-80 bg-white rounded-lg shadow-lg overflow-hidden p-4"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <img
        src={imageUrl || "/src/assets/testimony_placeholder.jpg"}
        alt={userName}
        className="w-full h-40 object-cover rounded-md mb-4"
      />
      <h3 className="text-lg font-semibold text-gray-800">{userName}</h3>
      <p className="text-sm text-gray-600 mt-2">{message}</p>
    </motion.div>
  );
};

export default UserStoryCard;
