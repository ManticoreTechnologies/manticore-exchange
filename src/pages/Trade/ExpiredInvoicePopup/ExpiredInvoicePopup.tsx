import React from 'react';
import './ExpiredInvoicePopup.css';

interface ExpiredInvoicePopupProps {
    onClose: () => void;
}

const ExpiredInvoicePopup: React.FC<ExpiredInvoicePopupProps> = ({ onClose }) => {
    return (
        <div className="expired-invoice-popup">
            <div className="popup-content">
                <h3>Invoice Expired</h3>
                <p>The invoice has expired. Please try again or contact support if you need assistance.</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default ExpiredInvoicePopup;
