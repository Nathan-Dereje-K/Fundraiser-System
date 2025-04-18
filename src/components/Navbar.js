import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBars, FaTimes, FaUser, FaHome, FaInfoCircle, FaHandHoldingHeart, FaBullhorn } from "react-icons/fa";
import ThemeToggle from "./Theme";
import SearchBar from "./SearchBar";
import Notification from "./notification";	
import TempAuthControls from './TempAuthControls'; 


function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const colors = [
    "#FF6B6B", // Coral
    "#4ECDC4", // Turquoise
    "#FFE66D", // Yellow
    "#6B5B95", // Purple
    "#FF9F1C", // Orange
    "#2EC4B6", // Teal
    "#E71D36", // Red
    "#F4E04D", // Gold
    "#7B2CBF", // Violet
  ];

  // Map menu items to their respective icons
  const menuItems = [
    { name: "Home", icon: <FaHome />, path: "/home" },
    { name: "About", icon: <FaInfoCircle />, path: "/about" },
    { name: "Donate", icon: <FaHandHoldingHeart />, path: "/donate" },
    { name: "Campaigns", icon: <FaBullhorn />, path: "/campaigns" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="sticky top-3 bg-white dark:bg-gray-700 font-semibold p-2 flex justify-between items-center shadow-md shadow-gray-500/30 dark:shadow-gray-700/50 z-50 rounded-3xl">
      {/* Logo Section */}
      <motion.div
        className="flex items-center gap-2"
        initial={{ x: -250 }}
        animate={{ x: -3 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.h1
          whileHover={{ scale: 1.1 }}
          whileTap={{ rotate: -360 }}
          className="text-2xl"
        >
          🫀
        </motion.h1>
        <motion.h1 className="text-2xl flex font-bold">
          {"Fundraiser".split("").map((letter, index) => (
            <span key={index} style={{ color: colors[index % colors.length] }}>
              {letter}
            </span>
          ))}
        </motion.h1>
      </motion.div>

      <div className="text-gray-500 hidden md:flex flex-1 items-center justify-center">
        <ul className="flex gap-4">
          {menuItems.map((item) => (
            <li
              key={item.name}
              className="relative"
              onMouseEnter={() => setHoveredLink(item.name)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <Link
                className="hover:text-black flex items-center gap-2"
                to={item.path}
              >
                {item.icon} {/* Icon */}
                {item.name} {/* Text */}
              </Link>
              {hoveredLink === item.name && (
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-black"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </li>
          ))}
          <SearchBar />
        </ul>
      </div>

      <div className="hidden md:flex items-center justify-end gap-4">
        <ThemeToggle />
        <Notification/>
          
        <TempAuthControls/>
        
      </div>
      
      <button
        className="md:hidden focus:outline-none"
        onClick={toggleMobileMenu}
      >
        {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Mobile Menu */}
      <div
        className={`${
          isMobileMenuOpen ? "block" : "hidden"
        } md:hidden absolute top-full left-0 w-full bg-white shadow-lg rounded-lg p-4 space-y-2`}
      >
        <ul className="flex flex-col items-center">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                className="hover:text-gray-200 flex items-center gap-2"
                to={item.path}
                onClick={toggleMobileMenu}
              >
                {item.icon} {/* Icon */}
                {item.name} {/* Text */}
              </Link>
            </li>
          ))}
          <li>
            <Link
              className="hover:text-gray-200 flex items-center gap-2"
              to="/sign-in"
              onClick={toggleMobileMenu}
            >
              <FaUser size={14} />
              Login
            </Link>
          </li>
          
          
          <li>
            <Link
              className="hover:text-gray-200 flex items-center gap-2"
              to="/signup"
              onClick={toggleMobileMenu}
            >
              Signup
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;