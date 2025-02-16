import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/Application/contexts/AuthContext';
import { 
    FaStar, FaEdit, FaPause, FaPlay, FaChartLine, 
    FaWallet, FaClock, FaCheckCircle, FaTimes, FaSync,
    FaTag, FaCoins, FaCalendarAlt, FaBolt, FaImage,
    FaArrowUp, FaHistory, FaExternalLinkAlt, FaCopy
} from 'react-icons/fa';
import tradingService, { 
    Listing, Balance, FeaturedListingPlan, FeaturedPayment,
    ListingAnalytics, Transaction, WithdrawRequest
} from '@/Application/services/TradingService';
import './ManageListingPage.css';
import { toast } from 'react-toastify';

// Add white Manticore logo import
import whiteManticore from '@/Application/logos/white-manticore.png';



const ManageListingPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [listing, setListing] = useState<Listing | null>(null);
    const [analytics, setAnalytics] = useState<ListingAnalytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        description: '',
        tags: [] as string[],
        payout_address: ''
    });

    // Enhanced feature listing states
    const [plans, setPlans] = useState<Record<string, FeaturedListingPlan>>({});
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [payment, setPayment] = useState<FeaturedPayment | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState<string | null>(null);

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [withdrawAmount, setWithdrawAmount] = useState<Record<string, string>>({});
    const [withdrawError, setWithdrawError] = useState<string | null>(null);
    const [showWithdrawModal, setShowWithdrawModal] = useState<string | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/signin');
            return;
        }
        loadListing();
        loadAnalytics();
        loadFeaturePlans();
        loadTransactions();
    }, [id, isAuthenticated]);

    const loadListing = async () => {
        try {
            if (!id) return;
            setLoading(true);
            const data = await tradingService.getListingById(id);
            setListing(data);
            setEditForm({
                name: data.name,
                description: data.description || '',
                tags: data.tags || [],
                payout_address: data.payout_address || data.seller_address
            });
        } catch (err) {
            setError('Failed to load listing');
            console.error('Load listing error:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadAnalytics = async () => {
        try {
            if (!id) return;
            const data = await tradingService.getListingAnalytics(id);
            setAnalytics(data);
        } catch (err) {
            console.error('Failed to load analytics:', err);
        }
    };

    const loadFeaturePlans = async () => {
        try {
            setIsProcessing(true);
            // Load available plans
            const availablePlans = await tradingService.getFeaturedPlans();
            setPlans(availablePlans);

            // Check for existing payments if we have a listing ID
            if (!id) return;
            const payments = await tradingService.listFeaturedPayments(id);
            
            // Find active or pending payment
            const activePayment = payments.find(p => 
                p.status === 'pending' || 
                (p.status === 'completed' && p.expires_at && new Date(p.expires_at) > new Date())
            );
            
            if (activePayment) {
                setPayment(activePayment);
                // If payment is pending, start polling
                if (activePayment.status === 'pending') {
                    startPaymentPolling(activePayment.id);
                }
            }
        } catch (err) {
            console.error('Failed to load feature plans:', err);
            setPaymentError('Failed to load feature plans');
        } finally {
            setIsProcessing(false);
        }
    };

    const startPaymentPolling = (paymentId: string) => {
        tradingService.pollFeaturedPaymentStatus(
            paymentId,
            (updatedPayment) => {
                setPayment(updatedPayment);
                if (updatedPayment.status === 'completed') {
                    loadListing();
                }
            },
            5000, // Poll every 5 seconds
            15 * 60 * 1000 // Timeout after 15 minutes
        );
    };

    const handlePauseListing = async () => {
        try {
            if (!id) return;
            setIsProcessing(true);
            await tradingService.pauseListing(id);
            await loadListing();
        } catch (err) {
            setError('Failed to pause listing');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleResumeListing = async () => {
        try {
            if (!id) return;
            setIsProcessing(true);
            await tradingService.resumeListing(id);
            await loadListing();
        } catch (err) {
            setError('Failed to resume listing');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleUpdateListing = async () => {
        try {
            if (!id) return;
            setIsProcessing(true);
            await tradingService.updateListing(id, editForm);
            setIsEditing(false);
            await loadListing();
        } catch (err) {
            setError('Failed to update listing');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleFeatureListing = async () => {
        if (!selectedPlan || !id) return;
        
        try {
            setIsProcessing(true);
            setPaymentError(null);
            
            const newPayment = await tradingService.createFeaturedPayment(id, selectedPlan);
            setPayment(newPayment);
            startPaymentPolling(newPayment.id);
            
        } catch (err) {
            console.error('Failed to create feature payment:', err);
            setPaymentError('Failed to create feature payment. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRescanBalances = async () => {
        try {
            if (!id) return;
            setIsProcessing(true);
            await tradingService.rescanListingBalance(id);
            await loadListing();
        } catch (err) {
            setError('Failed to rescan balances');
        } finally {
            setIsProcessing(false);
        }
    };

    const loadTransactions = async () => {
        try {
            if (!id) return;
            const data = await tradingService.getListingTransactions(id, {
                asset: 'all',
                per_page: 50
            });
            setTransactions(data.transactions);
        } catch (err) {
            console.error('Failed to load transactions:', err);
        }
    };

    const handleWithdraw = async (assetName: string) => {
        try {
            if (!id || !withdrawAmount[assetName]) return;
            setIsProcessing(true);
            setWithdrawError(null);
            
            const request: WithdrawRequest = {
                asset_name: assetName,
                amount: withdrawAmount[assetName]
            };
            
            await tradingService.withdrawFromListing(id, request);
            await loadListing();
            setShowWithdrawModal(null);
            setWithdrawAmount({});
        } catch (err: any) {
            setWithdrawError(err.message || 'Failed to withdraw');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleImageUpdate = async (ipfsHash: string) => {
        try {
            if (!id) return;
            setIsProcessing(true);
            await tradingService.updateListing(id, {
                image_ipfs_hash: ipfsHash
            });
            await loadListing();
        } catch (err) {
            setError('Failed to update image');
        } finally {
            setIsProcessing(false);
        }
    };

    const formatDuration = (hours: number) => {
        const days = Math.floor(hours / 24);
        if (days === 0) return 'Hourly';
        if (days === 1) return 'Daily';
        if (days === 7) return 'Weekly';
        if (days === 30) return 'Monthly';
        return `${days} days`;
    };

    const getTimeRemaining = (expiresAt: string) => {
        const now = new Date();
        const expiry = new Date(expiresAt);
        const diff = expiry.getTime() - now.getTime();
        
        if (diff <= 0) return 'Expired';
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        if (days === 0) {
            if (hours === 0) return 'Less than an hour';
            return hours === 1 ? '1 hour' : `${hours} hours`;
        }
        
        if (hours === 0) {
            return days === 1 ? '1 day' : `${days} days`;
        }
        
        return days === 1 
            ? `1 day ${hours}h` 
            : `${days} days ${hours}h`;
    };

    const handleCopyToClipboard = (text: string) => {
        const el = document.createElement('textarea');
        el.value = text;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        let success = false;
        try {
            success = document.execCommand('copy');
            if (success) {
                toast.success('Copied to clipboard!');
            } else {
                toast.error('Failed to copy');
            }
        } catch (err) {
            console.error('Failed to copy:', err);
            toast.error('Failed to copy to clipboard');
        }
        document.body.removeChild(el);
    };

    const formatAssetAmount = (amount: string, assetName: string) => {
        const num = parseFloat(amount);
        if (isNaN(num)) return amount;
        
        // Format with appropriate decimal places
        if (num >= 1000000) {
            return `${(num / 1000000).toFixed(2)}M ${assetName}`;
        } else if (num >= 1000) {
            return `${(num / 1000).toFixed(2)}K ${assetName}`;
        }
        return `${num.toFixed(2)} ${assetName}`;
    };

    if (loading) {
        return (
            <div className="mlp_page">
                <div className="loading-spinner" />
            </div>
        );
    }

    if (error || !listing) {
        return (
            <div className="mlp_page">
                <div className="error-message">{error || 'Listing not found'}</div>
            </div>
        );
    }

    // Render the feature card section
    const renderFeatureCard = () => (
        <div className="mlp_card">
            <div className="mlp_card_header">
                <h2><FaStar /> Feature Listing</h2>
            </div>
            <div className="mlp_card_content">
                {payment ? (
                    <div className="mlp_feature_payment">
                        <div className={`mlp_payment_status mlp_payment_${payment.status}`}>
                            {payment.status === 'pending' && (
                                <>
                                    <FaClock />
                                    <span>Awaiting Payment</span>
                                </>
                            )}
                            {payment.status === 'completed' && (
                                <>
                                    <FaCheckCircle />
                                    <span>Featured</span>
                                </>
                            )}
                            {payment.status === 'failed' && (
                                <>
                                    <FaTimes />
                                    <span>Payment Failed</span>
                                </>
                            )}
                        </div>
                        {payment.status === 'pending' && (
                            <>
                                <div className="mlp_payment_address">
                                    Send {payment.amount_evr} EVR to: {payment.payment_address}
                                </div>
                                <div className="mlp_balance_item">
                                    <span className="mlp_balance_asset">
                                        <FaClock /> Time Remaining
                                    </span>
                                    <span className="mlp_balance_amount">
                                        {getTimeRemaining(payment.expires_at || '')}
                                    </span>
                                </div>
                            </>
                        )}
                        {payment.status === 'completed' && payment.expires_at && (
                            <div className="mlp_balance_item">
                                <span className="mlp_balance_asset">
                                    <FaBolt /> Featured Until
                                </span>
                                <span className="mlp_balance_amount">
                                    {getTimeRemaining(payment.expires_at)}
                                </span>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="mlp_feature_plans">
                            {Object.entries(plans).map(([name, plan]) => (
                                <div
                                    key={name}
                                    className={`mlp_plan_card ${selectedPlan === name ? 'mlp_plan_selected' : ''}`}
                                    onClick={() => !isProcessing && setSelectedPlan(name)}
                                >
                                    <div className="mlp_plan_name">{formatDuration(plan.duration_hours)}</div>
                                    <div className="mlp_plan_price">{plan.amount_evr} EVR</div>
                                </div>
                            ))}
                        </div>
                        {paymentError && (
                            <div className="mlp_error_message">
                                {paymentError}
                            </div>
                        )}
                        {selectedPlan && (
                            <button
                                className="mlp_button mlp_button_primary"
                                onClick={handleFeatureListing}
                                disabled={isProcessing}
                            >
                                {isProcessing ? 'Processing...' : `Feature for ${plans[selectedPlan].amount_evr} EVR`}
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );

    // Render the media section
    const renderMediaSection = () => (
        <div className="mlp_card">
            <div className="mlp_card_header">
                <h2><FaImage /> Media</h2>
            </div>
            <div className="mlp_card_content">
                <div className="mlp_media_preview">
                    {listing.image_ipfs_hash ? (
                        <img 
                            src={`https://ipfs.io/ipfs/${listing.image_ipfs_hash}`}
                            alt={listing.name}
                            onError={(e) => {
                                const img = e.target as HTMLImageElement;
                                img.src = whiteManticore;
                                img.classList.add('mlp_media_placeholder_logo');
                            }}
                        />
                    ) : (
                        <img 
                            src={whiteManticore}
                            alt="Manticore Logo"
                            className="mlp_media_placeholder_logo"
                        />
                    )}
                </div>
                <div className="mlp_form_group">
                    <label>IPFS Hash</label>
                    <div className="mlp_input_group">
                        <input
                            type="text"
                            value={listing.image_ipfs_hash || ''}
                            onChange={(e) => handleImageUpdate(e.target.value)}
                            placeholder="Enter IPFS hash"
                            disabled={isProcessing}
                        />
                        {listing.image_ipfs_hash && (
                            <a 
                                href={`https://ipfs.io/ipfs/${listing.image_ipfs_hash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mlp_button mlp_button_secondary"
                            >
                                <FaExternalLinkAlt /> View
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    // Render the addresses card
    const renderAddressesCard = () => (
        <div className="mlp_card">
            <div className="mlp_card_header">
                <h2><FaWallet /> Addresses</h2>
            </div>
            <div className="mlp_card_content">
                <div className="mlp_form_group">
                    <label>Deposit Address</label>
                    <div className="mlp_input_group">
                        <input
                            type="text"
                            value={listing?.deposit_address || ''}
                            readOnly
                            className="mlp_input_readonly"
                            onClick={(e) => (e.target as HTMLInputElement).select()}
                        />
                        <button 
                            type="button"
                            className="mlp_button mlp_button_secondary"
                            onClick={() => handleCopyToClipboard(listing?.deposit_address || '')}
                        >
                            <FaCopy /> Copy
                        </button>
                    </div>
                </div>

                {isEditing ? (
                    <div className="mlp_form_group">
                        <label>Payout Address</label>
                        <input
                            type="text"
                            value={editForm.payout_address}
                            onChange={(e) => setEditForm({
                                ...editForm,
                                payout_address: e.target.value
                            })}
                            placeholder="Enter payout address"
                        />
                    </div>
                ) : (
                    <div className="mlp_form_group">
                        <label>Payout Address</label>
                        <div className="mlp_input_group">
                            <input
                                type="text"
                                value={listing?.payout_address || listing?.seller_address || ''}
                                readOnly
                                className="mlp_input_readonly"
                                onClick={(e) => (e.target as HTMLInputElement).select()}
                            />
                            <button 
                                type="button"
                                className="mlp_button mlp_button_secondary"
                                onClick={() => handleCopyToClipboard(listing?.payout_address || listing?.seller_address || '')}
                            >
                                <FaCopy /> Copy
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    // Render the transactions section
    const renderTransactionsSection = () => (
        <div className="mlp_card">
            <div className="mlp_card_header">
                <h2><FaHistory /> Recent Transactions</h2>
            </div>
            <div className="mlp_card_content">
                <div className="mlp_transactions_list">
                    {transactions.length === 0 ? (
                        <div className="mlp_empty_state">
                            No transactions found
                        </div>
                    ) : (
                        transactions.map((tx) => (
                            <div key={tx.tx_hash} className="mlp_transaction_item">
                                <div className="mlp_transaction_info">
                                    <span className={`mlp_transaction_type mlp_type_${tx.entry_type}`}>
                                        {tx.entry_type === 'receive' ? 'Received' : 'Withdrawn'}
                                    </span>
                                    <span className="mlp_transaction_asset">
                                        {formatAssetAmount(tx.amount, tx.asset_type)}
                                    </span>
                                </div>
                                <div className="mlp_transaction_details">
                                    <span className="mlp_transaction_time">
                                        {new Date(tx.time || '').toLocaleString()}
                                    </span>
                                    <span className="mlp_transaction_confirmations">
                                        {tx.confirmations} {tx.confirmations === 1 ? 'confirmation' : 'confirmations'}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );

    // Update the balances card to include withdraw functionality
    const renderBalancesCard = () => (
        <div className="mlp_card">
            <div className="mlp_card_header">
                <h2><FaWallet /> Balances</h2>
                <button 
                    className="mlp_button mlp_button_secondary"
                    onClick={handleRescanBalances}
                    disabled={isProcessing}
                >
                    <FaSync /> {isProcessing ? 'Scanning...' : 'Rescan'}
                </button>
            </div>
            <div className="mlp_card_content">
                <div className="mlp_balance_list">
                    {listing.balances.map((balance: Balance) => (
                        <div key={balance.asset_name} className="mlp_balance_item">
                            <span className="mlp_balance_asset">
                                <FaCoins /> {balance.asset_name}
                            </span>
                            <div className="mlp_balance_actions">
                                <span className="mlp_balance_amount">
                                    {balance.confirmed_balance}
                                </span>
                                <button
                                    className="mlp_button mlp_button_secondary"
                                    onClick={() => setShowWithdrawModal(balance.asset_name)}
                                    disabled={isProcessing || Number(balance.confirmed_balance) <= 0}
                                >
                                    <FaArrowUp /> Withdraw
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Withdraw Modal */}
            {showWithdrawModal && (
                <div className="mlp_modal_overlay">
                    <div className="mlp_modal">
                        <div className="mlp_modal_header">
                            <h3>Withdraw {showWithdrawModal}</h3>
                            <button 
                                className="mlp_modal_close"
                                onClick={() => {
                                    setShowWithdrawModal(null);
                                    setWithdrawError(null);
                                }}
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <div className="mlp_modal_content">
                            <div className="mlp_form_group">
                                <label>Amount</label>
                                <input
                                    type="text"
                                    value={withdrawAmount[showWithdrawModal] || ''}
                                    onChange={(e) => setWithdrawAmount({
                                        ...withdrawAmount,
                                        [showWithdrawModal]: e.target.value
                                    })}
                                    placeholder="Enter amount to withdraw"
                                    disabled={isProcessing}
                                />
                            </div>
                            {withdrawError && (
                                <div className="mlp_error_message">
                                    {withdrawError}
                                </div>
                            )}
                            <div className="mlp_modal_actions">
                                <button
                                    className="mlp_button mlp_button_primary"
                                    onClick={() => handleWithdraw(showWithdrawModal)}
                                    disabled={isProcessing || !withdrawAmount[showWithdrawModal]}
                                >
                                    {isProcessing ? 'Processing...' : 'Confirm Withdraw'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            </div>
        );

        return (
        <div className="mlp_page">
            <div className="mlp_content">
                {/* Header */}
                <div className="mlp_header">
                    <div className="mlp_title">
                        <h1>{listing.name}</h1>
                        <span className={`mlp_status mlp_status_${listing.status}`}>
                            {listing.status}
                        </span>
                    </div>
                    <div className="mlp_actions">
                        <button 
                            className="mlp_button mlp_button_secondary"
                            onClick={() => setIsEditing(!isEditing)}
                            disabled={isProcessing}
                        >
                            <FaEdit /> {isEditing ? 'Cancel' : 'Edit'}
                        </button>
                        {listing.status === 'active' ? (
                            <button 
                                className="mlp_button mlp_button_secondary"
                                onClick={handlePauseListing}
                                disabled={isProcessing}
                            >
                                <FaPause /> Pause
                            </button>
                        ) : (
                            <button 
                                className="mlp_button mlp_button_primary"
                                onClick={handleResumeListing}
                                disabled={isProcessing}
                            >
                                <FaPlay /> Resume
                            </button>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="mlp_grid">
                    {/* Left Column */}
                    <div className="mlp_details">
                        {renderMediaSection()}
                        {renderAddressesCard()}
                        
                        {/* Details Card */}
                        <div className="mlp_card">
                            <div className="mlp_card_header">
                                <h2><FaTag /> Listing Details</h2>
                            </div>
                            <div className="mlp_card_content">
                                {isEditing ? (
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        handleUpdateListing();
                                    }}>
                                        <div className="mlp_form_group">
                                            <label>Name</label>
                                            <input
                                                type="text"
                                                value={editForm.name}
                                                onChange={(e) => setEditForm({
                                                    ...editForm,
                                                    name: e.target.value
                                                })}
                                                disabled={isProcessing}
                                            />
                                        </div>
                                        <div className="mlp_form_group">
                                            <label>Description</label>
                                            <textarea
                                                value={editForm.description}
                                                onChange={(e) => setEditForm({
                                                    ...editForm,
                                                    description: e.target.value
                                                })}
                                                disabled={isProcessing}
                                            />
                                        </div>
                                        <div className="mlp_form_actions">
                                            <button 
                                                type="button" 
                                                className="mlp_button mlp_button_primary"
                                                onClick={handleUpdateListing}
                                                disabled={isProcessing}
                                            >
                                                {isProcessing ? 'Saving...' : 'Save Changes'}
                                            </button>
                                            <button 
                                                type="button"
                                                className="mlp_button mlp_button_secondary"
                                                onClick={() => setIsEditing(false)}
                                                disabled={isProcessing}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        <p>{listing.description}</p>
                                        <div className="mlp_tags">
                                            {listing.tags.map(tag => (
                                                <span key={tag} className="mlp_tag">{tag}</span>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Analytics Card */}
                        {analytics && (
                            <div className="mlp_card">
                                <div className="mlp_card_header">
                                    <h2><FaChartLine /> Analytics</h2>
                                </div>
                                <div className="mlp_card_content">
                                    <div className="mlp_stats_grid">
                                        <div className="mlp_stat_item">
                                            <div className="mlp_stat_value">{analytics.views}</div>
                                            <div className="mlp_stat_label">Views</div>
                                        </div>
                                        <div className="mlp_stat_item">
                                            <div className="mlp_stat_value">{analytics.sales_count}</div>
                                            <div className="mlp_stat_label">Sales</div>
                                        </div>
                                        <div className="mlp_stat_item">
                                            <div className="mlp_stat_value">
                                                {(analytics.conversion_rate * 100).toFixed(1)}%
                                            </div>
                                            <div className="mlp_stat_label">Conversion Rate</div>
                                        </div>
                                        <div className="mlp_stat_item">
                                            <div className="mlp_stat_value">
                                                {analytics.total_revenue} EVR
                                            </div>
                                            <div className="mlp_stat_label">Revenue</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Transactions Section */}
                        {renderTransactionsSection()}
                    </div>

                    {/* Right Column */}
                    <div className="mlp_sidebar">
                        {/* Balances Card with Withdraw */}
                        {renderBalancesCard()}

                        {/* Feature Card */}
                        {renderFeatureCard()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageListingPage; 