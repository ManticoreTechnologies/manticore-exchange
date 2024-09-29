import React, { useState, useEffect, useRef } from 'react';
import './ResultCard.css';
import placeholderImage from '../../../../images/Placeholder.png'
import ResultPopup from '../ResultPopup/ResultPopup';

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
    const [showPopup, setShowPopup] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null); // To reference the popup container

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

    // Close popup if clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                setShowPopup(false);
            }
        };

        if (showPopup) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showPopup]);

    return (
        <>
            <div className="result-card" style={{ backgroundImage: `url(${backgroundImage})` }} onClick={() => setShowPopup(true)}>
                <h3 className="asset-name" title={assetName}>{assetName}</h3>
                <div className="content-container">
                    <p className="description">{description}</p>
                    {orderStatus === 'ACTIVE' ? (
                        <>
                            <div className="action-buttons">
                                <button onClick={(e) => { e.stopPropagation(); buyNow(listing); }} disabled={quantity === 0}>Buy Now</button>
                                <button className="add-to-cart-button" onClick={(e) => { e.stopPropagation(); addToCart(listing); }}>
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

            {showPopup && (
                <div className="popup-overlay">
                    <div ref={popupRef} className="popup-container">
                        <ResultPopup
                            assetName={assetName}
                            description={description}
                            unitPrice={unitPrice}
                            listingAddress={listingAddress}
                            orderStatus={orderStatus}
                            ipfsHash={ipfsHash}
                            quantity={quantity}
                            sold={sold}
                            listingID={listingID}
                            closePopup={() => setShowPopup(false)}
                            addToCart={addToCart}
                            buyNow={buyNow}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default ResultCard;
