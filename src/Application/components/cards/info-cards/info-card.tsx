import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { FaAirFreshener } from 'react-icons/fa'; // Import icons from react-icons
import { IconType } from 'react-icons/lib';
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
        <div ref={cardRef} className="infocard">
            <NavLink to={to} className="icon-item">
                <div className="icon-wrapper">
                    <FaIcon size={50} />
                </div>
                <h3>{title}</h3>
                <p>{body}</p>
                <span className="action-button">{action}</span>
            </NavLink>
        </div>
    );
};

export default InfoCard;