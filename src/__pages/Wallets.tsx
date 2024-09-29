import React, { useState } from 'react';
import api from '../utility/api'; // Import your API utility
import AssetCard from '../____components/assets/AssetCard';
import '../styles/WalletAssetsListPage.css'; // Ensure you have the CSS file for styling

export interface AssetDetail {
    name: string;
    amount: number;
    units: number;
    has_ipfs: boolean;
    ipfs_hash?: string;
    ipfsUrl?: string;
    reissuable?: boolean;
    listed: boolean;
}

const Wallets: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [assets, setAssets] = useState<AssetDetail[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Dummy values for page and query
  const currentPage = 1;
  const currentQuery = '';

  const fetchAssets = async () => {
    setIsLoading(true);
    setError('');
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const assetsObject = await api.get<{[key: string]: any}>(`/getwalletassets/${walletAddress}`);
      if(assetsObject.data == "INVALID WALLET ERROR"){
        setError("Invalid wallet. Please enter a valid wallet address.")
      }else{
        const assetsEntries = Object.entries(assetsObject || {});
        const assetsDetails: AssetDetail[] = await Promise.all(
          assetsEntries.map(async ([name, quantity]) => {
            const sanitizedAssetName = name.replace(/!/g, '');
            const encodedAssetName = encodeURIComponent(sanitizedAssetName);
            const assetDetails = await api.get<{ units: number, has_ipfs: boolean, ipfs_hash?: string, reissuable: boolean, listed: boolean }>(`/getasset/${encodedAssetName}`);
            return {
              name,
              amount: Number(quantity), // Ensure this is always a number
              units: assetDetails.units,
              has_ipfs: assetDetails.has_ipfs,
              ipfs_hash: assetDetails.ipfs_hash,
              ipfsUrl: assetDetails.ipfs_hash ? `https://ipfs.io/ipfs/${assetDetails.ipfs_hash}` : undefined,
              reissuable: assetDetails.reissuable ?? false, // Ensure no undefined for boolean
              listed: assetDetails.listed ?? false // Ensure no undefined for boolean
            };
          })
        );
        setAssets(assetsDetails);
      }
    } catch (error) {
      setError('Failed to fetch assets. Please try again.');
    }
    setIsLoading(false);
  };
  
  

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (walletAddress) {
      fetchAssets();
    }
  };

  return (
    <div className="wallet-assets-container">
      <form className="wallet-address-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter wallet address..."
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          className="wallet-address-input"
        />
        <button type="submit" className="fetch-assets-button" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Show Assets'}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      <div className="wallet-assets-list">
        {assets.map((asset, index) => (
          <AssetCard 
            key={index} 
            asset={asset} 
            page={currentPage} 
            query={currentQuery} 
            showIPFSOnly={false}
          />
        ))}
      </div>
    </div>
  );
};

export default Wallets;



