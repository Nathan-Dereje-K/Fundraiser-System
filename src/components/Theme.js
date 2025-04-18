import React, { useEffect } from 'react';
import useThemeStore from '../store/useThemeStore';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <button
      className="p-2 bg-gray-200 dark:bg-gray-800 rounded-md text-black dark:text-white flex items-center justify-center transition-all duration-300 hover:scale-110"
      onClick={toggleDarkMode}
    >
      {isDarkMode ? (
        <FaSun className="w-3 h-3 transition-all duration-300" />
      ) : (
        <FaMoon className="w-3 h-3 transition-all duration-300" />
      )}
    </button>
  );
};

export default ThemeToggle;