import React, { useState } from 'react';
import './AssetsCarousel.css';

interface Asset {
    name: string;
    description: string;
}

const AssetsCarousel: React.FC<{ favoriteAssets: Asset[] }> = ({ favoriteAssets }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((currentIndex + 1) % favoriteAssets.length);
    };

    const prevSlide = () => {
        setCurrentIndex((currentIndex - 1 + favoriteAssets.length) % favoriteAssets.length);
    };

    const currentAsset = favoriteAssets[currentIndex];

    return (
        <div className="assets-carousel">
            <button onClick={prevSlide} className="carousel-button">❮</button>
            <div className="carousel-content">
                {favoriteAssets.length > 0 ? (
                    <div className="asset-card">
                        <h3>{currentAsset.name.toUpperCase()}</h3>
                        <p>{currentAsset.description}</p>
                    </div>
                ) : (
                    <p>No favorite assets available</p>
                )}
            </div>
            <button onClick={nextSlide} className="carousel-button">❯</button>
        </div>
    );
};

export default AssetsCarousel;


