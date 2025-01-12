import React, { useState, useEffect, useCallback } from 'react';
import './InvoiceStatusPopup.css';
import { CopyIcon } from './icons';

interface InvoiceData {
    fulfillment_txid?: string[];
    id: string;
    payment_address: string;
    payment_amount: number;
    status: 'PENDING' | 'PROCESSING' | 'COMPLETE' | 'COMPLETED' | 'CONFIRMED';
    expiration_time: number;
    created_at?: number;
}

interface InvoiceStatusPopupProps {
    invoiceData: InvoiceData;
    onClose: (expired: boolean) => void;
}

interface TimerConfig {
    interval: number;
    shouldSpin: boolean;
}

const SATOSHI_TO_EVR = 100000000;
const DEFAULT_EXPIRATION = 900; // 15 minutes in seconds
const COPY_SUCCESS_DURATION = 2000; // 2 seconds
const SPINNER_RESET_TIME = 15;
const SPINNER_INTERVAL = 50;

const InvoiceStatusPopup: React.FC<InvoiceStatusPopupProps> = ({ invoiceData, onClose }) => {
    const {
        fulfillment_txid,
        id,
        payment_address,
        payment_amount,
        status,
        expiration_time,
        created_at
    } = invoiceData;

    // Add debug logging
    console.log('Full fulfillment_txid:', fulfillment_txid);

    const [timeLeft, setTimeLeft] = useState<number>(expiration_time - Math.floor(Date.now() / 1000));
    const [percentage, setPercentage] = useState<number>(100);
    const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
    const [spinning, setSpinning] = useState<boolean>(false);
    const [copySuccess, setCopySuccess] = useState<boolean>(false);

    // Convert payment amount from satoshis to EVR with 8 decimal places
    const paymentAmountEVR = (payment_amount / SATOSHI_TO_EVR).toFixed(8);

    // Calculate total duration from creation to expiration
    const totalDuration = expiration_time - (created_at || (expiration_time - DEFAULT_EXPIRATION));

    const handleCopy = useCallback(async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), COPY_SUCCESS_DURATION);
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    }, []);

    const truncateAddress = useCallback((address: string): string => {
        if (!address) return '';
        return `${address.slice(0, 8)}...${address.slice(-8)}`;
    }, []);

    const formatTime = useCallback((seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }, []);

    const calculateColor = useCallback((percentage: number): string => {
        const r = percentage < 50 ? 255 : Math.round(255 - (percentage * 2 - 100) * 2.55);
        const g = percentage > 50 ? 255 : Math.round(percentage * 2 * 2.55);
        return `rgb(${r},${g},0)`;
    }, []);

    useEffect(() => {
        if (status === 'CONFIRMED') {
            setConfirmationMessage('Your payment has been confirmed.');
            return;
        }

        const timerConfig: TimerConfig = status === 'PENDING'
            ? { interval: 1000, shouldSpin: false }
            : { interval: SPINNER_INTERVAL, shouldSpin: true };

        setSpinning(timerConfig.shouldSpin);

        const interval = setInterval(() => {
            if (timerConfig.shouldSpin) {
                setTimeLeft(prev => prev <= 0 ? SPINNER_RESET_TIME : prev - 1);
                setPercentage(prev => (prev - 1 + 100) % 100);
            } else {
                const currentTime = Math.floor(Date.now() / 1000);
                const remainingTime = expiration_time - currentTime;
                
                if (remainingTime <= 0) {
                    clearInterval(interval);
                    onClose(true);
                    return;
                }

                setTimeLeft(remainingTime);
                setPercentage((remainingTime / totalDuration) * 100);
            }
        }, timerConfig.interval);

        return () => clearInterval(interval);
    }, [expiration_time, onClose, totalDuration, status]);

    const renderStatusIndicator = () => {
        if (status === 'COMPLETE' || status === 'COMPLETED') {
            return (
                <div className="checkmark-container" onClick={() => onClose(false)}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--color-success)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="checkmark"
                    >
                        <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span className="checkmark-text">Done</span>
                </div>
            );
        }

        return (
            <div className={`circle-timer ${status === 'PROCESSING' ? 'fade-out' : ''}`}>
                <svg className="progress-ring" width="80" height="80">
                    <circle
                        className="progress-ring__circle"
                        stroke={status === 'PENDING' ? calculateColor(percentage) : 'var(--accent-color)'}
                        strokeWidth="4"
                        fill="transparent"
                        r="36"
                        cx="40"
                        cy="40"
                        style={{
                            strokeDasharray: `${2 * Math.PI * 36}`,
                            strokeDashoffset: `${((100 - percentage) / 100) * (2 * Math.PI * 36)}`
                        }}
                    />
                </svg>
                <div className="timer-text">
                    {spinning ? 'Processing...' : formatTime(timeLeft)}
                </div>
            </div>
        );
    };

    return (
        <div className="invoice-status-popup">
            <button 
                className="close-button"
                onClick={() => onClose(false)}
                aria-label="Close invoice status popup"
            >
                ×
            </button>
            <div className="popup-content">
                <h3>Invoice Status</h3>

                <div className="info-row">
                    <strong>Order ID:</strong>
                    <span>{id}</span>
                </div>

                <div className="info-row">
                    <strong>Payment Address:</strong>
                    <div className="copy-wrapper">
                        <span>{truncateAddress(payment_address)}</span>
                        <button
                            className={`copy-button ${copySuccess ? 'success' : ''}`}
                            onClick={() => handleCopy(payment_address)}
                            title={copySuccess ? 'Copied!' : 'Copy to clipboard'}
                            aria-label="Copy payment address"
                        >
                            <CopyIcon />
                        </button>
                    </div>
                </div>

                <div className="info-row">
                    <strong>Amount:</strong>
                    <span>{paymentAmountEVR} $EVR</span>
                </div>

                <div className="info-row">
                    <strong>Status:</strong>
                    <span>{status}</span>
                </div>

                {fulfillment_txid?.[0] && (
                    <div className="info-row">
                        <strong>Order TXID:</strong>
                        <div className="copy-wrapper order-txid">
                            <span>{fulfillment_txid[0]}</span>
                            <button
                                className={`copy-button ${copySuccess ? 'success' : ''}`}
                                onClick={() => handleCopy(fulfillment_txid[0])}
                                title={copySuccess ? 'Copied!' : 'Copy to clipboard'}
                                aria-label="Copy transaction ID"
                            >
                                <CopyIcon />
                            </button>
                        </div>
                    </div>
                )}

                {confirmationMessage && (
                    <div className="confirmation-message">
                        {confirmationMessage}
                    </div>
                )}

                {renderStatusIndicator()}
            </div>
        </div>
    );
};

export default InvoiceStatusPopup;
