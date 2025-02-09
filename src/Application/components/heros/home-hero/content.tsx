import React from 'react';

interface HeroContentProps {
  title: string;
  subtitle: string;
  body: React.ReactNode;
}

const HeroContent: React.FC<HeroContentProps> = ({ title, subtitle, body }) => {
  return (
    <div className="hero-text">
      <h1>{title}</h1>
      <h1>{subtitle}</h1>
      <div>{body}</div>
    </div>
  );
};

export default HeroContent;
