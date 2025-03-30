/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { Heart, HandHeart, Users, CircleDashed } from "lucide-react";

const LoadingSpinner = ({ size = 96, color = "text-orange-500" }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const heartVariants = {
    rotate: {
      rotate: 360,
      transition: {
        duration: 1.8,
        repeat: Infinity,
        ease: "linear",
      },
    },
    pulse: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
      },
    },
  };

  const handVariants = {
    float: {
      y: [0, -20, 0],
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const messages = [
    "One hand making a difference...",
    "Reaching out with care...",
    "Individual action creating impact...",
    "Your contribution matters...",
    "Kindness in motion...",
  ];

  return (
    <motion.div
      className="flex flex-col items-center justify-center gap-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      role="status"
      aria-label="Loading"
    >
      {/* Central Heart Animation */}
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background Track */}
        <motion.div
          className="absolute inset-0 text-gray-200"
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        >
          <CircleDashed size={size} strokeWidth={1.5} />
        </motion.div>

        {/* Single Floating Hand */}
        <motion.div
          className="absolute inset-0"
          style={{ originX: "50%", originY: "50%" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        >
          <motion.div
            variants={handVariants}
            className="absolute left-1/2 -translate-x-1/2 -top-4"
          >
            <HandHeart
              size={size * 0.4}
              className="text-blue-400"
              strokeWidth={1.5}
            />
          </motion.div>
        </motion.div>

        {/* Pulsating Heart Core */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          variants={heartVariants}
          animate={["rotate", "pulse"]}
        >
          <Heart
            size={size * 0.6}
            className={`${color} drop-shadow-lg`}
            fill="currentColor"
            strokeWidth={1.5}
          />
        </motion.div>
      </div>

      {/* Dynamic Messaging */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center space-y-3"
      >
        <motion.div
          key={messages[Math.floor(Math.random() * messages.length)]}
          initial={{ y: 10 }}
          animate={{ y: 0 }}
          className="text-lg font-semibold text-gray-700"
        >
          {messages[Math.floor(Math.random() * messages.length)]}
        </motion.div>
        <div className="flex items-center justify-center gap-2 text-gray-500">
          <Users className="w-5 h-5" />
          <span className="text-sm">Individual Impact</span>
        </div>
      </motion.div>

      {/* Progress Indicator */}
      <motion.div
        className="relative w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-400 to-transparent animate-pulse" />
      </motion.div>
    </motion.div>
  );
};

export default LoadingSpinner;
