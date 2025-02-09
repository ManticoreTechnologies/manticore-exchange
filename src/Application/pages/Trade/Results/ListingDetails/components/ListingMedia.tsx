import React from 'react';
import ManticoreLogo from '@/Application/logos/white-manticore.png';

interface ListingMediaProps {
  imageHash: string | null;
  name: string;
  pinataGateway: string;
}

const ListingMedia: React.FC<ListingMediaProps> = ({ imageHash, name, pinataGateway }) => {
  return (
    <div className="listing-media">
      {imageHash ? (
        <img
          src={`${pinataGateway}${imageHash}`}
          alt={name}
          className="listing-image"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = ManticoreLogo;
            target.className = "placeholder-image";
          }}
        />
      ) : (
        <img
          src={ManticoreLogo}
          alt="Manticore Logo"
          className="placeholder-image"
        />
      )}
    </div>
  );
};

export default ListingMedia; 