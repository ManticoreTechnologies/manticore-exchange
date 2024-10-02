import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import './TradeAsset.css'; // We'll add some styling here

interface TradeAssetProps {
  listingId: string;
}

const TradeAsset: React.FC = () => {
  const { listingId } = useParams<TradeAssetProps>(); // Get listingId from URL params
  const navigate = useNavigate();
  const [assetDetails, setAssetDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const trading_api_host = import.meta.env.VITE_TRADING_API_HOST || 'api.manticore.exchange';
  const trading_api_port = import.meta.env.VITE_TRADING_API_PORT || '668';
  const trading_api_proto = import.meta.env.VITE_TRADING_API_PROTO || 'https';
  const trading_api_url = `${trading_api_proto}://${trading_api_host}:${trading_api_port}`;

  useEffect(() => {
    const fetchAssetDetails = async () => {
      try {
        const response = await axios.get(`${trading_api_url}/listing/${listingId}`); // Adjust the API endpoint as needed
        console.log(response.data.asset_data);
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
    // Add your logic here for purchasing
    console.log("Buying asset", assetDetails);
    alert(`Proceeding to buy asset: ${assetDetails.asset_name}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Navigate back to /trade
  const handleBack = () => {
    navigate('/trade');
  };

  return (
    <div className="trade-asset-page">
      <button className="back-button" onClick={handleBack}>Back to Trade</button>
      <h1>Asset Details for {listingId}</h1>
      {assetDetails ? (
        <div className="asset-details-container">
          <div className="asset-image-container">
            <img
              src={`https://ipfs.io/ipfs/${assetDetails.asset_data.ipfs_hash}`}
              alt={assetDetails.asset_name}
              className="asset-image"
            />
          </div>
          <div className="asset-info">
            <p><strong>Asset Name:</strong> {assetDetails.asset_name}</p>
            <p><strong>Description:</strong> {assetDetails.description}</p>
            <p><strong>Price:</strong> {assetDetails.price} EVR</p>
            <p><strong>Available:</strong> {assetDetails.available_quantity} units</p>
            <p><strong>Sold:</strong> {assetDetails.sold_quantity} units</p>
            {/* Add more details as necessary */}
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


