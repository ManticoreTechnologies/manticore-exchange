import React, { useState, useEffect } from 'react';
import { BsSun, BsMoon, BsPalette2 } from 'react-icons/bs';
import { RiAliensFill } from 'react-icons/ri';
import { FaMoon } from 'react-icons/fa';
import './ThemeSettings.css';

type Theme = 'dark' | 'light' | 'cyberpunk' | 'midnight';

interface ThemeOption {
    id: Theme;
    name: string;
    icon: React.ReactNode;
}

const themeOptions: ThemeOption[] = [
    { id: 'dark', name: 'Dark', icon: <BsMoon className="w-3 h-3" /> },
    { id: 'light', name: 'Light', icon: <BsSun className="w-3 h-3" /> },
    { id: 'cyberpunk', name: 'Cyber', icon: <RiAliensFill className="w-3 h-3" /> },
    { id: 'midnight', name: 'Night', icon: <FaMoon className="w-3 h-3" /> }
];

const ThemeSettings: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentTheme, setCurrentTheme] = useState<Theme>('dark');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme;
        if (savedTheme && themeOptions.some(opt => opt.id === savedTheme)) {
            setCurrentTheme(savedTheme);
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
    }, []);

    const toggleTheme = (theme: Theme) => {
        setCurrentTheme(theme);
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (isOpen && !(e.target as HTMLElement).closest('.theme-settings-button')) {
                setIsOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isOpen]);

    return (
        <div className="theme-settings-button">
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className="btn p-1 rounded-full bg-background-secondary hover:bg-background-tertiary transition-fast focus:outline-none"
                aria-label="Theme"
            >
                <BsPalette2 className="w-3 h-3 text-primary settings-icon" />
            </button>

            {isOpen && (
                <div className="theme-settings-panel p-2 rounded-lg bg-background-secondary shadow-lg">
                    <div className="flex gap-1">
                        {themeOptions.map((theme) => (
                            <button
                                key={theme.id}
                                onClick={() => toggleTheme(theme.id)}
                                className={`flex items-center gap-1.5 p-1.5 rounded-md transition-fast text-xs focus:outline-none
                                    ${currentTheme === theme.id 
                                        ? 'bg-background-tertiary text-primary' 
                                        : 'hover:bg-background-tertiary'
                                    }`}
                                title={`${theme.name} Theme`}
                            >
                                {theme.icon}
                                {theme.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThemeSettings; 