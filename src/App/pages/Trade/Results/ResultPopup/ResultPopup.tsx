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
        <div className="trading-result-popup-overlay show">
            <div
                className="trading-result-popup"
                style={{
                    backgroundImage: isVideo ? 'none' : `url(${mediaSrc})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '15px',
                    color: 'white',
                    padding: '20px',
                }}
            >
                {isVideo && (
                    <video
                        className="trading-popup-video"
                        autoPlay
                        muted
                        loop
                    >
                        <source src={mediaSrc} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                )}
                <ManageListing initialListingId={listingID} />
                <div className="trading-popup-header">
                    <h3 className="trading-popup-asset-name">{assetName}</h3>
                    <button className="trading-close-button" onClick={closePopup}>X</button>
                </div>
                <div className="trading-popup-content">
                    <div className="trading-popup-description">
                        <div className="trading-description-scrollable">
                            <p dangerouslySetInnerHTML={{ __html: description.replace(/\n/g, '<br />') }} />
                        </div>
                    </div>
                    <div className="trading-popup-details">
                        <p><strong>Listing Address:</strong> {listingAddress}</p>
                        <p><strong>Status:</strong> {orderStatus}</p>
                        {orderStatus === 'ACTIVE' && (
                            <>
                                <div className="trading-popup-action-buttons">
                                    <button onClick={() => buyNow(listing)} disabled={quantity === 0}>Buy Now</button>
                                    <button onClick={() => addToCart(listing)}>Add to Cart</button>
                                </div>
                                <div className="trading-popup-price-quantity">
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
