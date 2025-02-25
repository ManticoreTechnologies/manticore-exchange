import ThemedHero from './ThemedHero';
import HomeHero from './home-hero';
import { useTheme, ThemeProvider } from './ThemeContext';
import ThemeToggle from './ThemeToggle';

// Default export is the ready-to-use ThemedHero with ThemeContext
export default ThemedHero;

// Also export individual components for flexibility
export {
  HomeHero,
  useTheme,
  ThemeProvider,
  ThemeToggle,
}; 