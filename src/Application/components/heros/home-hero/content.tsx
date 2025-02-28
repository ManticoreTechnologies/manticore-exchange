import React from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';

interface HeroContentProps {
  title?: string;
  subtitle?: React.ReactNode;
  body?: React.ReactNode;
  theme?: 'space-tech' | 'light' | 'evrmore';
}

const HeroContent: React.FC<HeroContentProps> = ({ 
  title = "Manticore Exchange", 
  subtitle = "The future of decentralized trading on Evrmore",
  body, 
  theme = 'space-tech' 
}) => {
  // Animation variants
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: theme === 'space-tech' ? 0.8 : 0.6,
        ease: theme === 'space-tech' ? [0.43, 0.13, 0.23, 0.96] : 'easeOut'
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: theme === 'space-tech' ? 1.2 : 0.8,
        ease: theme === 'space-tech' ? [0.43, 0.13, 0.23, 0.96] : 'easeOut'
      }
    }
  };

  const subtitleVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: theme === 'space-tech' ? 0.8 : 0.6,
        delay: 0.4,
        ease: theme === 'space-tech' ? [0.43, 0.13, 0.23, 0.96] : 'easeOut'
      }
    }
  };

  const bodyVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: theme === 'space-tech' ? 0.8 : 0.6,
        delay: 0.6,
        ease: 'easeOut'
      }
    }
  };

  // Get sequences for the type animation based on theme
  const getTypeSequence = () => {
    if (theme === 'space-tech') {
      return [
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
      ];
    } else {
      return [
        'Trade Crypto Assets',
        2000,
        'Secure. Fast. Reliable.',
        2000,
        'Your Gateway to Digital Assets',
        2000,
      ];
    }
  };

  return (
    <motion.div 
      className={`hero-content-container ${theme}`}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.2
          }
        }
      }}
    >
      <motion.h1 
        className={`hero-title ${theme}`}
        variants={titleVariants}
      >
        {title}
      </motion.h1>
      
      <motion.div 
        className={`hero-subtitle ${theme}`}
        variants={subtitleVariants}
      >
        <div className="type-animation-container">
          <TypeAnimation
            sequence={getTypeSequence()}
            wrapper="span"
            speed={50}
            cursor={true}
            repeat={Infinity}
            className={`type-animation ${theme}`}
            style={{ 
              display: 'inline-block',
              minWidth: '250px',
              textAlign: 'left',
              fontWeight: theme === 'space-tech' ? 600 : 500,
              textShadow: theme === 'space-tech' ? '0 0 15px rgba(124, 214, 255, 0.8)' : 'none'
            }}
            deletionSpeed={60}
            omitDeletionAnimation={false}
            preRenderFirstString={true}
          />
        </div>
      </motion.div>
      
      {body && (
        <motion.div 
          className={`hero-body ${theme}`}
          variants={bodyVariants}
        >
          {body}
        </motion.div>
      )}
    </motion.div>
  );
};

export default HeroContent;
