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
    const [totalCost, setTotalCost] = useState<string>('0'); // Updated state for formatted total cost
    const [quantityError, setQuantityError] = useState<string | null>(null); // State for error message

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

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (cartVisible && cartRef.current && !cartRef.current.contains(event.target as Node)) {
                setCartVisible(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [cartVisible]);

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
        setIsCreatingListing(true); // Show the CreateListing popup
    };

    const handleBuyNow = (item: any) => {
        setCheckoutItems([item]);
        setIsCheckingOut(true);
    };

    //const handleBuyCart = () => {
    //    setCheckoutItems(cart);
    //    setIsCheckingOut(true);
    //};

    const handleCheckoutComplete = () => {
        setIsCheckingOut(false);
        setCheckoutItems([]);
        clearCart(); // Clear the cart after checkout
    };

    const handleBack = () => {
        setIsCheckingOut(false);
    };

    const handleListingComplete = () => {
        setIsCreatingListing(false); // Hide the CreateListing popup after listing is completed
        // Optionally, you can refresh listings here if needed
    };

    const promptQuantity = (listing: any) => {
        setSelectedItem(listing);
        setQuantity(1); // Reset the quantity to 1
        setQuantityError(null); // Clear any previous error
        calculateTotalCost(parseFloat(listing.unitPrice), 1); // Convert to number and calculate the total cost for 1 item initially
        setQuantityPopupVisible(true);
    };

    const updateQuantity = (index: number, quantity: number) => {
        const updatedCart = [...cart];
        updatedCart[index].quantity = quantity;
        setCart(updatedCart);
        localStorage.setItem('manticore_cart', JSON.stringify(updatedCart));
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const qty = Math.max(1, parseInt(e.target.value, 10)); // Convert input to number, remove leading zeros, and ensure a minimum of 1
        if (selectedItem && qty > selectedItem.quantity) {
            setQuantity(qty)
            setQuantityError(`Maximum available quantity is ${selectedItem.quantity}.`);
        } else {
            if(qty)setQuantityError(null);
            setQuantity(qty);
            calculateTotalCost(parseFloat(selectedItem.unitPrice), qty); // Convert to number and recalculate the total cost
        }
    };

    const calculateTotalCost = (unitPrice: number, qty: number) => {
        if (Number.isNaN(qty))qty=0
        const subtotal = unitPrice * qty;
        const fee = subtotal * 0.05; // Calculate 5% fee
        const total = subtotal + fee;
        // Format the total cost by removing unnecessary trailing zeros
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
                                updateQuantity={updateQuantity}  // Pass down the new prop
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
                        {quantityError && <p className="error-message">{quantityError}</p>} {/* Display error message */}
                        <p>Total Cost: {totalCost} EVR</p> {/* Display formatted total cost */}
                        <p>(Including 5% fee)</p>
                        <button onClick={confirmAddToCart} disabled={!!quantityError}>Add to Cart</button>
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
