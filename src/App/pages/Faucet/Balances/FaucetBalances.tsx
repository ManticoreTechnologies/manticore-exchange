import React, { useEffect, useState } from 'react';
import './FaucetBalances.css';
import axios, { AxiosError } from 'axios';
import logo from '@/images/Placeholder.webp';
import evr_logo from '@/images/evr_logo.svg';
import FaucetCardExpanded from './FaucetCardExpanded';

const faucet_api_host = import.meta.env.VITE_FAUCET_API_HOST || 'faucet.manticore.exchange';
const faucet_api_port = import.meta.env.VITE_FAUCET_API_PORT || '443';
const faucet_api_proto = import.meta.env.VITE_FAUCET_API_PROTO || 'https';
const faucet_api_url = `${faucet_api_proto}://${faucet_api_host}:${faucet_api_port}`;

const FaucetBalances: React.FC = () => {
    const [assets, setAssets] = useState<{ [key: string]: any[] }>({ "Loading...": [0, logo] });
    const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

    useEffect(() => {
        const fetchBalances = async () => {
            try {
                const assetResponse = await faucet_balances<any>();
                setAssets(assetResponse);
            } catch (error) {
                console.error('Error fetching balances:', error);
            }
        };

        fetchBalances();
    }, []);

    const getBackgroundImage = (asset: string, data: any) => {
        return asset === "EVR" ? evr_logo : 
            (data.ipfs_hash ? `https://rose-decent-prawn-420.mypinata.cloud/ipfs/${data.ipfs_hash}?pinataGatewayToken=HtcAOAK7UkS5a7JrD-_1j4FwStTV2Qw4uNJ7_Esk-TvoCsn87T6wUeoq6w7WN3SO` : logo);
    };

    return (
        <div className="assets-list">
            <div className="assets-grid">
                {Object.entries(assets).map(([asset, data]: any) => (
                    <div 
                        key={asset}
                        className="asset-card"
                        onClick={() => setSelectedAsset(asset)}
                        role="button"
                        tabIndex={0}
                    >
                        <div 
                            className="asset-bg"
                            style={{
                                backgroundImage: `url(${getBackgroundImage(asset, data)})`,
                            }}
                        />
                        <div className="card-content">
                            <div className="card-header">
                                <span className="asset-name">
                                    {asset === "EVR" ? "EVRMORE ($EVR)" : asset}
                                </span>
                                <span className="balance-value">
                                    {data.balance}
                                </span>
                            </div>
                            {data.ipfs_hash && (
                                <div className="card-details">
                                    <span className="detail-label">IPFS:</span>
                                    <span className="detail-hash">{data.ipfs_hash.substring(0, 8)}...</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {selectedAsset && (
                <FaucetCardExpanded
                    asset={selectedAsset}
                    data={assets[selectedAsset]}
                    onClose={() => setSelectedAsset(null)}
                    backgroundImage={getBackgroundImage(selectedAsset, assets[selectedAsset])}
                />
            )}
        </div>
    );
};

const faucet_balances = async<T = unknown>() => {
    const url = `${faucet_api_url}/balance`;
    console.log(url);
    try {
        const response = await axios.get<T>(url);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;
        throw axiosError.cause;
    }
};

export default FaucetBalances;
