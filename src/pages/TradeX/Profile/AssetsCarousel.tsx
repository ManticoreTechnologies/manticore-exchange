import React, { useState } from 'react';
import './AssetsCarousel.css';

const AssetsCarousel = ({ featuredAssets }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((currentIndex + 1) % featuredAssets.length);
    };

    const prevSlide = () => {
        setCurrentIndex((currentIndex - 1 + featuredAssets.length) % featuredAssets.length);
    };

    return (
        <div className="assets-carousel">
            <button onClick={prevSlide} className="carousel-button">❮</button>
            <div className="carousel-content">
                {featuredAssets.length > 0 ? (
                    <div className="asset-card">
                        <h3>{featuredAssets[currentIndex].name}</h3>
                        <p>{featuredAssets[currentIndex].description}</p>
                    </div>
                ) : (
                    <p>No featured assets available</p>
                )}
            </div>
            <button onClick={nextSlide} className="carousel-button">❯</button>
        </div>
    );
};

export default AssetsCarousel;
