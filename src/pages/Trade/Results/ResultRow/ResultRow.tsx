import React, { useState, useEffect, useRef } from 'react';
import './ResultRow.css';
import placeholderImage from '../../../../images/Placeholder.png';
import ResultPopup from '../ResultPopup/ResultPopup';

interface ResultRowProps {
    result: any;
    addToCart: (listing: any) => void;
    buyNow: (listing: any) => void;
}

const ResultRow: React.FC<ResultRowProps> = ({ result, addToCart, buyNow }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [ipfsHash, setIpfsHash] = useState<string | undefined>(undefined);
    const popupRef = useRef<HTMLDivElement>(null);

    // Helper function to convert satoshis to EVR
    const convertToEVR = (satoshis: number): string => {
        return (satoshis / 100000000).toFixed(8).replace(/\.?0+$/, '');
    };

    const listing = {
        assetName: result.asset_name,
        description: result.description,
        unitPrice: result.unit_price,
        listingAddress: result.listing_address,
        orderStatus: result.listing_status,
        ipfsHash: ipfsHash,
        quantity: result.remaining_quantity,
        sold: result.sold,
        listingID: result.listing_id,
    };

    // Parse asset data and retrieve IPFS hash if available
    useEffect(() => {
        if (result.asset_data) {
            try {
                const assetDataParsed = JSON.parse(result.asset_data);
                if (assetDataParsed.has_ipfs) {
                    setIpfsHash(assetDataParsed.ipfs_hash);
                } else {
                    setIpfsHash(undefined);
                }
            } catch (error) {
                console.error('Error parsing asset data:', error);
                setIpfsHash(undefined); // Fallback to no IPFS image
            }
        }
    }, [result.asset_data]);

    // Handle IPFS image or fallback to placeholder image
    const imageSrc = ipfsHash
        ? `https://rose-decent-prawn-420.mypinata.cloud/ipfs/${ipfsHash}?pinataGatewayToken=HtcAOAK7UkS5a7JrD-_1j4FwStTV2Qw4uNJ7_Esk-TvoCsn87T6wUeoq6w7WN3SO`
        : placeholderImage;

    // Close popup when clicking outside
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
            <tr className="result-row" onClick={() => setShowPopup(true)}>
                <td className="image-cell">
                    <img src={imageSrc} alt={result.asset_name} />
                </td>
                <td className="asset-cell">{result.asset_name}</td>
                <td className="price-cell">{convertToEVR(result.unit_price)} EVR</td>
                <td className="quantity-cell">{convertToEVR(result.remaining_quantity)}</td>
                <td className={`status-cell ${result.listing_status === 'ACTIVE' ? 'active' : 'inactive'}`}>
                    {result.listing_status}
                </td>
                <td className="actions-cell">
                    <button onClick={(e) => { e.stopPropagation(); buyNow(listing); }} disabled={result.remaining_quantity === 0}>
                        Buy Now
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); addToCart(listing); }}>Add to Cart</button>
                </td>

            </tr>

            {showPopup && (
                <div className="popup-overlay">
                    <div ref={popupRef} className="popup-container">
                        <ResultPopup
                            assetName={result.asset_name}
                            description={result.description}
                            unitPrice={result.unit_price}
                            listingAddress={result.listing_address}
                            orderStatus={result.listing_status}
                            ipfsHash={ipfsHash}
                            quantity={result.remaining_quantity}
                            sold={result.sold}
                            listingID={result.listing_id}
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

export default ResultRow;


