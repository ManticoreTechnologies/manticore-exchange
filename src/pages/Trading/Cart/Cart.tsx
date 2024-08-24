import React, { useEffect, useRef, useState } from 'react';
import './Cart.css';

interface CartProps {
    cartItems: any[];
    removeFromCart: (index: number) => void;
    clearCart: () => void;
    closeCart: () => void;
    updateQuantity: (index: number, quantity: number) => void; // Prop for updating quantity
}

const Cart: React.FC<CartProps> = ({ cartItems, removeFromCart, clearCart, closeCart, updateQuantity }) => {
    const cartRef = useRef<HTMLDivElement>(null);
    const [errors, setErrors] = useState<string[]>([]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
                closeCart();
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [closeCart]);

    const handleQuantityChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuantity = Math.max(1, parseInt(e.target.value, 10)); // Ensure quantity is at least 1
        const availableQuantity = cartItems[index].quantity; // Get available quantity from the item
        
        if (newQuantity > availableQuantity) {
            const newErrors = [...errors];
            newErrors[index] = `Max available is ${availableQuantity}`;
            setErrors(newErrors);
            updateQuantity(index, availableQuantity); // Set the quantity to the max available
        } else {
            const newErrors = [...errors];
            newErrors[index] = '';
            setErrors(newErrors);
            updateQuantity(index, newQuantity); // Update with the new quantity
        }
    };

    const totalAmount = cartItems.reduce((total, item) => {
        const unitPrice = item.unitPrice || 0;
        const quantity = item.quantity || 1;
        return total + unitPrice * quantity;
    }, 0);

    return (
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
                                    <p>Unit Price: {item.unitPrice} $EVR</p>
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
                                    <p>Total: {(item.unitPrice * item.quantity).toFixed(2)} $EVR</p>
                                </div>
                                <button onClick={() => removeFromCart(index)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                    <div className="cart-summary">
                        <p><strong>Total Amount: </strong>{totalAmount.toFixed(2)} $EVR</p>
                        <button className="checkout-button">Proceed to Checkout</button>
                        <button className="clear-cart-button" onClick={clearCart}>Clear Cart</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
