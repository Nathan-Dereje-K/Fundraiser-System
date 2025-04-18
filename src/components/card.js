import React from 'react';
import { motion } from 'framer-motion';

function Card({ title, image, description, link, delay }) {
  return (
    <motion.div
      className="max-w-sm w-full bg-white dark:bg-gray-600 dark:text-gray-100 shadow-lg rounded-lg overflow-hidden transform transition-transform"
      whileHover={{ scale: 1.05 }}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      <img className="w-full h-48 object-cover" src={image} alt={title} />
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <p className="mt-2 text-gray-600">{description}</p>
        <a href={link} className="text-blue-500 hover:text-blue-600 font-semibold">
          Read More
        </a>
      </div>
    </motion.div>
  );
}

export default Card;
