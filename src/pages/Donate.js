import React from "react";
import { motion } from "framer-motion";
import ReactPlayer from "react-player";
import useStore from "../store/store";

const App = () => {
  const { isVideoPlaying, setVideoPlaying } = useStore();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {/* Left Side: Video Player */}
        <motion.div
          className="w-full h-[400px] md:h-screen bg-gray-200 flex items-center justify-center"
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5 }}
          onViewportEnter={() => setVideoPlaying(true)}
          onViewportLeave={() => setVideoPlaying(false)}
        >
          <ReactPlayer
            url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
            playing={isVideoPlaying}
            controls
            width="100%"
            height="100%"
          />
        </motion.div>

        {/* Right Side: Topics and Paragraphs */}
        <div className="space-y-8 overflow-y-auto p-4">
          {[...Array(5)].map((_, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-4">Topic {index + 1}</h2>
              <p className="text-gray-700">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;