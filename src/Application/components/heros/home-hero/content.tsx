import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeContext';

interface HeroContentProps {
  title: string;
  subtitle: React.ReactNode;
  body: React.ReactNode;
}

const HeroContent: React.FC<HeroContentProps> = ({ title, subtitle, body }) => {
  const { theme } = useTheme();

  // Set animation variants based on theme
  const textVariants = {
    hidden: { 
      opacity: 0, 
      y: 20
    },
    visible: (theme: string) => ({
      opacity: 1,
      y: 0,
      transition: { 
        duration: theme === 'evrmore' ? 1.2 : 1,
        ease: theme === 'evrmore' ? [0.25, 0.1, 0.25, 1] : 'easeOut',
        staggerChildren: 0.2
      }
    })
  };

  const titleVariants = {
    hidden: { 
      opacity: 0, 
      y: -20 
    },
    visible: (theme: string) => ({
      opacity: 1,
      y: 0,
      transition: { 
        duration: theme === 'evrmore' ? 1.2 : 0.8,
        ease: theme === 'light' ? 'easeOut' : [0.43, 0.13, 0.23, 0.96]
      }
    })
  };

  const subtitleVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.9 
    },
    visible: (theme: string) => ({
      opacity: 1,
      scale: 1,
      transition: { 
        duration: 0.8, 
        delay: 0.4,
        ease: theme === 'evrmore' ? [0.43, 0.13, 0.23, 0.96] : 'easeOut'
      }
    })
  };

  const bodyVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: (theme: string) => ({
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.8, 
        delay: 0.6,
        ease: 'easeOut'
      }
    })
  };

  return (
    <motion.div 
      className="hero-text"
      initial="hidden"
      animate="visible"
      variants={textVariants}
      custom={theme}
    >
      <motion.h1 
        variants={titleVariants} 
        custom={theme}
        className={`hero-title ${theme}`}
      >
        {title}
      </motion.h1>
      
      <motion.div 
        style={{ display: 'block', width: '100%', margin: '0 0 1rem 0' }}
        variants={subtitleVariants}
        custom={theme}
      >
        {subtitle}
      </motion.div>
      
      <motion.div 
        variants={bodyVariants}
        custom={theme}
        className={`hero-body ${theme}`}
      >
        {body}
      </motion.div>
    </motion.div>
  );
};

export default HeroContent;
