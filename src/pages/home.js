import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import CardContainer from '../components/CardContainer';
import ExpandSection from '../components/w-fullVewSection';
import BackToTopButton from '../components/backToTheTopButton';
import WaveySection from '../components/Curvedimage';

const cards = [
  { id: 1, title: 'Card 1', description: 'Description for Card 1', shadow: 'shadow-blue-500/50' },
  { id: 2, title: 'Card 2', description: 'Description for Card 2', shadow: 'shadow-green-500/50' },
  { id: 3, title: 'Card 3', description: 'Description for Card 3', shadow: 'shadow-yellow-500/50' },
  { id: 4, title: 'Card 4', description: 'Description for Card 4', shadow: 'shadow-pink-500/50' },
  { id: 5, title: 'Card 5', description: 'Description for Card 5', shadow: 'shadow-purple-500/50' },
  { id: 6, title: 'Card 6', description: 'Description for Card 6', shadow: 'shadow-indigo-500/50' },
  { id: 7, title: 'Card 7', description: 'Description for Card 7', shadow: 'shadow-red-500/50' },
  { id: 8, title: 'Card 8', description: 'Description for Card 8', shadow: 'shadow-teal-500/50' },
];

function Home() {
  const sliderRef = useRef(null);
  const animationRef = useRef(null);
  const positionRef = useRef(0);
  const isHoveredRef = useRef(false);
  // Triple the cards for seamless looping
  const duplicatedCards = [...cards, ...cards, ...cards, ...cards, ...cards];

  const animate = () => {
    if (!isHoveredRef.current) {
      positionRef.current -= 0.01;
      
      // Reset position before gap becomes visible
      if (positionRef.current <= -200) { // Adjusted for quintupled cards
        positionRef.current = 0;
      }
      
      sliderRef.current.style.transform = `translateX(${positionRef.current}%)`;
    }
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  const handleHoverStart = () => {
    isHoveredRef.current = true;
  };

  const handleHoverEnd = () => {
    isHoveredRef.current = false;
  };

  const Card = ({ card }) => (
    <motion.div
      className={`p-6 rounded-lg w-64 h-48 flex flex-col bg-gray-100 dark:bg-gray-700 ${card.shadow} shadow-lg cursor-pointer flex-shrink-0 mx-4`}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
    >
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{card.title}</h2>
      <p className="mt-2 text-gray-600 dark:text-gray-200 flex-grow">{card.description}</p>
    </motion.div>
  );

  return (
    <div className="pt-0 text-center dark:bg-gray-800">
      <WaveySection />

      {/* Card Container with hidden overflow */}
      <div className="relative overflow-hidden py-10 dark:bg-gray-800 h-64">
        <div
          ref={sliderRef}
          className="flex absolute left-0 top-0 h-full items-center"
          style={{ width: `${duplicatedCards.length * 288}px` }}
        >
          {duplicatedCards.map((card, index) => (
            <Card key={`${card.id}-${index}`} card={card} />
          ))}
        </div>
      </div>

      <div className="mt-8 mb-8 dark:bg-gray-800">
        <div className="mr-8">
          <CardContainer />
        </div>
        <BackToTopButton />
        <ExpandSection />
      </div>
    </div>
  );
}

export default React.memo(Home);