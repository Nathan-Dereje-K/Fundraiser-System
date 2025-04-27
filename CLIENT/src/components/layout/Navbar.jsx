/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { User, Users, LogOut, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../../context/UserContext";
import Avatar from "../ui/Avatar";
import Dropdown from "../ui/Dropdown";
import { useAuth } from "../../hooks/useAuth";

const Navbar = () => {
  const { user: currentUser, isLoading } = useUser();
  const { user: loggedInUser, handleLogout } = useAuth();

  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  // Define navigation links based on the user's role
  const navLinks = [];

  if (loggedInUser) {
    // Role-specific dashboard routing
    let dashboardPath = "/";
    switch (loggedInUser.role) {
      case "admin":
        dashboardPath = "/dashboard";
        break;
      case "user":
        dashboardPath = "/campaign_panel";
        break;
      case "manager":
        dashboardPath = "/campaign_manager";
        break;
      case "validator":
        dashboardPath = "/validator_panel";
        break;
      default:
        dashboardPath = "/";
    }

    // Add dashboard link
    navLinks.push({ path: dashboardPath, label: "Dashboard" });
  }

  // Admin-specific links
  if (loggedInUser?.role === "admin") {
    navLinks.push({ path: "/users", label: "User Management", icon: Users });
  }

  // Add sign-in link for non-logged-in users
  if (!loggedInUser) {
    navLinks.push({ path: "/signin", label: "Sign In", icon: User });
  }

  return (
    <nav className="bg-gray-900 shadow-lg">
      <div className="max-w-7xl mx-auto ">
        {/* Desktop Navbar */}
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0 flex items-center"
          >
            <Link to="/" className="text-3xl font-bold text-white">
              Dashboard
            </Link>
          </motion.div>

          {/* Desktop Navigation Links */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden sm:flex sm:space-x-6"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                  isActive(link.path)
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "text-gray-300 hover:text-white hover:border-gray-400"
                }`}
              >
                {link.icon && <link.icon className="mr-2 h-4 w-4" />}
                {link.label}
              </Link>
            ))}
          </motion.div>

          {/* User Profile Dropdown */}
          <div className="hidden sm:flex sm:items-center">
            {currentUser && (
              <Dropdown
                trigger={
                  <div className="flex items-center cursor-pointer">
                    <span className="text-sm font-medium text-gray-300 mr-2 hidden lg:block">
                      {currentUser.name}
                      <span className="text-xs text-gray-500 flex flex-col items-center">
                        {/* Display the user's role if they are admin, manager, or validator */}
                        {["admin", "manager", "validator"].includes(
                          currentUser?.role
                        )
                          ? ` ${
                              currentUser.role.charAt(0).toUpperCase() +
                              currentUser.role.slice(1)
                            }`
                          : ""}
                      </span>
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
                  className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
                  role="menuitem"
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-4 py-2 text-sm text-red-500 hover:bg-red-900"
                  role="menuitem"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </button>
              </Dropdown>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="sm:hidden bg-gray-800 mt-2 rounded-lg shadow-lg overflow-hidden"
            >
              <div className="pt-2 pb-3 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block pl-3 pr-4 py-2 text-base font-medium ${
                      isActive(link.path)
                        ? "text-blue-400 bg-gray-700"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      {link.icon && <link.icon className="mr-2 h-5 w-5" />}
                      {link.label}
                    </div>
                  </Link>
                ))}
              </div>
              {currentUser && (
                <div className="pt-4 pb-3 border-t border-gray-700">
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <Avatar
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        size="sm"
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-white flex items-center flex-col">
                        {currentUser?.name}
                        <span className="text-xs text-gray-500">
                          {/* Display the user's role if they are admin, manager, or validator */}
                          {["admin", "manager", "validator"].includes(
                            currentUser?.role
                          )
                            ? ` ${
                                currentUser.role.charAt(0).toUpperCase() +
                                currentUser.role.slice(1)
                              }`
                            : ""}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-gray-400">
                        {currentUser.email}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    <Link
                      to="/profile"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full px-3 py-2 rounded-md text-left text-base font-medium text-red-500 hover:text-white hover:bg-red-900"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
