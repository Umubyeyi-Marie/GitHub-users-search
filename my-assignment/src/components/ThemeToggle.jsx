import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from './ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center gap-2 py-2 px-3 rounded-md font-semibold text-sm
        ${theme === 'light'
          ? 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200'
          : 'bg-pink-800 text-gray-100 border border-gray-700 hover:bg-gray-700'}
      `}
    >
      {theme === 'light' ? 'LIGHT' : 'DARK'} {theme === 'light' ? <FaSun /> : <FaMoon />}
    </button>
  );
};

export default ThemeToggle;
