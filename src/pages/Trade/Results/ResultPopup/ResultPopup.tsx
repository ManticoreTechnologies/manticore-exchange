import React from 'react';
import './ResultPopup.css';
import ManageListing from '../../ManageListing/ManageListing';
import { useNavigate } from "react-router-dom";

interface ResultPopupProps {
    assetName: string;
    description: string;
    unitPrice: number; // Unit price in satoshis
    listingAddress: string;
    orderStatus: string;
    ipfsHash?: string;
    quantity?: number; // Quantity in satoshis
    sold?: number; // Sold quantity in satoshis
    listingID: string;
    closePopup: () => void;
    addToCart: (listing: any) => void;
    buyNow: (listing: any) => void;
}

const ResultPopup: React.FC<ResultPopupProps> = ({
    assetName,
    description,
    unitPrice,
    listingAddress,
    orderStatus,
    ipfsHash,
    quantity = 0, // Default to 0 if undefined
    sold = 0, // Default to 0 if undefined
    listingID,
    closePopup,
    addToCart,
    buyNow
}) => {

    const navigate = useNavigate();

    const handleViewListing = () => {
        navigate(`/trade/asset/${listingID}`, {
            state: { assetDetails: listing }
        });
    };

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
    const backgroundImage = `https://rose-decent-prawn-420.mypinata.cloud/ipfs/${ipfsHash}?pinataGatewayToken=HtcAOAK7UkS5a7JrD-_1j4FwStTV2Qw4uNJ7_Esk-TvoCsn87T6wUeoq6w7WN3SO`;

    return (
        <div className="result-popup-overlay">
            <div className="result-popup">
                <ManageListing initialListingId={listingID} /> {/* Moved to the top */}
                <div className="popup-header">
                    <h3 className="popup-asset-name">{assetName}</h3>
                    <button className="close-button" onClick={closePopup}>X</button>
                </div>
                <div className="popup-content">
                    <div className="popup-image" style={{ backgroundImage: `url(${backgroundImage})` }}></div>
                    <div className="popup-details">
                        <p className="description"><strong>Description:</strong> {description}</p>
                        <p><strong>Listing Address:</strong> {listingAddress}</p>
                        <p><strong>Status:</strong> {orderStatus}</p>
                        {orderStatus === 'ACTIVE' && (
                            <>
                                {/* View Listing Button */}
                                <div className="popup-view-listing">
                                    <button onClick={handleViewListing}>View Listing</button>
                                </div>

                                {/* Buy Now and Add to Cart Buttons */}
                                <div className="popup-action-buttons">
                                    <button onClick={() => buyNow(listing)} disabled={quantity === 0}>Buy Now</button>
                                    <button onClick={() => addToCart(listing)}>Add to Cart</button>
                                </div>

                                <div className="popup-price-quantity">
                                    <p><strong>Price:</strong> {convertToEVR(unitPrice)} EVR</p>
                                    <p><strong>Available:</strong> {convertToEVR(quantity)} {assetName}</p>
                                    <p><strong>Sold:</strong> {convertToEVR(sold)} {assetName}</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultPopup;

