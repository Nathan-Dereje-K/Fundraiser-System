import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close the mobile menu if clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Disable scrolling when the mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full bg-white/35 backdrop-blur-md shadow-lg"
    >
      <nav className="flex justify-between items-center px-8 md:px-12 py-4">
        {/* Logo & Title */}
        <div className="flex gap-3 items-center">
          <div className="bg-orange-500 py-2 px-4 rounded-full text-white font-bold">
            F
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Fundraiser
          </h1>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-6 items-center text-lg font-medium text-gray-700">
          <li className="hover:text-orange-500 cursor-pointer transition-colors">
            Causes
          </li>
          <li className="hover:text-orange-500 cursor-pointer transition-colors">
            Campaigns
          </li>
          <li className="hover:text-orange-500 cursor-pointer transition-colors">
            About Us
          </li>
          <li className="hover:text-orange-500 cursor-pointer transition-colors">
            Impact
          </li>
          <li>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 bg-orange-500 text-white rounded-full shadow-md"
            >
              Start a Campaign
            </motion.button>
          </li>
          <li>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 bg-gray-300 text-gray-800 rounded-full shadow-sm"
            >
              Log in
            </motion.button>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <X size={28} className="cursor-pointer" />
            ) : (
              <Menu size={28} className="cursor-pointer" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div
          ref={menuRef} // Attach the ref to the mobile menu
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden flex flex-col items-center bg-white p-5 shadow-lg"
        >
          <motion.a
            whileTap={{ scale: 0.95 }}
            className="text-lg font-medium text-gray-700 py-2 hover:text-orange-500 cursor-pointer"
          >
            Causes
          </motion.a>
          <motion.a
            whileTap={{ scale: 0.95 }}
            className="text-lg font-medium text-gray-700 py-2 hover:text-orange-500 cursor-pointer"
          >
            Campaigns
          </motion.a>
          <motion.a
            whileTap={{ scale: 0.95 }}
            className="text-lg font-medium text-gray-700 py-2 hover:text-orange-500 cursor-pointer"
          >
            About Us
          </motion.a>
          <motion.a
            whileTap={{ scale: 0.95 }}
            className="text-lg font-medium text-gray-700 py-2 hover:text-orange-500 cursor-pointer"
          >
            Impact
          </motion.a>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-3 px-5 py-2 bg-orange-500 text-white rounded-full shadow-md"
          >
            Start a Campaign
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-3 px-5 py-2 bg-gray-300 text-gray-800 rounded-full shadow-md"
          >
            Log in
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Navbar;
