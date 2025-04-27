import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
const Footer = () => {
  const { t } = useTranslation();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-8 bg-neutral-900 text-white"
    >
      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          {/* Left Section: Logo and Copyright */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-orange-500">
              {t("Fundraising System")}
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              © 2025 {t("All rights reserved")}.
            </p>
          </div>

          {/* Center Section: Quick Links */}
          <div className="flex flex-col md:flex-row gap-4 text-center md:text-left">
            <Link
              to="/about_us"
              href="/about"
              className="text-gray-400 hover:text-orange-500 transition-colors duration-300"
            >
              {t("About Us")}
            </Link>

            <Link
              to="/terms"
              className="text-gray-400 hover:text-orange-500 transition-colors duration-300"
            >
              {t("Privacy Policy")}
            </Link>
          </div>

          {/* Right Section: Social Media Icons */}
          <div className="flex gap-4 justify-center md:justify-end">
            <motion.a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-gray-400 hover:text-orange-500 transition-colors duration-300"
            >
              <Facebook size={20} />
            </motion.a>
            <motion.a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-gray-400 hover:text-orange-500 transition-colors duration-300"
            >
              <Instagram size={20} />
            </motion.a>
            <motion.a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-gray-400 hover:text-orange-500 transition-colors duration-300"
            >
              <Twitter size={20} />
            </motion.a>
            <motion.a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-gray-400 hover:text-orange-500 transition-colors duration-300"
            >
              <Linkedin size={20} />
            </motion.a>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
          Made with ❤️ and ☕ by{" "}
          <Link
            to="/"
            className="text-orange-500 hover:underline transition-colors duration-300"
          >
            A Team Of Three
          </Link>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
