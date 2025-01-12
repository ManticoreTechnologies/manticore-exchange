import React, { useState, useEffect } from 'react';
import './Checkout.css';
import ExpiredInvoicePopup from '../ExpiredInvoicePopup/ExpiredInvoicePopup';

interface CheckoutProps {
    selectedItems: any[];
    onCheckoutComplete: () => void;
    onBack: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ selectedItems, onCheckoutComplete, onBack }) => {
    const [processing, setProcessing] = useState(false);
    const [invoiceData, setInvoiceData] = useState<any>(null);
    const [payoutAddress, setPayoutAddress] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isExpiredPopupOpen, setIsExpiredPopupOpen] = useState<boolean>(false);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [timeRemaining, setTimeRemaining] = useState<number>(0);
    const [expirationTime, setExpirationTime] = useState<number | null>(null);

    // Calculate totals
    const totalAmountWithoutFeeSats = selectedItems.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
    const feeSats = Math.floor(totalAmountWithoutFeeSats * 0.005); // 0.5% fee
    const totalAmountWithFeeSats = totalAmountWithoutFeeSats + feeSats;

    // Convert to EVR for display
    const totalAmountWithoutFeeEVR = (totalAmountWithoutFeeSats / 100000000).toFixed(8);
    const feeEVR = (feeSats / 100000000).toFixed(8);
    const totalAmountWithFeeEVR = (totalAmountWithFeeSats / 100000000).toFixed(8);

    const trading_api_host = import.meta.env.VITE_TRADING_API_HOST || 'api.manticore.exchange';
    const trading_api_port = import.meta.env.VITE_TRADING_API_PORT || '668';
    const trading_api_proto = import.meta.env.VITE_TRADING_API_PROTO || 'https';
    const trading_api_url = `${trading_api_proto}://${trading_api_host}:${trading_api_port}`;

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (invoiceData) {
            setLoading(true);
            
            // Set expiration time when invoice is created
            if (invoiceData.expiration_time) {
                // Convert Unix timestamp (seconds) to milliseconds
                const expiresAt = Math.floor(invoiceData.expiration_time * 1000);
                setExpirationTime(expiresAt);
                const now = Date.now();
                setTimeRemaining(Math.max(0, Math.floor((expiresAt - now) / 1000)));
            }

            // Update timer every second
            interval = setInterval(() => {
                if (expirationTime) {
                    const now = Date.now();
                    const remaining = Math.max(0, Math.floor((expirationTime - now) / 1000));
                    setTimeRemaining(remaining);
                    
                    if (remaining === 0) {
                        handleInvoiceClose(true);
                    }
                }
            }, 1000);

            // Check invoice status every 5 seconds
            const statusInterval = setInterval(async () => {
                try {
                    const response = await fetch(`${trading_api_url}/get_invoice/${invoiceData.id}`);
                    const updatedInvoice = await response.json();
                    
                    if (updatedInvoice.status === "FAILED") {
                        console.log("Order failed to place or invoice does not exist.");
                        setErrorMessage("Order failed. Please try again.");
                        setLoading(false);
                        handleInvoiceClose(true);
                    } else if (updatedInvoice.status === "COMPLETE") {
                        console.log("Order complete!");
                        handleInvoiceClose(false);
                    } else {
                        console.log("Updating invoice data:", updatedInvoice);
                        // Preserve the expiration time when updating invoice data
                        setInvoiceData({
                            ...updatedInvoice,
                            expiration_time: invoiceData.expiration_time
                        });
                    }
                } catch (error) {
                    console.error('Error fetching invoice status:', error);
                    setErrorMessage('Error fetching invoice status.');
                    setLoading(false);
                }
            }, 5000);

            return () => {
                clearInterval(interval);
                clearInterval(statusInterval);
            };
        }
    }, [invoiceData, expirationTime]);

    const handleCheckout = async () => {
        if (!payoutAddress) {
            setErrorMessage('Please enter a payout address.');
            return;
        }

        setProcessing(true);
        setErrorMessage(null);

        try {
            const orderItems = selectedItems.map(item => item.listingID);
            const quantities = selectedItems.map(item => item.quantity * 100000000);

            const response = await fetch(`${trading_api_url}/place_order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    listing_id: orderItems,
                    quantity: quantities,
                    payout_address: payoutAddress,
                    total_amount: totalAmountWithFeeSats
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setInvoiceData({
                    ...data,
                    amount: totalAmountWithFeeSats
                });
                setOrderId(data.id);
                setCurrentStep(2);
                setErrorMessage(null);
            } else {
                setErrorMessage(data.message || 'An error occurred while placing the order.');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            setErrorMessage('Failed to place the order. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    const handleInvoiceClose = (expired: boolean = true) => {
        setInvoiceData(null);
        if (!expired) onCheckoutComplete();
        setIsExpiredPopupOpen(expired);
    };

    const handleExpiredPopupClose = () => {
        setIsExpiredPopupOpen(false);
        setCurrentStep(1);
    };

    const formatTime = (seconds: number): string => {
        if (seconds <= 0) return "0:00";
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const getProgressPercentage = (): string => {
        if (!expirationTime) return '0deg';
        const now = Date.now();
        const remaining = Math.max(0, Math.floor((expirationTime - now) / 1000));
        // Calculate progress in degrees (0 to 360)
        return Math.min(360, Math.max(0, (remaining / (15 * 60)) * 360)) + 'deg';
    };

    return (
        <div className="checkout-container">
            <div className="checkout-header">
                <button className="back-button" onClick={onBack}>
                    <span className="back-icon">←</span>
                    Back to Cart
                </button>
                <div className="checkout-steps">
                    <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                        <div className="step-number">1</div>
                        <span>Review Order</span>
                    </div>
                    <div className={`step-connector ${currentStep >= 2 ? 'active' : ''}`}></div>
                    <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                        <div className="step-number">2</div>
                        <span>Payment</span>
                    </div>
                </div>
            </div>

            <div className="checkout-content">
                {currentStep === 1 ? (
                    <div className="checkout-review">
                        <div className="order-summary">
                            <h3>Order Summary</h3>
                            <div className="order-items">
                                {selectedItems.map((item, index) => (
                                    <div key={index} className="order-item">
                                        <div className="item-details">
                                            <h4>{item.assetName}</h4>
                                            <p className="item-quantity">Quantity: {item.quantity}</p>
                                        </div>
                                        <div className="item-price">
                                            {(item.unitPrice * item.quantity / 100000000).toFixed(8)} EVR
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="order-totals">
                                <div className="total-line">
                                    <span>Subtotal</span>
                                    <span>{totalAmountWithoutFeeEVR} EVR</span>
                                </div>
                                <div className="total-line">
                                    <span>Network Fee (0.5%)</span>
                                    <span>{feeEVR} EVR</span>
                                </div>
                                <div className="total-line total">
                                    <span>Total</span>
                                    <span>{totalAmountWithFeeEVR} EVR</span>
                                </div>
                            </div>
                        </div>

                        <div className="payout-address-section">
                            <h3>Payout Information</h3>
                            <div className="input-group">
                                <label htmlFor="payoutAddress">EVR Payout Address</label>
                                <input
                                    type="text"
                                    id="payoutAddress"
                                    value={payoutAddress}
                                    onChange={(e) => setPayoutAddress(e.target.value)}
                                    placeholder="Enter your EVR address"
                                    className={errorMessage ? 'error' : ''}
                                />
                                {errorMessage && <div className="error-message">{errorMessage}</div>}
                            </div>
                        </div>

                        <button
                            className="proceed-button"
                            onClick={handleCheckout}
                            disabled={processing || !payoutAddress}
                        >
                            {processing ? 'Processing...' : 'Proceed to Payment'}
                        </button>
                    </div>
                ) : (
                    <div className="payment-section">
                        {invoiceData && (
                            <div className="invoice-status-container">
                                {/* Debug display */}
                                <pre className="debug-data">
                                    {JSON.stringify(invoiceData, null, 2)}
                                </pre>

                                <div className="invoice-header">
                                    <h2>Payment Details</h2>
                                    <div className="timer-display">
                                        <div className="timer-circle" style={{'--progress': `${getProgressPercentage()}`} as any}>
                                            <div className="timer-circle-inner">
                                                <span className="time-remaining">{formatTime(timeRemaining)}</span>
                                                <span className="timer-label">remaining</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="invoice-details">
                                    <div className="invoice-field">
                                        <label>Order ID</label>
                                        <div className="field-value">
                                            <span>{invoiceData.id}</span>
                                        </div>
                                    </div>

                                    <div className="invoice-field payment-address">
                                        <label>Payment Address</label>
                                        <div className="field-value with-copy">
                                            <span>{invoiceData.payment_address}</span>
                                            <button 
                                                className="copy-button"
                                                onClick={() => navigator.clipboard.writeText(invoiceData.payment_address)}
                                            >
                                                Copy
                                            </button>
                                        </div>
                                    </div>

                                    <div className="invoice-field">
                                        <label>Amount</label>
                                        <div className="field-value">
                                            <span>{(invoiceData.amount / 100000000).toFixed(8)} EVR</span>
                                        </div>
                                    </div>

                                    <div className="invoice-field">
                                        <label>Status</label>
                                        <div className="field-value">
                                            <span className={`status-badge ${invoiceData.status.toLowerCase()}`}>
                                                {invoiceData.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="invoice-actions">
                                    <button 
                                        className="cancel-button"
                                        onClick={() => handleInvoiceClose(true)}
                                    >
                                        Cancel Order
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {isExpiredPopupOpen && (
                <ExpiredInvoicePopup onClose={handleExpiredPopupClose} />
            )}
        </div>
    );
};

export default Checkout;
