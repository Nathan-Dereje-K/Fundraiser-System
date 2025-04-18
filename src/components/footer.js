import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Footer() {
  return (
    <footer className="bg-white text-gray-800 py-10 dark:bg-gray-700 dark:text-gray-100">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-5">
        {/* Company Info */}
        <div>
          <h3 className="text-lg font-bold mb-4">XOXO</h3>
          <p className="text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin auctor, magna eu facilisis faucibus, lorem augue.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {['Home', 'About Us', 'Services', 'Contact'].map((link) => (
              <motion.li
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                key={link}
              >
                <a href={`/${link.toLowerCase()}`} className="hover:text-gray-400">
                  {link}
                </a>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Social Media Links */}
        <div>
          <h3 className="text-lg font-bold mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            {[
              { name: 'Facebook', link: 'https://facebook.com', icon: 'fab fa-facebook-f' },
              { name: 'Twitter', link: 'https://twitter.com', icon: 'fab fa-twitter' },
              { name: 'Instagram', link: 'https://instagram.com', icon: 'fab fa-instagram' },
            ].map((social) => (
              <motion.a
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-400"
                key={social.name}
              >
                <i className={`${social.icon} text-xl`}></i>
              </motion.a>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-bold mb-4">leave your email to get updates</h3>
          <form className="space-y-4">
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="email"
              placeholder="Your email address"
              className="w-full px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-500"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
            >
              Subscribe
            </motion.button>
          </form>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm">
        <motion.p whileHover={{ scale: 1.05 }}>
          &copy; {new Date().getFullYear()} XOXO. All Rights Reserved.
        </motion.p>
      </div>
    </footer>
  );
}

export default Footer;
