import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import placeholderImage from '@/Application/logos/white-manticore.png';
import './ImageCarousel.css';

interface ImageCarouselProps {
  images: Array<{
    ipfs_hash: string | null;
    asset_name: string;
  }>;
  onImageChange: (assetName: string) => void;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, onImageChange }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const getImageUrl = (hash: string | null) => {
    if (!hash) return placeholderImage;
    return `https://rose-decent-prawn-420.mypinata.cloud/ipfs/${hash}?pinataGatewayToken=HtcAOAK7UkS5a7JrD-_1j4FwStTV2Qw4uNJ7_Esk-TvoCsn87T6wUeoq6w7WN3SO`;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = placeholderImage;
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(nextIndex);
    onImageChange(images[nextIndex].asset_name);
  };

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(prevIndex);
    onImageChange(images[prevIndex].asset_name);
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
    onImageChange(images[index].asset_name);
  };

  const handleImageClick = () => {
    setActiveImage(getImageUrl(images[currentIndex].ipfs_hash));
  };

  return (
    <div className="image-carousel">
      <div className="image-carousel__main">
        <button 
          className="image-carousel__nav image-carousel__nav--prev" 
          onClick={handlePrev}
          disabled={images.length <= 1}
        >
          <FiChevronLeft />
        </button>
        
        <div className="image-carousel__image-container">
          <img
            src={getImageUrl(images[currentIndex].ipfs_hash)}
            alt={images[currentIndex].asset_name}
            className="image-carousel__image"
            onClick={handleImageClick}
            onError={handleImageError}
          />
        </div>

        <button 
          className="image-carousel__nav image-carousel__nav--next" 
          onClick={handleNext}
          disabled={images.length <= 1}
        >
          <FiChevronRight />
        </button>
      </div>

      {images.length > 1 && (
        <div className="image-carousel__thumbnails">
          {images.map((image, index) => (
            <div
              key={index}
              className={`image-carousel__thumbnail ${index === currentIndex ? 'active' : ''}`}
              onClick={() => handleThumbnailClick(index)}
            >
              <img
                src={getImageUrl(image.ipfs_hash)}
                alt={image.asset_name}
                onError={handleImageError}
              />
            </div>
          ))}
        </div>
      )}

      {activeImage && (
        <div className="image-carousel__modal" onClick={() => setActiveImage(null)}>
          <img src={activeImage} alt="Full size" />
        </div>
      )}
    </div>
  );
}; 