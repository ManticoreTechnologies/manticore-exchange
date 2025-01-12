import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './FaucetBalances.css';
import axios from 'axios';
import { splitAssetName } from './utils';

interface FaucetCardExpandedProps {
    asset: string;
    data: any;
    onClose: () => void;
    backgroundImage: string;
}

const faucet_api_host = import.meta.env.VITE_FAUCET_API_HOST || 'faucet.manticore.exchange';
const faucet_api_port = import.meta.env.VITE_FAUCET_API_PORT || '443';
const faucet_api_proto = import.meta.env.VITE_FAUCET_API_PROTO || 'https';
const faucet_api_url = `${faucet_api_proto}://${faucet_api_host}:${faucet_api_port}`;

const FaucetCardExpanded: React.FC<FaucetCardExpandedProps> = ({
    asset,
    data,
    onClose,
    backgroundImage
}) => {
    const [address, setAddress] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const assetParts = splitAssetName(asset);

    const encodedAssetPath = asset.split('/').map(part => encodeURIComponent(part)).join('%2F');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!address) return;

        setIsSubmitting(true);
        setMessage('');

        try {
            const response = await axios.post(`${faucet_api_url}/request`, {
                address,
                assetName: asset
            });

            if (response.data.success) {
                setMessage('Claim successful! Check your wallet.');
                setAddress('');
            } else {
                setMessage(response.data.message || 'Failed to claim. Please try again.');
            }
        } catch (error: any) {
            setMessage(error.response?.data?.message || 'An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="expanded-card-overlay" onClick={onClose}>
            <div className="expanded-card" onClick={e => e.stopPropagation()}>
                <button className="faucet-close-button" onClick={onClose}>×</button>
                
                <div 
                    className="expanded-card-bg"
                    style={{
                        backgroundImage: `url(${backgroundImage})`
                    }}
                />
                
                <div className="expanded-card-content">
                    <div className="expanded-card-header">
                        <div className="asset-path">
                            {assetParts.parents.map((parent, index) => {
                                // Build the path up to this parent
                                const pathSegments = assetParts.parents.slice(0, index + 1);
                                const encodedPath = pathSegments.map(segment => encodeURIComponent(segment)).join('%2F');
                                
                                return (
                                    <React.Fragment key={index}>
                                        <Link 
                                            to={`/asset/${encodedPath}`}
                                            onClick={(e) => e.stopPropagation()}
                                            className="asset-parent-link"
                                        >
                                            {parent}
                                        </Link>
                                        <span className="asset-parent-separator">/</span>
                                    </React.Fragment>
                                );
                            })}
                        </div>
                        <div className="asset-name">{assetParts.name}</div>
                    </div>
                    
                    <div className="expanded-card-details">
                        <div className="detail-item balance-detail">
                            <span className="detail-label">Available Balance:</span>
                            <span className="detail-value">{data.balance}</span>
                        </div>
                        {data.metadata && Object.entries(data.metadata).map(([key, value]: [string, any]) => (
                            <div key={key} className="detail-item">
                                <span className="detail-label">{key}:</span>
                                <span className="detail-value">{value.toString()}</span>
                            </div>
                        ))}
                    </div>

                    <div className="expanded-card-form">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Enter your evrmore address"
                                    disabled={isSubmitting}
                                />
                            </div>
                            <button 
                                type="submit" 
                                className="submit-button"
                                disabled={isSubmitting || !address}
                            >
                                {isSubmitting ? 'Claiming...' : `Claim ${asset}`}
                            </button>
                            {message && (
                                <div className={`form-message ${message.includes('successful') ? 'success' : 'error'}`}>
                                    {message}
                                </div>
                            )}
                        </form>
                    </div>

                    <a 
                        href={`/asset/${encodedAssetPath}`} 
                        className="asset-details-link"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                    >
                        View Full Asset Details →
                    </a>
                </div>
            </div>
        </div>
    );
};

export default FaucetCardExpanded; 