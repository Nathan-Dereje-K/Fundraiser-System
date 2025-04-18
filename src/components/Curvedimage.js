import React, { useState } from "react";
import Image1 from "../assests/image1.jpg"; 
import Image2 from "../assests/image2.jpg";
import Image3 from "../assests/image3.jpg";
import { motion } from 'framer-motion';

const WaveySection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = [Image1, Image2, Image3]; 

  const goToPreviousSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full h-[400px] relative overflow-hidden">
      <div
        className="w-full h-full transition-transform duration-500"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`, // Fixed template literal ??
          display: "flex",
        }}
      >
        {images.map((image, index) => (
          <div key={index} className="relative w-full h-full flex-shrink-0">
            {/* Image */}
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
              style={{
                clipPath:
                  "path('M0 200 Q 400 50, 800 200 T 1600 200 V 0 H 0 Z')", 
              }}
            />
           
           {/*<div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50"></div>*/} 
          </div>
        ))}
      </div>

      
      <button
        className="absolute top-1/3 left-4 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full shadow-lg hover:bg-opacity-75 transition-all"
        onClick={goToPreviousSlide}
      >
        &larr;
      </button>
      <button
        className="absolute top-1/3 right-4 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full shadow-lg hover:bg-opacity-75 transition-all"
        onClick={goToNextSlide}
      >
        &rarr;
      </button>
      <motion.div 
      initial={{ x: -250 }}
      animate={{ x: -3 }}
      transition={{ duration: 2, ease: "easeOut" }}
      
    >
      <h1 className="absolute left-40 bottom-[140px] text-4xl font-bold font-mono text-gray-900 dark:text-gray-200"
      
      >Welcome to Fundraiser</h1>
      <p className="absolute left-40 bottom-[100px] text-gray-900 font-mono dark:text-gray-400">Make urself usefull and start a campaign for ur mates</p>
</motion.div>
      <button
        className="absolute left-40 bottom-[50px] bg-gradient-to-r from-yellow-500 via-red-500 to-purple-500 text-white px-6 py-2 rounded-full shadow-full hover:bg-gradient-to-r hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all"
      >
        Start Campaign
      </button>
    </div>
  );
};

export default WaveySection;