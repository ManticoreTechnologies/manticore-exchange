import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/RandomAssetCard.css';
import logo from '../../images/Placeholder.webp';
import { Asset } from '../../pages/ExplorePage';

interface RandomAssetCardProps {
  asset: Asset; 
}

const RandomAssetCard: React.FC<RandomAssetCardProps> = ({ asset }) => {
  const imageUrl = asset.has_ipfs && asset.ipfs_hash ? 
    `https://api.manticore.exchange:667/ipfs/cid/${asset.ipfs_hash}` : 
    logo;


  return (
    <Link to={`/asset/${encodeURIComponent(asset.name)}?query=&page=1&showIPFSOnly=false`} className="assetc-card-link">
      <div className="assetc-card">
        <div className="assetc-image-container">
          <img src={imageUrl} alt={`${asset.name} logo`} className="assetc-image" />
        </div>
        <div className="assetc-details">
          <h2 className="assetc-name">{asset.name}</h2>
          <div className="assetc-info">
            <span className="assetc-amount">Amount: {asset.amount}</span>
            <span className="assetc-reissuable">Reissuable: {asset.reissuable ? 'Yes' : 'No'}</span>
            <span className="assetc-decimals">Decimals: {asset.units}</span>
          </div>
          <div className={`assetc-status ${asset.reissuable ? 'listed' : 'unlisted'}`}>
            {asset.reissuable ? 'LISTED' : 'UNLISTED'}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RandomAssetCard;




