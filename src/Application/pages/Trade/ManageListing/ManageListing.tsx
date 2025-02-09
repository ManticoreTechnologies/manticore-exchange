import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiTool, FiDollarSign, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '@/Application/contexts/AuthContext';
import './ManageListing.css';

interface Balance {
    asset_name: string;
    confirmed_balance: string;
    pending_balance: string;
    units: number;
    last_confirmed_tx_hash: string | null;
    last_confirmed_tx_time: string | null;
}

interface ManageListingProps {
    initialListingId: string;
    onClose: () => void;
}

const ManageListing: React.FC<ManageListingProps> = ({ initialListingId, onClose }) => {
    const { token } = useAuth();
    const [listingId] = useState<string>(initialListingId);
    const [password, setPassword] = useState<string>('');
    const [listingData, setListingData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [showWithdrawModal, setShowWithdrawModal] = useState<boolean>(false);
    const [selectedAsset, setSelectedAsset] = useState<Balance | null>(null);
    const [withdrawAmount, setWithdrawAmount] = useState<string>('');

    const trading_api_host = import.meta.env.VITE_TRADING_API_HOST || 'localhost';
    const trading_api_port = import.meta.env.VITE_TRADING_API_PORT || '8000';
    const trading_api_proto = import.meta.env.VITE_TRADING_API_PROTO || 'http';
    const trading_api_url = `${trading_api_proto}://${trading_api_host}:${trading_api_port}`;

    useEffect(() => {
        if (initialListingId && token) {
            handleFetchListing();
        }
    }, [initialListingId, token]);

    const handleFetchListing = async () => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            const response = await axios.get(`${trading_api_url}/listings/by-id/${listingId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const fetchedListingData = response.data;
            // Add balances if they don't exist
            if (!fetchedListingData.balances) {
                fetchedListingData.balances = [
                    { asset_name: 'EVR', amount: fetchedListingData.evr_balance || 0 },
                    { asset_name: 'BTC', amount: fetchedListingData.btc_balance || 0 }
                ];
            }
            
            setListingData(fetchedListingData);
        } catch (error: any) {
            console.error('Error fetching listing:', error);
            setError(error.response?.data?.message || 'Failed to fetch listing.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateListing = async () => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            const response = await axios.patch(
                `${trading_api_url}/listings/${listingId}`,
                {
                    description: listingData.description,
                    ipfs_hash: listingData.ipfs_hash,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setSuccessMessage('Listing updated successfully');
            setListingData(response.data);
        } catch (error: any) {
            console.error('Error updating listing:', error);
            setError(error.response?.data?.message || 'Failed to update listing.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleWithdraw = async () => {
        if (!selectedAsset || !withdrawAmount) return;

        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await axios.post(
                `${trading_api_url}/listings/${listingId}/withdraw`,
                {
                    asset_name: selectedAsset.asset_name,
                    amount: parseFloat(withdrawAmount)
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setSuccessMessage(`Successfully withdrew ${withdrawAmount} ${selectedAsset.asset_name}. Transaction ID: ${response.data.transaction_id}`);
            setShowWithdrawModal(false);
            
            // Refresh listing data
            await handleFetchListing();
        } catch (error: any) {
            console.error('Error withdrawing assets:', error);
            setError(error.response?.data?.detail || 'Failed to withdraw assets.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBalanceClick = (balance: Balance) => {
        setSelectedAsset(balance);
        setWithdrawAmount('');
        setShowWithdrawModal(true);
    };

    const renderBalances = () => {
        if (!listingData?.balances || listingData.balances.length === 0) {
            return null;
        }

        return (
            <div className="available-balances">
                <h3>
                    <FiDollarSign />
                    Available Balances
                </h3>
                <div className="balance-list">
                    {listingData.balances.map((balance: Balance) => (
                        <div 
                            key={balance.asset_name} 
                            className="balance-item"
                            onClick={() => handleBalanceClick(balance)}
                        >
                            <div className="asset-info">
                                <span className="asset-name">{balance.asset_name}</span>
                                <span className="withdraw-hint">Click to withdraw</span>
                            </div>
                            <span className="asset-amount">
                                {parseFloat(balance.confirmed_balance).toFixed(8)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="manage-listing-container">
            <button className="back-button" onClick={onClose}>
                <FiArrowLeft /> Back to Trading
            </button>
            
            <div className="manage-listing-content">
                {isLoading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading listing details...</p>
                    </div>
                ) : listingData ? (
                    <div>
                        <h2>Manage Listing</h2>
                        
                        {renderBalances()}

                        <div className="form-grid">
                            <div>
                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    placeholder="Update Description"
                                    value={listingData.description}
                                    onChange={(e) => setListingData({ ...listingData, description: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="ipfs_hash">IPFS Hash</label>
                                <input
                                    id="ipfs_hash"
                                    type="text"
                                    name="ipfs_hash"
                                    placeholder="Update IPFS Hash"
                                    value={listingData.ipfs_hash}
                                    onChange={(e) => setListingData({ ...listingData, ipfs_hash: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="listing-address">
                            <h3>Refill Address</h3>
                            <p>{listingData.listing_address}</p>
                        </div>

                        <div className="button-group">
                            <button onClick={handleUpdateListing} disabled={isLoading}>
                                {isLoading ? 'Updating...' : 'Update Listing'}
                            </button>
                        </div>

                        {successMessage && <p className="success-message">{successMessage}</p>}
                        {error && <p className="error-message">{error}</p>}
                    </div>
                ) : (
                    <div className="error-message">
                        Failed to load listing details
                    </div>
                )}
            </div>

            {showWithdrawModal && selectedAsset && (
                <div className="withdrawal-modal">
                    <h3>Withdraw {selectedAsset.asset_name}</h3>
                    <div className="input-group">
                        <label>
                            Available Balance: {parseFloat(selectedAsset.confirmed_balance).toFixed(8)} {selectedAsset.asset_name}
                        </label>
                        <input
                            type="number"
                            step={`${1 / Math.pow(10, selectedAsset.units)}`}
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            placeholder={`Enter amount to withdraw`}
                            max={parseFloat(selectedAsset.confirmed_balance)}
                        />
                    </div>
                    <div className="button-group">
                        <button 
                            className="withdraw-button"
                            onClick={handleWithdraw}
                            disabled={
                                isLoading || 
                                !withdrawAmount || 
                                parseFloat(withdrawAmount) > parseFloat(selectedAsset.confirmed_balance)
                            }
                        >
                            {isLoading ? 'Processing...' : 'Withdraw'}
                        </button>
                        <button 
                            className="cancel-button"
                            onClick={() => setShowWithdrawModal(false)}
                        >
                            Cancel
                        </button>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                </div>
            )}
        </div>
    );
};

export default ManageListing;
