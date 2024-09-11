import React, { useState, useEffect } from 'react';
import './Checkout.css';
import InvoiceStatusPopup from '../InvoiceStatusPopup/InvoiceStatusPopup';
import ExpiredInvoicePopup from '../ExpiredInvoicePopup/ExpiredInvoicePopup'; // Import the expired popup component

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
    loading
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isExpiredPopupOpen, setIsExpiredPopupOpen] = useState<boolean>(false); // State for expired invoice popup

    // Calculate total amount and include the 5% fee (working in satoshis)
    const totalAmountWithoutFeeSats = selectedItems.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
    const feeSats = Math.floor(totalAmountWithoutFeeSats * 0.005); // 5% fee
    const totalAmountWithFeeSats = totalAmountWithoutFeeSats + feeSats;

    // Convert values to EVR for display
    const totalAmountWithoutFeeEVR = (totalAmountWithoutFeeSats / 100000000).toFixed(8);
    const feeEVR = (feeSats / 100000000).toFixed(8);
    const totalAmountWithFeeEVR = (totalAmountWithFeeSats / 100000000).toFixed(8);
    const trading_api_host = 'localhost'//'api.manticore.exchange';
    const trading_api_port = 668;
    const trading_api_url = `https://${trading_api_host}:${trading_api_port}`;
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (invoiceData) {
            setLoading(true);

            interval = setInterval(async () => {
                try {
                    const response = await fetch(`${trading_api_url}/get_invoice/${invoiceData.order_id}`);
                    const updatedInvoice = await response.json();

                    if (updatedInvoice.invoice.status === 'COMPLETE' || updatedInvoice.invoice.status === 'FAILED') {
                        setInvoiceData(updatedInvoice.invoice);
                        setLoading(false);
                        clearInterval(interval);
                    } else {
                        setInvoiceData(updatedInvoice.invoice);
                    }
                } catch (error) {
                    console.error('Error fetching invoice status:', error);
                    setErrorMessage('Error fetching invoice status.');
                }
            }, 5000); // Check every 5 seconds
        }

        return () => clearInterval(interval);
    }, [invoiceData]);

    const saveOrderLocally = (orderNumber: string) => {
        const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        savedOrders.push({ orderNumber, status: 'PENDING' });
        localStorage.setItem('orders', JSON.stringify(savedOrders));
    };

    const checkOrderStatuses = async () => {
        const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        const updatedOrders = await Promise.all(savedOrders.map(async (order: any) => {
            try {
                const response = await fetch(`${trading_api_url}/get_invoice/${order.orderNumber}`);
                const updatedInvoice = await response.json();
                return { ...order, status: updatedInvoice.invoice.status };
            } catch (error) {
                console.error('Error fetching invoice status for order:', order.orderNumber);
                return { ...order, status: 'ERROR' };
            }
        }));

        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        showToasterForOrders(updatedOrders);
    };

    const showToasterForOrders = (orders: any[]) => {
        orders.forEach(order => {
            if (order.status === 'COMPLETE') {
                //alert(`Order ${order.orderNumber} is complete.`);
            } else if (order.status === 'FAILED') {
                //alert(`Order ${order.orderNumber} has failed.`);
            }
        });
    };

    const handleCheckout = async () => {
        if (!payoutAddress) {
            setErrorMessage('Please enter a payout address.');
            return;
        }

        setProcessing(true);

        try {
            const response = await fetch(`${trading_api_url}/place_order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    listing_id: selectedItems[0].listingID, 
                    quantity: selectedItems[0].quantity * 100000000, // Send quantity in satoshis
                    payout_address: payoutAddress
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setInvoiceData(data);
                saveOrderLocally(data.order_id); // Save order number locally
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
        if (expired == false) onCheckoutComplete();
        setIsExpiredPopupOpen(expired); // Open the expired invoice popup
    };

    const handleExpiredPopupClose = () => {
        setIsExpiredPopupOpen(false);
    };

    useEffect(() => {
        // Check the status of saved orders every minute
        const interval = setInterval(checkOrderStatuses, 60000); // 1 minute

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="checkout">
            <h2>Checkout</h2>
            <ul className="checkout-items">
                {selectedItems.map((item, index) => (
                    <li key={index} className="checkout-item">
                        <div>
                            <strong>{item.assetName}</strong>
                            <p>Quantity: {item.quantity}</p>
                            <p>Total: {(item.unitPrice * item.quantity / 100000000).toFixed(8)} $EVR</p>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="checkout-summary">
                <p><strong>Subtotal: </strong>{totalAmountWithoutFeeEVR} $EVR</p>
                <p><strong>Fee (0.5%): </strong>{feeEVR} $EVR</p>
                <p><strong>Total Amount: </strong>{totalAmountWithFeeEVR} $EVR</p>
                <div className="payout-address">
                    <label htmlFor="payoutAddress">Payout Address:</label>
                    <input 
                        type="text" 
                        id="payoutAddress" 
                        value={payoutAddress}
                        onChange={(e) => setPayoutAddress(e.target.value)}
                        placeholder="Enter your payout address"
                    />
                </div>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <button 
                    className="complete-checkout-button" 
                    onClick={handleCheckout} 
                    disabled={processing}
                >
                    {processing ? 'Processing...' : 'Complete Purchase'}
                </button>
                <button 
                    className="back-button" 
                    onClick={onBack} 
                    disabled={processing}
                >
                    {processing ? 'Processing...' : 'Back'}
                </button>
            </div>
            {invoiceData && (
                <InvoiceStatusPopup
                    invoiceData={invoiceData}
                    onClose={handleInvoiceClose} // Handle closing the invoice
                />
            )}
            {isExpiredPopupOpen && (
                <ExpiredInvoicePopup
                    onClose={handleExpiredPopupClose} // Handle closing the expired popup
                />
            )}
        </div>
    );
};

export default Checkout;
