import React, { useEffect, useRef, useState } from 'react';
import ResultsGrid from './Results/ResultsGrid/ResultsGrid';
import Cart from './Cart/Cart';
import Checkout from './Checkout/Checkout';
import CreateListing from './CreateListing/CreateListing';  
import './Trading.css';
import axios from 'axios';
import TradingHeader from './TradingHeader/TradingHeader';

const Trading: React.FC = () => {
    const [listings, setListings] = useState<any[]>([]);
    const [cartVisible, setCartVisible] = useState<boolean>(false);
    const [checkoutItems, setCheckoutItems] = useState<any[]>([]);
    const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
    const [isCreatingListing, setIsCreatingListing] = useState<boolean>(false); 
    const [cart, setCart] = useState<any[]>([]);
    const [quantityPopupVisible, setQuantityPopupVisible] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [totalCost, setTotalCost] = useState<string>('0');
    const [quantityError, setQuantityError] = useState<string | null>(null);

    const cartRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await axios.get('http://0.0.0.0:668/listings');
                console.log(response.data);
                setListings(response.data);
            } catch (error) {
                console.error('Error fetching listings:', error);
            }
        };

        // Load cart from local storage
        const savedCart = localStorage.getItem('manticore_cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
        fetchListings();
    }, []);

    const addToCart = (listing: any, quantity: number) => {
        const itemWithQuantity = { ...listing, quantity };
        const updatedCart = [...cart, itemWithQuantity];
        setCart(updatedCart);
        localStorage.setItem('manticore_cart', JSON.stringify(updatedCart));
        setQuantityPopupVisible(false);
    };

    const removeFromCart = (index: number) => {
        const updatedCart = cart.filter((_, i) => i !== index);
        setCart(updatedCart);
        localStorage.setItem('manticore_cart', JSON.stringify(updatedCart));
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('manticore_cart');
    };

    const toggleCartVisibility = () => {
        setCartVisible(prev => !prev);
    };

    const createListing = () => {
        setIsCreatingListing(true);
    };

    const handleBuyNow = (item: any) => {
        setSelectedItem(item);
        setQuantity(1);
        setQuantityError(null);
        calculateTotalCost(parseFloat(item.unitPrice), 1);
        setQuantityPopupVisible(true);
    };

    const handleCheckout = () => {
        if (selectedItem) {
            selectedItem.quantity = quantity;  // Set the selected quantity
            selectedItem.totalPrice = (selectedItem.unitPrice * quantity) / 100000000;
            setCheckoutItems([selectedItem]);
            setQuantityPopupVisible(false);
            setIsCheckingOut(true);
        }
    };

    const handleCheckoutComplete = () => {
        setIsCheckingOut(false);
        setCheckoutItems([]);
        clearCart();
    };

    const handleBack = () => {
        setIsCheckingOut(false);
    };

    const handleListingComplete = () => {
        setIsCreatingListing(false);
    };

    const promptQuantity = (listing: any) => {
        setSelectedItem(listing);
        setQuantity(1);
        setQuantityError(null);
        calculateTotalCost(parseFloat(listing.unitPrice), 1);
        setQuantityPopupVisible(true);
    };

    const updateQuantity = (index: number, quantity: number) => {
        const updatedCart = [...cart];
        updatedCart[index].quantity = quantity;
        setCart(updatedCart);
        localStorage.setItem('manticore_cart', JSON.stringify(updatedCart));
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const qty = Math.max(1, parseInt(e.target.value, 10));
        if (selectedItem && qty > selectedItem.quantity) {
            setQuantityError(`Maximum available quantity is ${selectedItem.quantity}.`);
        } else {
            setQuantityError(null);
            setQuantity(qty);
            calculateTotalCost(parseFloat(selectedItem.unitPrice), qty);
        }
    };

    const calculateTotalCost = (unitPrice: number, qty: number) => {
        const subtotal = (unitPrice * qty) / 100000000;
        const fee = subtotal * 0.05;
        const total = subtotal + fee;
        const formattedTotal = total.toFixed(8).replace(/\.?0+$/, '');
        setTotalCost(formattedTotal);
    };

    const confirmAddToCart = () => {
        if (selectedItem) {
            if (quantity > selectedItem.availableQuantity) {
                setQuantityError(`Cannot add more than the available quantity of ${selectedItem.availableQuantity}.`);
                return;
            }
            addToCart(selectedItem, quantity);
        }
    };

    return (
        <div className="trading-page">
            <TradingHeader 
                createListing={createListing} 
                toggleCartVisibility={toggleCartVisibility}
                cart={cart}
            />

            {isCheckingOut ? (
                <Checkout 
                    selectedItems={checkoutItems} 
                    onCheckoutComplete={handleCheckoutComplete} 
                    onBack={handleBack} 
                />
            ) : (
                <>
                    <div 
                        ref={cartRef} 
                        className={`cart ${cartVisible ? 'cart-visible' : 'cart-hidden'}`}
                    >
                        {cartVisible && (
                            <Cart 
                                cartItems={cart} 
                                removeFromCart={removeFromCart} 
                                clearCart={clearCart}
                                closeCart={() => setCartVisible(false)}
                                updateQuantity={updateQuantity}
                            />
                        )}
                    </div>
                    {!cartVisible && (
                        <ResultsGrid results={listings} addToCart={promptQuantity} buyNow={handleBuyNow} />
                    )}
                </>
            )}

            {quantityPopupVisible && selectedItem && (
                <div className="quantity-popup">
                    <div className="quantity-popup-content">
                        <h3>Select Quantity</h3>
                        <input 
                            type="number" 
                            min="1" 
                            value={quantity} 
                            onChange={handleQuantityChange} 
                        />
                        {quantityError && <p className="error-message">{quantityError}</p>}
                        <p>Total Cost: {totalCost} EVR</p>
                        <p>(Including 5% fee)</p>
                        <button onClick={handleCheckout} disabled={!!quantityError}>Proceed to Checkout</button>
                        <button onClick={() => setQuantityPopupVisible(false)}>Cancel</button>
                    </div>
                </div>
            )}

            {isCreatingListing && (
                <CreateListing 
                    onClose={() => setIsCreatingListing(false)} 
                    onComplete={handleListingComplete} 
                />
            )}
        </div>
    );
};

export default Trading;
