import React from 'react';
import { motion } from 'framer-motion';
import { FaRocket, FaUsers, FaChartLine, FaGlobeAmericas } from 'react-icons/fa';
import './ProjectHighlights.css';

const highlightItems = [
  {
    icon: FaRocket,
    title: "Platform Launch",
    value: "Q2 2023",
    description: "Official launch of the Evrmore Exchange platform with core trading functionality."
  },
  {
    icon: FaUsers,
    title: "User Growth",
    value: "15,000+",
    description: "Active users registered on our platform, with 32% month-over-month growth."
  },
  {
    icon: FaChartLine,
    title: "Asset Listings",
    value: "500+",
    description: "Digital assets currently listed and trading on Evrmore Exchange."
  },
  {
    icon: FaGlobeAmericas,
    title: "Global Reach",
    value: "45+ Countries",
    description: "Our platform is accessible in over 45 countries worldwide with full regulatory compliance."
  }
];

const ProjectHighlights: React.FC = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <section className="project-highlights-section">
      {/* Starfield background for depth */}
      <div className="highlight-starfield"></div>
      
      {/* Section title */}
      <motion.h2 
        className="section-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <span className="title-gradient">Project</span> Highlights
      </motion.h2>
      
      {/* Project highlights container */}
      <motion.div 
        className="highlights-container"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {highlightItems.map((item, index) => (
          <motion.div 
            key={index} 
            className="highlight-card"
            variants={itemVariants}
            whileHover={{ y: -10, scale: 1.02 }}
          >
            {/* Tech decorations */}
            <div className="highlight-decoration top"></div>
            <div className="highlight-decoration bottom"></div>
            
            {/* Icon container */}
            <div className="highlight-icon-container">
              <item.icon className="highlight-icon" />
              <div className="icon-orbit">
                <span className="orbit-dot"></span>
              </div>
            </div>
            
            <h3>{item.title}</h3>
            
            <div className="highlight-value">{item.value}</div>
            
            <p>{item.description}</p>
            
            {/* Data pulse animation */}
            <motion.div 
              className="data-pulse"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0, 0.3, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "loop",
                delay: index * 0.5
              }}
            />
          </motion.div>
        ))}
      </motion.div>
      
      {/* Orbital path decoration */}
      <div className="orbital-path">
        <div className="orbit-satellite"></div>
      </div>
    </section>
  );
};

export default ProjectHighlights; 