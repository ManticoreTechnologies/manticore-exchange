import React, { useState, useEffect } from 'react';
import './InvoiceStatusPopup.css';

interface InvoiceStatusPopupProps {
    invoiceData: any;
    onClose: (expired: boolean) => void;
}

const InvoiceStatusPopup: React.FC<InvoiceStatusPopupProps> = ({ invoiceData, onClose }) => {
    const { fulfillment_txid, id, payment_address, payment_amount, status, expiration_time } = invoiceData;

    const [timeLeft, setTimeLeft] = useState<number>(expiration_time - Math.floor(Date.now() / 1000));
    const [percentage, setPercentage] = useState<number>(100);
    const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
    const [spinning, setSpinning] = useState<boolean>(false);
    confirmationMessage
    // Convert payment_amount from satoshis to EVR
    const paymentAmountEVR = (payment_amount / 100000000).toFixed(8);

    // Calculate the total duration of the invoice (from creation to expiration)
    const totalDuration = expiration_time - (invoiceData.created_at || (expiration_time - 900)); // Default to 15 minutes if created_at is not provided
    useEffect(() => {

        if (status === 'CONFIRMED') {
            setConfirmationMessage('Your payment has been confirmed.');
            return;
        }

        let interval: NodeJS.Timeout;
        if (status === 'PENDING') {
            interval = setInterval(() => {
                const currentTime = Math.floor(Date.now() / 1000);
                const remainingTime = expiration_time - currentTime;
                setTimeLeft(remainingTime);

                // Update the percentage based on remaining time
                const newPercentage = (remainingTime / totalDuration) * 100;
                setPercentage(newPercentage);

                if (remainingTime <= 0) {
                    clearInterval(interval);
                    onClose(true); // Close the current popup and open the expired popup
                }
            }, 1000);
        } else {
            setSpinning(true);
            interval = setInterval(() => {
                setTimeLeft(prev => {
                    const newTime = prev - 1;
                    if (newTime <= 0) {
                        return 15; // Reset the time to simulate spinning
                    }
                    return newTime;
                });

                // Manipulate percentage to create a smooth spinning effect
                setPercentage(prev => {
                    const newPercentage = prev - 1;

                    return newPercentage;
                });
            }, 50); // Speed up the interval for a smooth spinning effect
        }

        return () => clearInterval(interval);
    }, [expiration_time, onClose, totalDuration, status]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const calculateColor = (percentage: number) => {
        const r = percentage < 50 ? 255 : Math.floor(255 - (percentage * 2 - 100) * 2.55);
        const g = percentage > 50 ? 255 : Math.floor(percentage * 2 * 2.55);
        return `rgb(${r},${g},0)`;
    };

    return (
        <div className="invoice-status-popup">
            <div className="popup-content">
                <h3>Invoice Status</h3>
                <p><strong>Order ID:</strong> {id}</p>
                <p><strong>Payment Address:</strong> {payment_address}</p>
                <p><strong>Amount:</strong> {paymentAmountEVR} $EVR</p>
                <p><strong>Status:</strong> {status}</p>

                {/* Conditionally render the fulfillment_txid only if it exists */}
                {fulfillment_txid && fulfillment_txid.length > 0 && (
                    <p><strong>Order TXID:</strong> {fulfillment_txid[0]}</p>
                )}
                {status === 'COMPLETE' ? (
                    <div className="checkmark-container" onClick={() => onClose(false)}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="green"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="checkmark"
                        >
                            <path d="M20 6L9 17l-5-5" />
                        </svg>
                    </div>
                ) : (
                    <div className="circle-timer">
                        <svg className="progress-ring" width="120" height="120">
                            <circle
                                className="progress-ring__circle"
                                stroke={calculateColor(percentage)}
                                strokeWidth="10"
                                fill="transparent"
                                r="52"
                                cx="60"
                                cy="60"
                                style={{
                                    strokeDasharray: `${2 * Math.PI * 52}`,
                                    strokeDashoffset: `${((100 - percentage) / 100) * (2 * Math.PI * 52)}`
                                }}
                            />
                        </svg>
                        <div className="timer-text">{spinning ? 'Processing...' : formatTime(timeLeft)}</div>
                    </div>
                )}

                <button onClick={() => onClose(false)}>Close</button>
            </div>
        </div>
    );
};

export default InvoiceStatusPopup;
