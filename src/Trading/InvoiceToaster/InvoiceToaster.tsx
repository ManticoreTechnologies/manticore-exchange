import React, { useState } from 'react';
import './InvoiceToaster.css';
import OrderModal from './OrderModal'; // Import the OrderModal component

const InvoiceToaster: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [orders, setOrders] = useState<any[]>([]);

    const handleButtonClick = () => {
        // Fetch orders from localStorage
        const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');

        setOrders(savedOrders);
        // Open modal
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <button className="red-circle-button" onClick={handleButtonClick}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="receipt-icon"
                >
                    <path
                        d="M19 21H5V3h14v18zm-2-2V5H7v14h10zM8 7h8v2H8V7zm0 4h8v2H8v-2zm0 4h5v2H8v-2z"
                    />
                </svg>
            </button>
            
            {/* Render the OrderModal */}
            <OrderModal isOpen={isModalOpen} onClose={handleCloseModal} orders={orders} />
        </>
    );
};

export default InvoiceToaster;
