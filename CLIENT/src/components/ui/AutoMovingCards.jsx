// components/ui/AutoMovingCards.jsx
import { motion } from "framer-motion";
import UserStoryCard from "./UserStoryCard";
import { useGetAllTestimonials } from "../../hooks/useTestimonial";
import { useEffect } from "react";

const AutoMovingCards = () => {
  const { data: cards } = useGetAllTestimonials();

  // Animation configuration
  const containerVariants = {
    animate: {
      x: [0, -1600], // Adjust based on card width and number of cards
      transition: {
        duration: 40, // Slower animation (20 seconds per loop)
        ease: "linear",
        repeat: Infinity,
      },
    },
  };

  return (
    <div className="relative overflow-hidden py-12">
      <motion.div
        className="flex gap-8"
        variants={containerVariants}
        animate="animate"
      >
        {/* First set of cards */}
        {cards?.map((card, index) => (
          <UserStoryCard key={index} {...card} />
        ))}
        {/* Duplicate set of cards for seamless looping */}
        {cards?.map((card, index) => (
          <UserStoryCard key={index + cards.length} {...card} />
        ))}
      </motion.div>
    </div>
  );
};

export default AutoMovingCards;
