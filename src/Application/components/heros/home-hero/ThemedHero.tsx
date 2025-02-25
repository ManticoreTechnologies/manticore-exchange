import React from 'react';
import HomeHero from './home-hero';
import { ThemeProvider } from './ThemeContext';

interface ThemedHeroProps {
  title?: string;
  body?: React.ReactNode;
  logo?: string;
  authButton?: React.ReactNode;
  subtitle?: React.ReactNode;
  initialTheme?: string;
}

const ThemedHero: React.FC<ThemedHeroProps> = ({
  title,
  body,
  logo,
  authButton,
  subtitle,
  initialTheme = 'dark'
}) => {
  return (
    <ThemeProvider initialTheme={initialTheme}>
      <HomeHero
        title={title}
        body={body}
        logo={logo}
        authButton={authButton}
        subtitle={subtitle}
      />
    </ThemeProvider>
  );
};

export default ThemedHero; 