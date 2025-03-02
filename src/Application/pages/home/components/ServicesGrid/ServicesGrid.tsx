import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaExchangeAlt, 
  FaShieldAlt, 
  FaChartLine, 
  FaDatabase, 
  FaCode, 
  FaSatelliteDish 
} from 'react-icons/fa';
import './ServicesGrid.css';

const serviceItems = [
  {
    icon: FaExchangeAlt,
    title: "Decentralized Exchange",
    description: "Trade digital assets securely on our fully decentralized platform with cross-chain compatibility and zero custody.",
    link: "/trade"
  },
  {
    icon: FaShieldAlt,
    title: "Advanced Security",
    description: "Our platform utilizes quantum-resistant encryption and multi-layered security protocols to protect your assets.",
    link: "/security"
  },
  {
    icon: FaChartLine,
    title: "Market Analytics",
    description: "Access real-time analytics and predictive models powered by advanced AI to make informed trading decisions.",
    link: "/analytics"
  },
  {
    icon: FaDatabase,
    title: "IPFS Storage",
    description: "Store your digital assets metadata on the InterPlanetary File System for permanent decentralized access.",
    link: "/ipfs"
  },
  {
    icon: FaCode,
    title: "Developer Tools",
    description: "Build on our platform with comprehensive developer tools, APIs, and SDK for seamless integration.",
    link: "/developers"
  },
  {
    icon: FaSatelliteDish,
    title: "Network Status",
    description: "Monitor the health and performance of the Evrmore network with our real-time status dashboard.",
    link: "/network"
  }
];

const ServicesGrid: React.FC = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
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
        stiffness: 200,
        damping: 20
      }
    }
  };

  return (
    <section className="services-grid-section">
      {/* Orbital ring decoration */}
      <div className="orbital-ring"></div>
      
      {/* Technical grid background */}
      <div className="tech-grid-background"></div>
      
      {/* Section title */}
      <motion.h2 
        className="section-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <FaSatelliteDish className="icon" />
        <span className="title-gradient">Platform</span> Services
      </motion.h2>
      
      {/* Services grid */}
      <motion.div 
        className="services-container"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {serviceItems.map((service, index) => (
          <motion.div 
            key={index} 
            className="service-card"
            variants={itemVariants}
            whileHover={{ 
              y: -10, 
              boxShadow: "0 20px 40px rgba(0,0,0,0.3), 0 0 30px rgba(85, 169, 254, 0.4)"
            }}
          >
            {/* Circuit corner decorations */}
            <div className="circuit-decoration top-left"></div>
            <div className="circuit-decoration top-right"></div>
            <div className="circuit-decoration bottom-left"></div>
            <div className="circuit-decoration bottom-right"></div>
            
            {/* Animated tech pulse */}
            <motion.div 
              className="tech-pulse"
              animate={{ 
                scale: [1, 1.2, 1], 
                opacity: [0, 0.3, 0] 
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                delay: index * 0.5 
              }}
            />
            
            {/* Icon container with hexagon shape */}
            <div className="icon-hexagon">
              <service.icon className="service-icon" />
              <div className="icon-glow"></div>
            </div>
            
            <h3>{service.title}</h3>
            
            <p>{service.description}</p>
            
            <motion.a 
              href={service.link}
              className="service-link"
              whileHover={{ 
                scale: 1.05,
                color: "var(--space-accent-teal)" 
              }}
              whileTap={{ scale: 0.95 }}
            >
              Explore <span className="link-arrow">→</span>
            </motion.a>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Data flow lines */}
      <div className="data-flow-lines">
        <div className="data-line horizontal"></div>
        <div className="data-line vertical"></div>
        <div className="data-line diagonal-1"></div>
        <div className="data-line diagonal-2"></div>
      </div>
    </section>
  );
};

export default ServicesGrid; 