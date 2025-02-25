import React from 'react';
import { useTheme } from './ThemeContext';
import { motion } from 'framer-motion';
import './ThemeToggle.css';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme, setTheme } = useTheme();

  // Animation for the toggle button
  const toggleVariants = {
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.95,
      rotate: 0,
      transition: { duration: 0.1 }
    }
  };

  // Theme icon based on current theme
  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" fill="currentColor"/>
            <path d="M12 1V3M12 21V23M23 12H21M3 12H1M20.07 3.93L18.66 5.34M5.34 18.66L3.93 20.07M20.07 20.07L18.66 18.66M5.34 5.34L3.93 3.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'evrmore':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.9999 12C20.9999 16.9706 16.9705 21 11.9999 21C7.02932 21 2.99994 16.9706 2.99994 12C2.99994 7.02944 7.02932 3 11.9999 3C16.9705 3 20.9999 7.02944 20.9999 12Z" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 7V17M7 12H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      default: // dark
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" fill="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
    }
  };

  return (
    <div className={`theme-toggle-container ${className}`}>
      <motion.button
        className={`theme-toggle ${theme}`}
        onClick={toggleTheme}
        variants={toggleVariants}
        whileHover="hover"
        whileTap="tap"
        aria-label={`Switch to ${theme === 'dark' ? 'light' : theme === 'light' ? 'evrmore' : 'dark'} theme`}
      >
        {getThemeIcon()}
      </motion.button>
      
      <div className="theme-options">
        <button 
          className={`theme-option ${theme === 'dark' ? 'active' : ''}`} 
          onClick={() => setTheme('dark')}
          aria-label="Switch to dark theme"
        >
          Dark
        </button>
        <button 
          className={`theme-option ${theme === 'light' ? 'active' : ''}`} 
          onClick={() => setTheme('light')}
          aria-label="Switch to light theme"
        >
          Light
        </button>
        <button 
          className={`theme-option ${theme === 'evrmore' ? 'active' : ''}`} 
          onClick={() => setTheme('evrmore')}
          aria-label="Switch to evrmore theme"
        >
          Evrmore
        </button>
      </div>
    </div>
  );
};

export default ThemeToggle; 