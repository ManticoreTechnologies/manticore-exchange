import React, { useEffect, useRef } from 'react';
import './home-hero.css';
import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';
import manticore_logo from '@/Application/logos/white-manticore.png';
import evrmore_logo from '@/Application/logos/evr.svg';
import HeroContent from './content';
import { useTheme } from './ThemeContext';
import ThemeToggle from './ThemeToggle';

interface homeheroprops {
  title?: string;
  body?: React.ReactNode;
  logo?: string;
  authButton?: React.ReactNode;
  subtitle?: React.ReactNode;
}

const HomeHero: React.FC<homeheroprops> = ({
  title = "Home Hero",
  logo = manticore_logo,
  body = "This is a sample hero body. Update with info.",
  subtitle,
  authButton
}) => {
  const heroRef = useRef<HTMLElement>(null);
  const { theme } = useTheme();
  
  // Interactive parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const { clientX, clientY } = e;
      const { width, height, left, top } = heroRef.current.getBoundingClientRect();
      
      // Calculate mouse position relative to the center of the hero
      const x = ((clientX - left) / width - 0.5) * 20; // Max movement 20px
      const y = ((clientY - top) / height - 0.5) * 20;
      
      // Update CSS variables for mouse position
      heroRef.current.style.setProperty('--mouse-x', `${clientX - left}px`);
      heroRef.current.style.setProperty('--mouse-y', `${clientY - top}px`);
      
      // Apply parallax effect to logos
      const logoLeft = heroRef.current.querySelector('.hero-logo') as HTMLElement;
      const logoRight = heroRef.current.querySelector('.hero-logo-right') as HTMLElement;
      const heroCenter = heroRef.current.querySelector('.hero-center') as HTMLElement;
      
      if (logoLeft) {
        logoLeft.style.transform = `translate(${-x/2}px, ${-y/2}px)`;
      }
      
      if (logoRight) {
        logoRight.style.transform = `translate(${x/2}px, ${-y/2}px)`;
      }
      
      if (heroCenter) {
        heroCenter.style.transform = `perspective(1000px) rotateX(${y/30}deg) rotateY(${-x/30}deg)`;
      }
    };
    
    const handleMouseLeave = () => {
      if (!heroRef.current) return;
      
      const logoLeft = heroRef.current.querySelector('.hero-logo') as HTMLElement;
      const logoRight = heroRef.current.querySelector('.hero-logo-right') as HTMLElement;
      const heroCenter = heroRef.current.querySelector('.hero-center') as HTMLElement;
      
      if (logoLeft) {
        logoLeft.style.transform = 'translate(0, 0)';
      }
      
      if (logoRight) {
        logoRight.style.transform = 'translate(0, 0)';
      }
      
      if (heroCenter) {
        heroCenter.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      }
    };
    
    const hero = heroRef.current;
    if (hero) {
      hero.addEventListener('mousemove', handleMouseMove);
      hero.addEventListener('mouseleave', handleMouseLeave);
    }
    
    return () => {
      if (hero) {
        hero.removeEventListener('mousemove', handleMouseMove);
        hero.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  // Define different animation settings based on theme
  const getAnimationSettings = () => {
    switch(theme) {
      case 'light':
        return {
          backgroundOpacity: [0.9, 1],
          shadowIntensity: [10, 20],
          transition: { duration: 0.8, ease: "easeOut" }
        };
      case 'evrmore':
        return {
          backgroundOpacity: [0.9, 1],
          shadowIntensity: [15, 30],
          transition: { duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }
        };
      default: // dark
        return {
          backgroundOpacity: [0.8, 1],
          shadowIntensity: [20, 40],
          transition: { duration: 1, ease: "easeOut" }
        };
    }
  };

  const animSettings = getAnimationSettings();

  return (
    <section ref={heroRef} className="hero" data-theme={theme}>
      <ThemeToggle />
      <motion.div 
        className="hero-section hero-left"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={animSettings.transition}
      >
        <img 
          src={logo} 
          alt={title}
          className="hero-logo" 
        />
      </motion.div>
      <motion.div 
        className="hero-section hero-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          boxShadow: `0 ${animSettings.shadowIntensity[0]}px ${animSettings.shadowIntensity[1]}px var(--hero-shadow-dark), 0 0 ${animSettings.shadowIntensity[0]}px var(--hero-shadow-light)`  
        }}
        whileHover={{
          y: -15,
          scale: 1.03,
          boxShadow: `0 ${animSettings.shadowIntensity[0] * 1.5}px ${animSettings.shadowIntensity[1] * 1.5}px var(--hero-shadow-dark), 0 0 ${animSettings.shadowIntensity[0] * 1.5}px var(--hero-shadow-light)`
        }}
        transition={{ ...animSettings.transition, delay: 0.3 }}
      >
        <HeroContent 
          title={title} 
          subtitle={
            <div className="type-animation-container">
              <TypeAnimation
                sequence={[
                  'EVRything Decentralized',
                  2000,
                  'EVRmore Secure',
                  2000,
                  'Trade EVRything',
                  2000,
                  'Create EVRything',
                  2000,
                  'Own EVRything',
                  2000,
                ]}
                wrapper="span"
                speed={50}
                cursor={true}
                repeat={Infinity}
                className="type-animation"
                style={{ display: 'block', width: '100%' }}
                deletionSpeed={70}
                omitDeletionAnimation={false}
              />
            </div>
          } 
          body={body} 
        />
        {authButton && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            {authButton}
          </motion.div>
        )}
      </motion.div>
      <motion.div 
        className="hero-section hero-right"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={animSettings.transition}
      >
        <img 
          src={evrmore_logo} 
          alt={title}
          className="hero-logo-right" 
        />
      </motion.div>
    </section>
  );
};

export default HomeHero;
