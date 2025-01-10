import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About: React.FC = () => {
    return (
        <div className="page-wrapper">
            <div className="about-container">
                <header className="about-header">
                    <h1>About Manticore Technologies</h1>
                    <p className="tagline">Building the future on Evermore blockchain</p>
                </header>

                <section className="about-content">
                    <div className="about-section">
                        <h2>Our Story</h2>
                        <p>
                            Founded in 2024, Manticore Technologies, LLC emerged with a clear vision:
                            to develop innovative applications and services leveraging the power of
                            the Evermore blockchain. We're committed to creating solutions that bridge
                            the gap between blockchain technology and real-world applications.
                        </p>
                    </div>

                    <div className="about-section">
                        <h2>Our Mission</h2>
                        <p>
                            We strive to make blockchain technology accessible and practical for
                            businesses and individuals alike. Through our suite of applications and
                            services, we're helping shape the future of decentralized technology.
                        </p>
                    </div>

                    <div className="about-section">
                        <h2>What Sets Us Apart</h2>
                        <ul>
                            <li>Specialized focus on Evermore blockchain technology</li>
                            <li>Innovative approach to blockchain applications</li>
                            <li>Commitment to security and reliability</li>
                            <li>Dedicated team of blockchain experts</li>
                        </ul>
                    </div>

                    <div className="cta-section">
                        <Link to="/roadmap" className="cta-button">
                            View Our Roadmap
                        </Link>
                        <Link to="/contact" className="cta-button">
                            Get in Touch
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default About;
