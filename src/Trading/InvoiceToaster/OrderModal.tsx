import React, { useState } from 'react';
import './OrderModal.css';
import InvoiceStatusPopup from '../InvoiceStatusPopup/InvoiceStatusPopup'; // Import the InvoiceStatusPopup component

interface OrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    orders: any[];
}

const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, orders }) => {
    const [selectedOrder, setSelectedOrder] = useState<any>(null); // Track the selected order for the popup
    const [updatedOrders, setUpdatedOrders] = useState(orders); // Track the updated order list
    const trading_api_host = 'api.manticore.exchange';
    const trading_api_port = 668;
    const trading_api_url = `https://${trading_api_host}:${trading_api_port}`;
    const handleOrderClick = async (orderNumber: string) => {
        try {
            const response = await fetch(`${trading_api_url}/get_invoice/${orderNumber}`);

            // Check if the response is a 404 (Not Found)
            if (response.status === 404) {
                console.warn(`Order ${orderNumber} not found. Removing from storage.`);

                // Remove the order from localStorage
                const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
                const filteredOrders = savedOrders.filter((order: any) => order.orderNumber !== orderNumber);
                localStorage.setItem('orders', JSON.stringify(filteredOrders));

                // Update the orders in state (remove the 404 order)
                setUpdatedOrders(filteredOrders);
                return; // Stop here since the order was not found
            }

            // If it's not a 404, parse the invoice data and set the selected order
            const invoiceData = await response.json();
            setSelectedOrder(invoiceData.invoice); // Set the selected order data for the popup
        } catch (error) {
            console.error('Error fetching invoice data:', error);
        }
    };

    const handleInvoiceClose = () => {
        setSelectedOrder(null); // Close the popup when the user closes it
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Saved Orders</h2>
                {updatedOrders.length > 0 ? (
                    <ul>
                        {updatedOrders.map((order, index) => (
                            <li key={index}>
                                <strong>Order ID:</strong>
                                {/* Clicking the order ID will open the InvoiceStatusPopup */}
                                <span
                                    className="order-link"
                                    onClick={() => handleOrderClick(order.orderNumber)}
                                    style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                                >
                                    {order.orderNumber}
                                </span>
                                <br />
                                <strong>Status:</strong> {order.status || 'Unknown'}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No saved orders found.</p>
                )}
                <button onClick={onClose} className="close-modal-btn">Close</button>

                {/* Render the InvoiceStatusPopup if an order is selected */}
                {selectedOrder && (
                    <InvoiceStatusPopup
                        invoiceData={selectedOrder}
                        onClose={handleInvoiceClose} // Handle closing the invoice
                    />
                )}
            </div>
        </div> 
    );
};

export default OrderModal;
