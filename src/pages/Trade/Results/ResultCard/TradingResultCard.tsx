import React, { useState, useEffect, useRef } from 'react';
import './TradingResultCard.css';
import placeholderImage from '../../../../images/Placeholder.png'
import ResultPopup from '../ResultPopup/ResultPopup';
import LoadingSpinner from '../../../../components/Spinners/LoadingSpinner'; // Import the loading spinner
import GraphemeSplitter from 'grapheme-splitter'; // Import the library
import SearchResultCard from '../Search/ResultCard/ResultCard';
import ResultCard from '../../../Search/Results/ResultCard/ResultCard';
import ManageListing from '../../ManageListing/ManageListing';
import { useNavigate } from 'react-router-dom';
interface TradingResultCardProps {
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
    units: string;
    showDetails: (listing: any) => void; // New prop to show details
}

const TradingResultCard: React.FC<TradingResultCardProps> = ({
    assetName,
    description,
    unitPrice,
    listingAddress,
    orderStatus,
    ipfsHash,
    quantity = 0, // Default to 0 if undefined
    sold = 0, // Default to 0 if undefined
    listingID,
    units,
    addToCart,
    buyNow,
    showDetails
}) => {
    const [showPopup, setShowPopup] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false); // Track loading state
    const [isVideo, setIsVideo] = useState(false); // Track if the file is a video
    const popupRef = useRef<HTMLDivElement>(null); // To reference the popup container
    const [showManageListing, setShowManageListing] = useState(false); // State to control ManageListing visibility
    const navigate = useNavigate();
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
        units,
        listingID
    };

    // IPFS image source handling
    const mediaSrc = ipfsHash 
        ? `https://rose-decent-prawn-420.mypinata.cloud/ipfs/${ipfsHash}?pinataGatewayToken=HtcAOAK7UkS5a7JrD-_1j4FwStTV2Qw4uNJ7_Esk-TvoCsn87T6wUeoq6w7WN3SO` 
        : placeholderImage;

    // Fetch the content type to determine if the file is a video or image
    useEffect(() => {
        if (ipfsHash) {
            fetch(mediaSrc, { method: 'HEAD' })
                .then((response) => {
                    const contentType = response.headers.get('Content-Type');
                    if (contentType && contentType.startsWith('video')) {
                        setIsVideo(true);
                    }
                })
                .catch(() => setIsLoaded(true)); // In case of error, mark as loaded
        }
    }, [ipfsHash, mediaSrc]);

    const truncateDescription = (text: string, maxLength: number): string => {
        const splitter = new GraphemeSplitter();
        const graphemes = splitter.splitGraphemes(text);
        if (graphemes.length <= maxLength) return text;
        return graphemes.slice(0, maxLength).join('') + '...';
    };

    const handleShowPopup = () => {
        showDetails(listing); // Call the new prop function
    };

    const handleShowManageListing = () => {
        console.log('Opening Manage Listing'); // Debugging log
        setShowManageListing(true);
    };

    return (
        <>
            <div className="trading-result-card"> 
                <ResultCard
                    name={assetName}
                    blockHeight={0}
                    blockHash={''}
                    amount={quantity}
                    reissuable={false}
                    units={0}
                    ipfsHash={ipfsHash}
                    onClick={handleShowPopup}
                    overlayButtons={{
                        wrench: handleShowManageListing, // Use the handler to show ManageListing
                        addToCart: () => {
                            console.log('add to cart');
                            addToCart(listing); // Call addToCart with the listing
                        }
                    }}
                    quantityWord={
                        quantity > 0 ? (
                            <div className="in-stock-text">
                                <span className="status-dot in-stock-dot"></span>In Stock
                            </div>
                        ) : (
                            <div className="out-of-stock-text">
                                <span className="status-dot out-of-stock-dot"></span>Out of Stock
                            </div>
                        )
                    }
                />
                {showManageListing && (
                    <ManageListing initialListingId={listingID} />
                )}
                {showPopup && (
                    <div className="trading-popup-overlay">
                        <div ref={popupRef} className="trading-popup-container">
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
                                closePopup={() => {
                                    const overlay = document.querySelector('.trading-popup-overlay');
                                    if (overlay) {
                                        overlay.classList.remove('show');
                                    }
                                    setTimeout(() => setShowPopup(false), 300); // Wait for animation to finish
                                }}
                                addToCart={addToCart}
                                buyNow={buyNow}
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default TradingResultCard;