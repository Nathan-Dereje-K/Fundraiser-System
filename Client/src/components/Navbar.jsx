import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useAuth,
  useClerk,
} from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { openSignIn } = useClerk();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  const handleStartCampaign = () => {
    if (isSignedIn) {
      navigate("/campaign_creation");
    } else {
      openSignIn(); // Opens Clerk sign-in modal
    }
  };

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
              onClick={handleStartCampaign}
            >
              Start a Campaign
            </motion.button>
          </li>
          {/* Authentication */}
          <li>
            <SignedOut>
              <SignInButton mode="modal">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-2 bg-gray-300 text-gray-800 rounded-full shadow-sm"
                >
                  Log in
                </motion.button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <UserButton />
            </SignedIn>
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
          ref={menuRef}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden flex flex-col items-center bg-white p-5 shadow-lg"
        >
          <motion.a className="text-lg font-medium text-gray-700 py-2 hover:text-orange-500 cursor-pointer">
            Causes
          </motion.a>
          <motion.a className="text-lg font-medium text-gray-700 py-2 hover:text-orange-500 cursor-pointer">
            Campaigns
          </motion.a>
          <motion.a className="text-lg font-medium text-gray-700 py-2 hover:text-orange-500 cursor-pointer">
            About Us
          </motion.a>
          <motion.a className="text-lg font-medium text-gray-700 py-2 hover:text-orange-500 cursor-pointer">
            Impact
          </motion.a>
          <div className="flex justify-center items-center  gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="mt-3 px-5 py-2 bg-orange-500 text-white rounded-full shadow-md"
              onClick={handleStartCampaign}
            >
              Start a Campaign
            </motion.button>
            <SignedOut>
              <SignInButton mode="modal">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-3 px-5 py-2 bg-gray-300 text-gray-800 rounded-full shadow-md"
                >
                  Log in
                </motion.button>
              </SignInButton>
            </SignedOut>
            <div className="hidden">
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Navbar;
