import React, { useState } from 'react';
import axios from 'axios';
import { FiTool } from 'react-icons/fi';
import './ManageListing.css';

interface ManageListingProps {
    initialListingId?: string; // Optional prop for initial listing ID
}

const ManageListing: React.FC<ManageListingProps> = ({ initialListingId = '' }) => {
    const [isManagingListing, setIsManagingListing] = useState<boolean>(false); 
    const [isClosing, setIsClosing] = useState<boolean>(false);
    const [listingId, setListingId] = useState<string>(initialListingId); // Use initialListingId if provided
    const [password, setPassword] = useState<string>(''); // Always prompt for password
    const [confirmPassword, setConfirmPassword] = useState<string>(''); 
    const [refundConfirmPassword, setRefundConfirmPassword] = useState<string>(''); // New state for refund confirmation password
    const [listingData, setListingData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null); 
    const [showCancelConfirmation, setShowCancelConfirmation] = useState<boolean>(false); 
    const [showRefundConfirmation, setShowRefundConfirmation] = useState<boolean>(false); // New state for refund confirmation

    const trading_api_host = import.meta.env.VITE_TRADING_API_HOST || 'api.manticore.exchange';
    const trading_api_port = import.meta.env.VITE_TRADING_API_PORT || '668';
    const trading_api_proto = import.meta.env.VITE_TRADING_API_PROTO || 'https';
    const trading_api_url = `${trading_api_proto}://${trading_api_host}:${trading_api_port}`;

    const handleFetchListing = async () => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            const response = await axios.post(`${trading_api_url}/manage`, {
                listing_id: listingId,
                password,
                action: 'fetch',
            });
            const fetchedListingData = response.data;
            fetchedListingData.unit_price = (fetchedListingData.unit_price / 100000000).toFixed(8); // Convert unit price from satoshis to EVR
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
            const unitPriceInSatoshis = Math.floor(Number(listingData.unit_price) * 100000000); // Convert the unit price to satoshis
            const response = await axios.post(`${trading_api_url}/manage`, {
                listing_id: listingId,
                password,
                action: 'update',
                unit_price: unitPriceInSatoshis,
                description: listingData.description,
            });
            setSuccessMessage(response.data.message);
        } catch (error: any) {
            console.error('Error updating listing:', error);
            setError(error.response?.data?.message || 'Failed to update listing.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelListing = async () => {
        if (password !== confirmPassword) {
            setError('Passwords do not match. Please confirm your password.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            const response = await axios.post(`${trading_api_url}/manage`, {
                listing_id: listingId,
                password,
                action: 'cancel',
            });
            setSuccessMessage(response.data.message);
            setShowCancelConfirmation(false);
            setListingData(null);
        } catch (error: any) {
            console.error('Error canceling listing:', error);
            setError(error.response?.data?.message || 'Failed to cancel listing.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefundSurplus = async () => {
        if (password !== refundConfirmPassword) {
            setError('Passwords do not match for refund. Please confirm your password.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            const response = await axios.post(`${trading_api_url}/manage`, {
                listing_id: listingId,
                password,
                action: 'refund',
            });
            setSuccessMessage(`Surplus refunded successfully! TXID: ${response.data.refund_txid}`);
            setShowRefundConfirmation(false); // Close refund confirmation modal
        } catch (error: any) {
            console.error('Error refunding surplus:', error);
            setError(error.response?.data?.message || 'Failed to refund surplus.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setListingData((prev: any) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleOpenPopup = () => {
        setIsClosing(false);
        setIsManagingListing(true);
    };

    const handleClosePopup = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsManagingListing(false);
            setShowCancelConfirmation(false);
            setError(null);
            setSuccessMessage(null);
        }, 300);
    };

    const openCancelConfirmation = () => {
        setShowCancelConfirmation(true);
    };

    const openRefundConfirmation = () => {
        setShowRefundConfirmation(true);
    };

    return (
        <div>
            <button className="manage-listing-button" onClick={handleOpenPopup}>
                <FiTool size={20} />
            </button>
            {isManagingListing && (
                <div className={`manage-listing-popup ${isClosing ? 'closing' : ''}`}>
                    <div className="manage-listing-content">
                        <button className="close-button" onClick={handleClosePopup}>✕</button>
                        {listingData ? (
                            <div>
                                <h2>Manage Listing</h2>
                                <label htmlFor="unit_price">Unit Price</label>
                                <input
                                    id="unit_price"
                                    type="text"
                                    name="unit_price"
                                    placeholder="Update Unit Price"
                                    value={listingData.unit_price}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    placeholder="Update Description"
                                    value={listingData.description}
                                    onChange={handleInputChange}
                                />
                                <button onClick={handleUpdateListing} disabled={isLoading}>
                                    {isLoading ? 'Updating...' : 'Update Listing'}
                                </button>
                                <button onClick={openCancelConfirmation} className="cancel-button" disabled={isLoading || listingData.listing_status === 'ACTIVE'}>
                                    {isLoading ? 'Canceling...' : 'Cancel Listing'}
                                </button>
                                <button onClick={openRefundConfirmation} className="refund-button" disabled={isLoading}>
                                    {isLoading ? 'Refunding...' : 'Refund Assets'}
                                </button>
                                {listingData.listing_status==='ACTIVE' && <p className="error-message">Active listings cannot be cancelled. Refund this listing to cancel it.</p>}
                                <div className="listing-address">
                                    <h3>Refill Address</h3>
                                    <p>{listingData.listing_address}</p>
                                </div>
                                {successMessage && <p className="success-message">{successMessage}</p>}
                                {error && <p className="error-message">{error}</p>}
                            </div>
                        ) : (
                            <div>
                                <h2>Enter Listing ID and Password</h2>
                                <label htmlFor="listingId">Listing ID</label>
                                <input
                                    id="listingId"
                                    type="text"
                                    name="listingId"
                                    placeholder="Listing ID"
                                    value={listingId}
                                    onChange={(e) => setListingId(e.target.value)}
                                    disabled={Boolean(initialListingId)} // Disable input if initial ID is provided
                                />
                                <label htmlFor="password">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button onClick={handleFetchListing} disabled={isLoading || !listingId || !password}>
                                    {isLoading ? 'Loading...' : 'Fetch Listing'}
                                </button>
                                {successMessage && <p className="success-message">{successMessage}</p>}
                                {error && <p className="error-message">{error}</p>}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Cancel Confirmation */}
            {showCancelConfirmation && (
                <div className={`manage-listing-popup ${isClosing ? 'closing' : ''}`}>
                    <div className="manage-listing-content">
                        <h2>Confirm Cancelation</h2>
                        <p>All assets will be refunded to the payout address. Please confirm your password to proceed.</p>
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button onClick={handleCancelListing} disabled={isLoading}>
                            {isLoading ? 'Canceling...' : 'Confirm Cancelation'}
                        </button>
                        <button onClick={() => setShowCancelConfirmation(false)} className="cancel-button">
                            Back
                        </button>
                        {successMessage && <p className="success-message">{successMessage}</p>}
                        {error && <p className="error-message">{error}</p>}
                    </div>
                </div>
            )}

            {/* Refund Confirmation */}
            {showRefundConfirmation && (
                <div className={`manage-listing-popup ${isClosing ? 'closing' : ''}`}>
                    <div className="manage-listing-content">
                        <h2>Confirm Refund</h2>
                        <p>Please confirm your password to refund the assets to the payout address.</p>
                        <label htmlFor="refundConfirmPassword">Confirm Password</label>
                        <input
                            id="refundConfirmPassword"
                            type="password"
                            name="refundConfirmPassword"
                            placeholder="Confirm Password"
                            value={refundConfirmPassword}
                            onChange={(e) => setRefundConfirmPassword(e.target.value)}
                        />
                        <button onClick={handleRefundSurplus} disabled={isLoading}>
                            {isLoading ? 'Refunding...' : 'Confirm Refund'}
                        </button>
                        <button onClick={() => setShowRefundConfirmation(false)} className="cancel-button">
                            Back
                        </button>
                        {successMessage && <p className="success-message">{successMessage}</p>}
                        {error && <p className="error-message">{error}</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageListing;
