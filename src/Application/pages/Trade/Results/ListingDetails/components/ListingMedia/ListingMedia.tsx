import React from 'react';
import './ListingMedia.css';

interface ListingMediaProps {
  imageUrl: string;
  altText: string;
  onLoad: () => void;
  mediaLoaded: boolean;
}

export const ListingMedia: React.FC<ListingMediaProps> = ({ imageUrl, altText, onLoad, mediaLoaded }) => {
  return (
    <div className="listing-media-container">
      <div className="listing-media">
        {!mediaLoaded && (
          <div className="media-loader">Loading...</div>
        )}
        <img
          src={imageUrl}
          alt={altText}
          className={`listing-image ${mediaLoaded ? 'loaded' : ''}`}
          onLoad={onLoad}
        />
      </div>
    </div>
  );
};


