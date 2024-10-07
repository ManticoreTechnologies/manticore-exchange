import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import './TradeAsset.css'; // We'll add some styling here

interface TradeAssetProps {
    listingId: string;
}

// Helper function to convert satoshis to EVR
const convertToEVR = (satoshis: number): string => {
    return (satoshis / 100000000).toFixed(8).replace(/\.?0+$/, ''); // Removes trailing zeros
};

const TradeAsset: React.FC = () => {
    const { listingId } = useParams<TradeAssetProps>(); // Get listingId from URL params
    const navigate = useNavigate();
    const [assetDetails, setAssetDetails] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [imageLoading, setImageLoading] = useState<boolean>(true);

    const trading_api_host = import.meta.env.VITE_TRADING_API_HOST || 'api.manticore.exchange';
    const trading_api_port = import.meta.env.VITE_TRADING_API_PORT || '668';
    const trading_api_proto = import.meta.env.VITE_TRADING_API_PROTO || 'https';
    const trading_api_url = `${trading_api_proto}://${trading_api_host}:${trading_api_port}`;

    useEffect(() => {
        const fetchAssetDetails = async () => {
            try {
                const response = await axios.get(`${trading_api_url}/listing/${listingId}`);
                console.log(response.data);
                setAssetDetails(response.data);
                setLoading(false);
            } catch (err) {
                setError("Error fetching asset details");
                setLoading(false);
            }
        };

        if (listingId) {
            fetchAssetDetails();
        }
    }, [listingId]);

    const handleBuy = () => {
        console.log("Buying asset", assetDetails);
        alert(`Proceeding to buy asset: ${assetDetails.asset_name}`);
    };

    const handleBack = () => {
        navigate('/trade');
    };

    const handleImageLoad = () => {
        setImageLoading(false);
    };

    if (loading) {
        return <div>Loading asset details...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const imageUrl = `https://rose-decent-prawn-420.mypinata.cloud/ipfs/${assetDetails.asset_data.ipfs_hash}?pinataGatewayToken=HtcAOAK7UkS5a7JrD-_1j4FwStTV2Qw4uNJ7_Esk-TvoCsn87T6wUeoq6w7WN3SO`;
    return (
        <div className="trade-asset-page">
            <button className="back-button" onClick={handleBack}>Back to Trade</button>
            <h1>Asset Details for {listingId}</h1>
            {assetDetails ? (
                <div className="asset-details-container">
                    <div className="asset-image-container">
                        {imageLoading && <div>Loading image...</div>}
                        {assetDetails.asset_data.ipfs_hash && (
                            <img
                                src={imageUrl}
                                alt={assetDetails.asset_name}
                                className="asset-image"
                                onLoad={handleImageLoad}
                            />
                        )}
                    </div>
                    <div className="asset-info">
                        <p><strong>Asset Name:</strong> {assetDetails.asset_name}</p>
                        <p><strong>Description:</strong> {assetDetails.description}</p>
                        <p><strong>Price:</strong> {convertToEVR(assetDetails.unit_price)} EVR</p>
                        <p><strong>Available:</strong> {convertToEVR(assetDetails.remaining_quantity)} units</p>
                        <p><strong>Sold:</strong> {convertToEVR(assetDetails.sold)} units</p>
                        <button className="buy-button" onClick={handleBuy}>Buy Now</button>
                    </div>
                </div>
            ) : (
                <p>No asset details available.</p>
            )}
        </div>
    );
};

export default TradeAsset;



