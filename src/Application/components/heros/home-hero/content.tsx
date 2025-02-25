import React from 'react';

interface HeroContentProps {
  title: string;
  subtitle: React.ReactNode;
  body: React.ReactNode;
}

const HeroContent: React.FC<HeroContentProps> = ({ title, subtitle, body }) => {
  return (
    <div className="hero-text">
      <h1>{title}</h1>
      <div style={{ display: 'block', width: '100%', margin: '0 0 1rem 0' }}>
        {subtitle}
      </div>
      <div>{body}</div>
    </div>
  );
};

export default HeroContent;
