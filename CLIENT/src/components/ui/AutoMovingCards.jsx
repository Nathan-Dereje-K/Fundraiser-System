// components/ui/AutoMovingCards.jsx
import { motion } from "framer-motion";
import UserStoryCard from "./UserStoryCard";

const AutoMovingCards = () => {
  const cards = [
    {
      img: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      name: "John Doe",
      story: "Helped me achieve my dreams!",
    },
    {
      img: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      name: "Jane Smith",
      story: "Made a huge impact on my life.",
    },
    {
      img: "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      name: "Emily Davis",
      story: "Couldn't have done it without them.",
    },
    {
      img: "https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      name: "Michael Brown",
      story: "A life-changing experience.",
    },
  ];

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
        {cards.map((card, index) => (
          <UserStoryCard key={index} {...card} />
        ))}
        {/* Duplicate set of cards for seamless looping */}
        {cards.map((card, index) => (
          <UserStoryCard key={index + cards.length} {...card} />
        ))}
      </motion.div>
    </div>
  );
};

export default AutoMovingCards;
