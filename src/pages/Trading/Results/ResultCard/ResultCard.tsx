import React from 'react';
import './ResultCard.css';
import placeholderImage from '../../../../images/Placeholder.webp';

interface ResultCardProps {
    assetName: string;
    description: string;
    unitPrice: number; // Unit price in satoshis
    listingAddress: string;
    orderStatus: string;
    ipfsHash?: string;
    quantity?: number; // Quantity in satoshis
    sold?: number; // Sold quantity in satoshis
    listingID: string;
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
    quantity = 0, // Default to 0 if undefined
    sold = 0, // Default to 0 if undefined
    listingID,
    addToCart,
    buyNow
}) => {
    // Helper function to convert satoshis to EVR
    const convertToEVR = (satoshis: number): string => {
        return (satoshis / 100000000).toFixed(8).replace(/\.?0+$/, ''); // Removes trailing zeros
    };

    const listing = {
        assetName,
        description,
        unitPrice,
        listingAddress,
        orderStatus,
        ipfsHash,
        quantity,
        listingID
    };

    // IPFS image source handling
    const backgroundImage = ipfsHash 
        ? `https://rose-decent-prawn-420.mypinata.cloud/ipfs/${ipfsHash}?pinataGatewayToken=HtcAOAK7UkS5a7JrD-_1j4FwStTV2Qw4uNJ7_Esk-TvoCsn87T6wUeoq6w7WN3SO` 
        : placeholderImage;

    return (
        <div className="result-card" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="content-container">
                <h3 className="asset-name" title={assetName}>{assetName}</h3>
                <p className="description">{description}</p>
                {orderStatus === 'ACTIVE' ? (
                    <>
                        <div className="action-buttons">
                            <button onClick={() => buyNow(listing)} disabled={quantity === 0}>Buy Now</button>
                            <button className="add-to-cart-button" onClick={() => addToCart(listing)}>
                                Add to Cart
                            </button>
                        </div>
                        <div className="price-quantity">
                            <p className="unit-price"><strong>Price: </strong> {convertToEVR(unitPrice)} EVR</p>
                            <p className="quantity-available"><strong>Available:</strong> {convertToEVR(quantity)} {assetName}</p>
                            <p className="quantity-sold"><strong>Sold:</strong> {convertToEVR(sold)} {assetName}</p>
                        </div>
                    </>
                ) : (
                    <p className="listing-status"><strong>Status:</strong> {orderStatus}</p>
                )}
            </div>
        </div>
    );
};

export default ResultCard;
