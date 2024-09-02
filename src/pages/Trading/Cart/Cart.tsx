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

const Cart: React.FC<CartProps> = ({ cartItems, removeFromCart, clearCart, closeCart, updateQuantity }) => {
    const cartRef = useRef<HTMLDivElement>(null);
    const [errors, setErrors] = useState<string[]>([]);
    const [showCheckout, setShowCheckout] = useState<boolean>(false);

    const handleQuantityChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuantity = Math.max(1, parseInt(e.target.value, 10)); 
        const availableQuantity = cartItems[index].quantity;

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

    const feeSats = Math.floor(totalAmountSats * 0.05); // 5% fee
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
                <h2>Your Cart</h2>
                {cartItems.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <>
                        <ul className="cart-items">
                            {cartItems.map((item, index) => (
                                <li key={index} className="cart-item">
                                    <div>
                                        <strong>{item.assetName}</strong>
                                        <p>Description: {item.description}</p>
                                        <p>Unit Price: {Number(item.unitPrice / 100000000).toString()} $EVR</p> {/* Convert unit price to EVR and drop trailing zeros */}
                                        <p>
                                            Quantity: 
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                min="1"
                                                onChange={(e) => handleQuantityChange(index, e)}
                                                className="quantity-input"
                                            />
                                            {errors[index] && (
                                                <span className="error-message">{errors[index]}</span>
                                            )}
                                        </p>
                                        <p>Total: {Number(item.unitPrice * item.quantity / 100000000).toString()} $EVR</p> {/* Convert total to EVR and drop trailing zeros */}
                                    </div>
                                    <button onClick={() => removeFromCart(index)}>Remove</button>
                                </li>
                            ))}
                        </ul>
                        <div className="cart-summary">
                            <p><strong>Total Amount: </strong>{totalAmountEVR} $EVR</p> {/* Display total in EVR */}
                            <p><strong>Fee (5%): </strong>{feeEVR} $EVR</p> {/* Display fee in EVR */}
                            <p><strong>Final Amount: </strong>{finalAmountEVR} $EVR</p> {/* Display final amount in EVR */}
                            <button className="checkout-button" onClick={handleProceedToCheckout}>
                                Proceed to Checkout
                            </button>
                            <button className="clear-cart-button" onClick={clearCart}>Clear Cart</button>
                        </div>
                    </>
                )}
            </div>
            {showCheckout && (
                <Checkout
                    selectedItems={cartItems}
                    onCheckoutComplete={handleCheckoutComplete}
                    onBack={() => setShowCheckout(false)}  // Close the checkout only
                />
            )}
        </>
    );
};

export default Cart;
