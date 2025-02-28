import HomeHero from './home-hero';
import HeroContent from './content';
import { useTheme, ThemeProvider } from './ThemeContext';
import ThemeToggle from './ThemeToggle';

// Default export is the ready-to-use HomeHero with ThemeContext
export default HomeHero;

// Also export individual components for flexibility
export {
  HomeHero,
  useTheme,
  ThemeProvider,
  ThemeToggle,
  HeroContent,
}; 