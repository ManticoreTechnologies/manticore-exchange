import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiTool, FiDollarSign, FiArrowLeft, FiStar, FiCopy } from 'react-icons/fi';
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

interface FeaturedPlan {
    name: string;
    amount_evr: string;
    duration_days: number;
    priority_level: number;
}

interface FeaturedPayment {
    id: string;
    listing_id: string;
    payment_address: string;
    amount_evr: string;
    duration_days: number;
    priority_level: number;
    status: string;
    created_at: string;
    expires_at: string | null;
}

interface Notification {
    show: boolean;
    type: 'success' | 'error';
    message: string;
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
    const [featuredPlans, setFeaturedPlans] = useState<Record<string, FeaturedPlan>>({});
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [featuredPayment, setFeaturedPayment] = useState<FeaturedPayment | null>(null);
    const [showFeaturedModal, setShowFeaturedModal] = useState(false);
    const [notification, setNotification] = useState<Notification>({
        show: false,
        type: 'success',
        message: ''
    });
    const [pendingPayment, setPendingPayment] = useState<FeaturedPayment | null>(null);

    const trading_api_host = import.meta.env.VITE_TRADING_API_HOST || 'localhost';
    const trading_api_port = import.meta.env.VITE_TRADING_API_PORT || '8000';
    const trading_api_proto = import.meta.env.VITE_TRADING_API_PROTO || 'http';
    const trading_api_url = `${trading_api_proto}://${trading_api_host}:${trading_api_port}`;

    useEffect(() => {
        if (initialListingId && token) {
            handleFetchListing();
        }
    }, [initialListingId, token]);

    useEffect(() => {
        const fetchFeaturedPlans = async () => {
            try {
                const response = await axios.get(`${trading_api_url}/featured/plans`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setFeaturedPlans(response.data);
            } catch (error) {
                console.error('Error fetching featured plans:', error);
            }
        };

        if (token) {
            fetchFeaturedPlans();
        }
    }, [token]);

    useEffect(() => {
        const fetchPendingPayment = async () => {
            try {
                const response = await axios.get(
                    `${trading_api_url}/featured/payments`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        params: {
                            listing_id: listingId,
                            status: 'pending'
                        }
                    }
                );
                
                if (response.data && response.data.length > 0) {
                    setPendingPayment(response.data[0]);
                    startPaymentStatusCheck(response.data[0]);
                }
            } catch (error) {
                console.error('Error fetching pending payments:', error);
            }
        };

        if (listingId && token) {
            fetchPendingPayment();
        }
    }, [listingId, token]);

    const startPaymentStatusCheck = (payment: FeaturedPayment) => {
        setFeaturedPayment(payment);
    };

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

    const handleFeatureListing = async () => {
        if (!selectedPlan) return;

        try {
            setIsLoading(true);
            
            if (pendingPayment) {
                setNotification({
                    show: true,
                    type: 'error',
                    message: 'This listing already has a pending featured payment. Please complete or wait for the existing payment to expire.'
                });
                return;
            }

            const response = await axios.post(
                `${trading_api_url}/featured/payments`,
                {
                listing_id: listingId,
                    plan_name: selectedPlan
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            if (response.data) {
                setFeaturedPayment(response.data);
                setPendingPayment(response.data);
                setNotification({
                    show: true,
                    type: 'success',
                    message: 'Featured payment created successfully!'
                });
            }
        } catch (error: any) {
            console.error('Error creating featured payment:', error);
            let errorMessage = 'Failed to create featured payment.';
            
            if (error.response) {
                if (error.response.status === 400 && error.response.data?.detail === "Listing already has a pending featured payment") {
                    errorMessage = 'This listing already has a pending featured payment. Please complete or wait for the existing payment to expire.';
                } else if (error.response.status === 500) {
                    errorMessage = 'Server error while processing payment. Please try again in a few minutes.';
                } else if (error.response.data?.detail) {
                    errorMessage = error.response.data.detail;
                }
            }
            
            setNotification({
                show: true,
                type: 'error',
                message: errorMessage
            });
        } finally {
            setIsLoading(false);
        }
    };

    const checkFeaturedPaymentStatus = async () => {
        if (!featuredPayment) return;

        try {
            const response = await axios.get(
                `${trading_api_url}/featured/payments/${featuredPayment.id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data) {
                setFeaturedPayment(response.data);
                setPendingPayment(response.data.status === 'pending' ? response.data : null);
                
                if (response.data.status === 'completed') {
                    setNotification({
                        show: true,
                        type: 'success',
                        message: 'Featured payment completed successfully!'
                    });
                    handleFetchListing();
                    setFeaturedPayment(null);
                    setPendingPayment(null);
                } else if (response.data.status === 'expired') {
                    setNotification({
                        show: true,
                        type: 'error',
                        message: 'Featured payment has expired. Please try again.'
                    });
                    setFeaturedPayment(null);
                    setPendingPayment(null);
                }
            }
        } catch (error: any) {
            console.error('Error checking payment status:', error);
            if (error.response?.status === 404) {
                setFeaturedPayment(null);
                setPendingPayment(null);
            }
        }
    };

    useEffect(() => {
        if (featuredPayment && featuredPayment.status === 'pending') {
            const interval = setInterval(checkFeaturedPaymentStatus, 10000);
            return () => clearInterval(interval);
        }
    }, [featuredPayment]);

    useEffect(() => {
        if (notification.show) {
            const timer = setTimeout(() => {
                setNotification(prev => ({ ...prev, show: false }));
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [notification.show]);

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

    const renderFeaturedPlans = () => {
        if (!Object.keys(featuredPlans).length) return null;

        if (pendingPayment) {
            return renderFeaturedPayment();
        }

        return (
            <div className="featured-plans">
                <h3>
                    <FiStar className="icon" />
                    Feature Your Listing
                </h3>
                <div className="plans-grid">
                    {Object.entries(featuredPlans).map(([key, plan]) => (
                        <div 
                            key={key}
                            className={`plan-card ${selectedPlan === key ? 'selected' : ''}`}
                            onClick={() => setSelectedPlan(key)}
                        >
                            <h4 className="plan-name">{plan.name}</h4>
                            <div className="plan-price">{plan.amount_evr} EVR</div>
                            <div className="plan-duration">{plan.duration_days} days</div>
                            <div className="plan-priority">Priority Level: {plan.priority_level}</div>
                        </div>
                    ))}
                </div>
                <button 
                    className="feature-button"
                    onClick={handleFeatureListing}
                    disabled={!selectedPlan || isLoading}
                >
                    {isLoading ? 'Processing...' : 'Feature Listing'}
                </button>
            </div>
        );
    };

    const renderFeaturedPayment = () => {
        const payment = pendingPayment || featuredPayment;
        if (!payment) return null;

        return (
            <div className="featured-payment">
                <h3>Featured Listing Payment</h3>
                <div className="payment-details">
                    <div className={`payment-status status-${payment.status}`}>
                        Status: {payment.status}
                    </div>
                    {payment.status === 'pending' && (
                        <>
                            <div className="payment-address">
                                <label>Send {payment.amount_evr} EVR to:</label>
                                <div 
                                    className="address-display"
                                    onClick={() => {
                                        navigator.clipboard.writeText(payment.payment_address);
                                        setNotification({
                                            show: true,
                                            type: 'success',
                                            message: 'Payment address copied!'
                                        });
                                    }}
                                >
                                    <span>{payment.payment_address}</span>
                                    <FiCopy className="copy-icon" />
                                </div>
                            </div>
                            {payment.expires_at && (
                                <div className="payment-expiry">
                                    Expires: {new Date(payment.expires_at).toLocaleString()}
                                </div>
                            )}
                        </>
                    )}
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

                        {renderFeaturedPlans()}

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

            {notification.show && (
                <div className={`notification notification-${notification.type}`}>
                    {notification.message}
                </div>
            )}
        </div>
    );
};

export default ManageListing;
