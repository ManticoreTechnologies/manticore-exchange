import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { FaAirFreshener } from 'react-icons/fa'; // Import icons from react-icons
import { IconType } from 'react-icons/lib';
import { motion } from 'framer-motion';
import './info-card.css'

interface infocardprops {
    FaIcon?: IconType;
    to?: string;
    title?: string;
    action?: string;
    body?: string;
}

const InfoCard: React.FC<infocardprops> = ({
    FaIcon = FaAirFreshener,
    to = "/",
    title = "TITLE",
    action = "Learn More",
    body = "This is a sample body. Update with info."
}) => {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '50px'
            }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <motion.div 
            ref={cardRef} 
            className="infocard"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 20 
            }}
            whileHover={{ 
                y: -10,
                transition: { duration: 0.3 }
            }}
        >
            <NavLink to={to} className="icon-item">
                <div className="icon-wrapper">
                    <FaIcon size={40} />
                    <motion.div 
                        className="icon-pulse"
                        animate={{ 
                            scale: [1, 1.2, 1], 
                            opacity: [0, 0.3, 0] 
                        }}
                        transition={{ 
                            duration: 3, 
                            repeat: Infinity,
                            repeatType: "loop" 
                        }}
                    />
                </div>
                <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {title}
                </motion.h3>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    {body}
                </motion.p>
                <motion.span 
                    className="action-button"
                    whileHover={{ 
                        scale: 1.05,
                        y: -3,
                        transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.95 }}
                >
                    {action}
                </motion.span>
            </NavLink>
        </motion.div>
    );
};

export default InfoCard;