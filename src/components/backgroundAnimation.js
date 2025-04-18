import React from 'react';
import { motion } from 'framer-motion';

// Light mode particle colors
const colors = [
  '#FF6B6B', // Coral
  '#4ECDC4', // Turquoise
  '#FFE66D', // Yellow
  '#6B5B95', // Purple
  '#FF9F1C', // Orange
  '#2EC4B6', // Teal
  '#E71D36', // Red
  '#F4E04D', // Gold
  '#7B2CBF', // Violet
  '#00A8E8', // Blue
];

const ParticleBackground = () => {
  const particles = Array.from({ length: 30 }).map((_, index) => ({
    id: index,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 5 + 2,
    duration: Math.random() * 5 + 3,
    delay: Math.random() * 2,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));

  return (
    <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 bg-gray-200 dark:bg-[#0A192F]">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
          }}
          animate={{
            y: [0, 100, 0],
            x: [0, 50, 0],
            scale:  [3, 4.2, 2],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

export default ParticleBackground;