/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useUser } from "../../../context/UserContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  User,
  Settings,
  Users,
  LogOut,
  Menu,
  X,
  LayoutDashboardIcon,
} from "lucide-react";
import Avatar from "../../ui/Avatar";
import Dropdown from "../../ui/Dropdown";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { user, handleLogout } = useAuth();
  const { user: currentUser } = useUser();
  // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // useEffect(() => {
  //   if (currentUser) {
  //     console.log(currentUser);
  //   }
  // }, [currentUser]);

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
    if (user) {
      navigate("/campaign_creation");
    } else {
      navigate("/signup");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full bg-white/35 backdrop-blur-md shadow-md"
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
            {user ? (
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                {currentUser && (
                  <Dropdown
                    trigger={
                      <div className="flex items-center cursor-pointer">
                        <span className="text-sm font-medium text-gray-700 mr-2 hidden lg:block">
                          {currentUser.name}
                        </span>
                        <Avatar
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          size="sm"
                        />
                      </div>
                    }
                    align="right"
                    className="w-48"
                  >
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      <LayoutDashboardIcon className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                      role="menuitem"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </button>
                  </Dropdown>
                )}
              </div>
            ) : (
              <a
                href="/signin"
                className="px-5 py-2 bg-gray-300 text-gray-800 rounded-full shadow-sm"
              >
                Log in
              </a>
            )}
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
          <a className="text-lg font-medium text-gray-700 py-2 hover:text-orange-500 cursor-pointer">
            Causes
          </a>
          <a className="text-lg font-medium text-gray-700 py-2 hover:text-orange-500 cursor-pointer">
            Campaigns
          </a>
          <a className="text-lg font-medium text-gray-700 py-2 hover:text-orange-500 cursor-pointer">
            About Us
          </a>
          <a className="text-lg font-medium text-gray-700 py-2 hover:text-orange-500 cursor-pointer">
            Impact
          </a>
          <div className="flex justify-center items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="mt-3 px-5 py-2 bg-orange-500 text-white rounded-full shadow-md"
              onClick={handleStartCampaign}
            >
              Start a Campaign
            </motion.button>
            {user ? (
              <button
                onClick={handleLogout}
                className="mt-3 px-5 py-2 bg-gray-300 text-gray-800 rounded-full shadow-md"
              >
                Logout
              </button>
            ) : (
              <a
                href="/signin"
                className="mt-3 px-5 py-2 bg-gray-300 text-gray-800 rounded-full shadow-md"
              >
                Log in
              </a>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Navbar;
