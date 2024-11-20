import React, { useRef, useState } from 'react';
import './Cart.css';
import Checkout from '../Checkout/Checkout';

interface CartProps {
    cartItems: any[];
    removeFromCart: (index: number) => void;
    clearCart: () => void;
    closeCart: () => void;
    updateQuantity: (index: number, quantity: number) => void;
}

//@ts-ignore
const Cart: React.FC<CartProps> = ({ cartItems, removeFromCart, clearCart, closeCart, updateQuantity }) => {
    const cartRef = useRef<HTMLDivElement>(null);
    const [errors, setErrors] = useState<string[]>([]);
    const [showCheckout, setShowCheckout] = useState<boolean>(false);

    const handleQuantityChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        
        // Allow empty input while typing
        if (inputValue === '') {
            updateQuantity(index, 1);
            return;
        }

        const newQuantity = parseInt(inputValue, 10);
        const availableQuantity = cartItems[index].quantity;

        // Validate if input is a valid number
        if (isNaN(newQuantity) || newQuantity < 1) {
            const newErrors = [...errors];
            newErrors[index] = 'Quantity must be at least 1';
            setErrors(newErrors);
            updateQuantity(index, 1);
            return;
        }

        if (newQuantity > availableQuantity) {
            const newErrors = [...errors];
            newErrors[index] = `Max available is ${availableQuantity}`;
            setErrors(newErrors);
            updateQuantity(index, availableQuantity);
        } else {
            const newErrors = [...errors];
            newErrors[index] = '';
            setErrors(newErrors);
            updateQuantity(index, newQuantity);
        }
    };

    const totalAmountSats = cartItems.reduce((total, item) => {
        const unitPrice = item.unitPrice || 0;
        const quantity = item.quantity || 1;
        return total + unitPrice * quantity;
    }, 0);

    const feeSats = Math.floor(totalAmountSats * 0.005); // 5% fee
    const finalAmountSats = totalAmountSats + feeSats;

    // Convert the amounts from satoshis to EVR for display, and remove trailing zeros
    const totalAmountEVR = Number(totalAmountSats / 100000000).toString();
    const feeEVR = Number(feeSats / 100000000).toString();
    const finalAmountEVR = Number(finalAmountSats / 100000000).toString();

    const handleProceedToCheckout = () => {
        setShowCheckout(true);
    };

    const handleCheckoutComplete = () => {
        setShowCheckout(false);
        clearCart();  // Optionally clear the cart when checkout is complete
    };

    return (
        <>
            <div ref={cartRef} className="cart-container">
                <div className="cart-header">
                    <h2>Your Cart</h2>
                    <button className="close-cart-button" onClick={closeCart}>×</button>
                </div>
                {cartItems.length === 0 ? (
                    <div className="empty-cart">
                        <p>Your cart is empty.</p>
                        <button className="continue-shopping-button" onClick={closeCart}>
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <>
                        <ul className="cart-items">
                            {cartItems.map((item, index) => (
                                <li key={index} className="cart-item">
                                    <div>
                                        <strong>{item.assetName}</strong>
                                        <p>Description: {item.description}</p>
                                        <p>Unit Price: {Number(item.unitPrice / 100000000).toString()} $EVR</p>
                                        <p>
                                            Quantity: {item.quantity}
                                            {errors[index] && (
                                                <span className="error-message">{errors[index]}</span>
                                            )}
                                        </p>
                                        <p>Total: {Number(item.unitPrice * item.quantity / 100000000).toString()} $EVR</p>
                                    </div>
                                    <button onClick={() => removeFromCart(index)}>×</button>
                                </li>
                            ))}
                        </ul>
                        <div className="cart-summary">
                            <div className="summary-details">
                                <p><strong>Total Amount: </strong>{totalAmountEVR} $EVR</p>
                                <p><strong>Fee (0.5%): </strong>{feeEVR} $EVR</p>
                                <p className="final-amount"><strong>Final Amount: </strong>{finalAmountEVR} $EVR</p>
                            </div>
                            <div className="cart-actions">
                                <button className="checkout-button" onClick={handleProceedToCheckout}>
                                    Proceed to Checkout
                                </button>
                                <div className="secondary-actions">
                                    <button className="continue-shopping-button" onClick={closeCart}>
                                        Continue Shopping
                                    </button>
                                    <button className="clear-cart-button" onClick={clearCart}>
                                        Clear Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
            {showCheckout && (
                <Checkout
                    selectedItems={cartItems}
                    onCheckoutComplete={handleCheckoutComplete}
                    onBack={() => setShowCheckout(false)}
                />
            )}
        </>
    );
};

export default Cart;
