import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cart from './Cart';

interface CartItem {
    listingId: string;
    name: string;
    description: string;
    image_ipfs_hash: string | null;
    quantity: number;
    unitPrice: string;
    asset_name: string;
    seller_address: string;
}

const CartPage: React.FC = () => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const navigate = useNavigate();

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('manticore_cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    const handleClose = () => {
        navigate('/trade');
    };

    const handleRemove = (index: number) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
        localStorage.setItem('manticore_cart', JSON.stringify(newCart));
    };

    const handleClear = () => {
        setCart([]);
        localStorage.removeItem('manticore_cart');
    };

    return (
        <Cart
            cart={cart}
            onClose={handleClose}
            onRemove={handleRemove}
            onClear={handleClear}
        />
    );
};

export default CartPage; 