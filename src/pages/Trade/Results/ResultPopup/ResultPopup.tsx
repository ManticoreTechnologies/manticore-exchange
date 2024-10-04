import React, { useState, useEffect } from 'react';
import './ResultPopup.css';
import ManageListing from '../../ManageListing/ManageListing';

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
    const [isVideo, setIsVideo] = useState(false);

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

    // IPFS media source handling
    const mediaSrc = `https://rose-decent-prawn-420.mypinata.cloud/ipfs/${ipfsHash}?pinataGatewayToken=HtcAOAK7UkS5a7JrD-_1j4FwStTV2Qw4uNJ7_Esk-TvoCsn87T6wUeoq6w7WN3SO`;

    // Fetch the content type to determine if the file is a video or image
    useEffect(() => {
        if (ipfsHash) {
            fetch(mediaSrc, { method: 'HEAD' })
                .then((response) => {
                    const contentType = response.headers.get('Content-Type');
                    if (contentType && contentType.startsWith('video')) {
                        setIsVideo(true);
                    }
                });
        }
    }, [ipfsHash, mediaSrc]);

    return (
        <div className="result-popup-overlay">
            <div className="result-popup">
                {isVideo ? (
                    <video
                        width="100%"
                        height="auto"
                        autoPlay
                        muted
                        loop
                        style={{ borderRadius: '10px' }}
                    >
                        <source src={mediaSrc} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <div style={{ backgroundImage: `url(${mediaSrc})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '10px', height: '200px' }} />
                )}
                <ManageListing initialListingId={listingID} />
                <div className="popup-header">
                    <h3 className="popup-asset-name">{assetName}</h3>
                    <button className="close-button" onClick={closePopup}>X</button>
                </div>
                <div className="popup-content">
                    <div className="popup-description">
                        <p><strong>Description:</strong> {description}</p>
                    </div>
                    <div className="popup-details">
                        <p><strong>Listing Address:</strong> {listingAddress}</p>
                        <p><strong>Status:</strong> {orderStatus}</p>
                        {orderStatus === 'ACTIVE' && (
                            <>
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
