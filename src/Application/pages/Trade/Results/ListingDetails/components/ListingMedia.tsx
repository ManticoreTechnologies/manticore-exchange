import React from 'react';
import placeholderImage from '@/Application/logos/white-manticore.png';

interface ListingMediaProps {
  imageUrl: string;
  altText: string;
  onLoad: () => void;
  mediaLoaded: boolean;
}

const ListingMedia: React.FC<ListingMediaProps> = ({
  imageUrl,
  altText,
  onLoad,
  mediaLoaded
}) => {
  return (
    <div className="listing-media-container">
      <div className="listing-media">
        <img
          src={imageUrl}
          alt={altText}
          className={`listing-image ${mediaLoaded ? 'loaded' : ''}`}
          onLoad={onLoad}
          onError={(e) => {
            e.currentTarget.src = placeholderImage;
            onLoad();
          }}
        />
      </div>
    </div>
  );
};

export default ListingMedia; 