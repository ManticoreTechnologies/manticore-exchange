import React from 'react';
import './ResultCard.css';
import placeholderImage from '../../../../images/Placeholder.webp';

interface ResultCardProps {
    assetName: string;
    description: string;
    unitPrice: number;
    listingAddress: string;
    orderStatus: string;
    ipfsHash?: string;
    quantity?: number;
    addToCart: (listing: any) => void;
    buyNow: (listing: any) => void;
}

const ResultCard: React.FC<ResultCardProps> = ({
    assetName,
    description,
    unitPrice,
    listingAddress,
    orderStatus,
    ipfsHash,
    quantity,
    addToCart,
    buyNow
}) => {
    const listing = { assetName, description, unitPrice, listingAddress, orderStatus, ipfsHash, quantity };
    
    const imageSrc = ipfsHash 
        ? `https://api.manticore.exchange:667/ipfs/cid/${ipfsHash}` 
        : placeholderImage;

    return (
        <div className="result-card">
            <div className="image-container">
                <a href={`https://manticore.exchange/asset/${encodeURIComponent(assetName)}`} target="_blank" rel="noopener noreferrer">
                    <img 
                        src={imageSrc} 
                        alt={assetName} 
                        className="result-image" 
                        onError={(e) => { 
                            (e.target as HTMLImageElement).src = placeholderImage; 
                        }} 
                    />
                </a>
            </div>
            <div className="content-container">
                <h3 className="asset-name" title={assetName}>{assetName}</h3>
                <p className="description">{description}</p>
                <div className="price-quantity">
                    <p className="unit-price"><strong>Price:</strong> {unitPrice} EVR</p>
                    <p className="quantity-available"><strong>Available:</strong> {quantity}</p>
                </div>
                {orderStatus === 'ACTIVE' ? (
                    <div className="action-buttons">
                        <button onClick={() => buyNow(listing)} disabled={quantity === 0}>Buy Now</button>
                        <button className="add-to-cart-button" onClick={() => addToCart(listing)}>
                            Add to Cart
                        </button>
                    </div>
                ) : (
                    <p className="listing-status"><strong>Status:</strong> {orderStatus}</p>
                )}
            </div>
        </div>
    );
};

export default ResultCard;
