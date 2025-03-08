import React from 'react';
import './SectionTitle.css';

interface SectionTitleProps {
  icon: React.ReactNode;
  title: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ icon, title }) => {
  return (
    <h2 className="cosmic-title">
      <span className="section-icon">{icon}</span>
      {title}
    </h2>
  );
};

export default SectionTitle; 