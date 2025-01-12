// src/context/ThemeContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

type Theme = 'dark' | 'light' | 'evrmore';

interface ThemeContextProps {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem('theme') as Theme;
        return savedTheme || 'dark';
    });

    const handleThemeChange = (newTheme: Theme) => {
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    // Set initial theme
    React.useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, setTheme: handleThemeChange }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
