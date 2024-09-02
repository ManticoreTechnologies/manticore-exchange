/* eslint-disable no-constant-condition */
// AssetDetail.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import '../../styles/AssetDetail.css'; // CSS for this page
import logo from '../../images/Placeholder.webp';
import api from '../../utility/api';

interface Asset {
  name: string;
  amount: number;
  block_height: number;
  blockhash: string;
  txid_hash: string;
  ipfs_hash?: string;
  reissuable: boolean;
  units: number;
  has_ipfs: boolean;
}

const AssetDetails: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const from_faucet = searchParams.get('faucet');
  const faucet = from_faucet ? from_faucet : false;
  const page = searchParams.get('page');
  const query = searchParams.get('query');
  const showIPFSOnly = searchParams.get('showIPFSOnly') === 'true';

  const fetchAssets = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const sanitizedAssetName = name ? name.replace(/!/g, '') : '';
      const response = await api.node<any>('listassets', [sanitizedAssetName, true]);
      
      setAsset(response[sanitizedAssetName]);
    } catch (error: unknown) {
      setError('Failed to load asset details');
      console.error('Error fetching asset details:', error);
    } finally {
      setIsLoading(false);
    }
  }, [name, showIPFSOnly]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const imageUrl = asset && asset.has_ipfs && asset.ipfs_hash ? `https://rose-decent-prawn-420.mypinata.cloud/ipfs/${asset.ipfs_hash}?pinataGatewayToken=HtcAOAK7UkS5a7JrD-_1j4FwStTV2Qw4uNJ7_Esk-TvoCsn87T6wUeoq6w7WN3SO` : logo;

  return (
    <div className="asset-detail-container">
      <div className="asset-detail-card">
        <div className="asset-image-container">
          <img src={imageUrl} alt={`${asset ? asset.name : 'Asset'} logo`} className="asset-detail-image" />
        </div>
        <div className="asset-info-container">
          <h1 className="asset-title">{asset ? asset.name : 'Asset Name'}</h1>
          {asset && (
            <div className="asset-meta">
              <p><strong>Amount:</strong> {asset.amount}</p>
              <p><strong>Block Height:</strong> {asset.block_height}</p>
              <p><strong>Block Hash:</strong> {asset.blockhash}</p>
              <p><strong>{asset.has_ipfs && asset.ipfs_hash ? "IPFS Hash: " : "TXID: "}</strong>
                {asset.ipfs_hash || asset.txid_hash}</p>
              <p><strong>Reissuable:</strong> {asset.reissuable ? 'Yes' : 'No'}</p>
              <p><strong>Decimals:</strong> {asset.units}</p>
              <p><strong>Status:</strong> {false ? 'Listed' : 'Unlisted'}</p>
            </div>
          )}
          <div className="asset-description">
            <button onClick={() => navigate(faucet?`/faucet`:`/explore?query=${query}&page=${page}&showIPFSOnly=${showIPFSOnly}`)}>Back</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDetails;
