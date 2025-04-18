
// import { create } from 'zustand';

// const useThemeStore = create((set) => ({
//   isDarkMode: false, 
//   toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
// }));

// export default useThemeStore;

 


import { create } from 'zustand';
import Cookies from 'js-cookie';

// Helper function to get the theme from cookies
const getInitialTheme = () => {
  const savedTheme = Cookies.get('theme');
  return savedTheme ? savedTheme === 'dark' : false; // Default to light theme if no preference is saved
};

const useThemeStore = create((set) => ({
  isDarkMode: getInitialTheme(), // Initialize from cookies
  toggleDarkMode: () => {
    set((state) => {
      const newTheme = !state.isDarkMode;
      Cookies.set('theme', newTheme ? 'dark' : 'light', { expires: 365 }); // Save the new theme preference
      return { isDarkMode: newTheme };
    });
  },
}));

export default useThemeStore;