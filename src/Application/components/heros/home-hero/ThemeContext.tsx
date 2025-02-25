import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the Theme Context type
export interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
  setTheme: (theme: string) => void;
}

// Create the context with default values
export const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
  setTheme: () => {}
});

// Theme provider props
interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: string;
}

// Create a provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  initialTheme = 'dark' 
}) => {
  // State to hold the current theme
  const [theme, setTheme] = useState<string>(initialTheme);

  // Initialize theme from localStorage if available
  useEffect(() => {
    const savedTheme = localStorage.getItem('manticore-theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Update localStorage when theme changes
  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem('manticore-theme', theme);
  }, [theme]);

  // Toggle between themes
  const toggleTheme = () => {
    setTheme(prevTheme => {
      // Cycle through themes: dark -> light -> evrmore -> dark
      if (prevTheme === 'dark') return 'light';
      if (prevTheme === 'light') return 'evrmore';
      return 'dark';
    });
  };

  // Context value
  const contextValue: ThemeContextType = {
    theme,
    toggleTheme,
    setTheme: (newTheme: string) => setTheme(newTheme)
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

export default ThemeProvider; 