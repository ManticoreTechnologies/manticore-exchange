import React, { useEffect, useRef, useState } from 'react';
import TradingResultsGrid from './Results/ResultsGrid/TradingResultsGrid';
import Cart from './Cart/Cart';
import Checkout from './Checkout/Checkout';
import CreateListing from './CreateListing/CreateListing';  
import './Trading.css';
import axios from 'axios';
import TradingHeader from './TradingHeader/TradingHeader';
import InvoiceToaster from './InvoiceToaster/InvoiceToaster'; // Import InvoiceToaster
import ManageListing from './ManageListing/ManageListing';
import TradingDetails from './Results/TradingDetails/TradingDetails';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate and useLocation



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
    const [searchQuery, setSearchQuery] = useState<string>(''); // New state for search
    const [showPopup, setShowPopup] = useState<boolean>(false); // New state for showing TradingDetails
    const [selectedListing, setSelectedListing] = useState<any | null>(null); // New state for selected listing

    const cartRef = useRef<HTMLDivElement>(null);

    const trading_api_host = import.meta.env.VITE_TRADING_API_HOST || 'api.manticore.exchange';
    const trading_api_port = import.meta.env.VITE_TRADING_API_PORT || '668';
    const trading_api_proto = import.meta.env.VITE_TRADING_API_PROTO || 'https';
    const trading_api_url = `${trading_api_proto}://${trading_api_host}:${trading_api_port}`;

    const navigate = useNavigate(); // Initialize useNavigate
    const location = useLocation(); // Initialize useLocation

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        if (searchParams.get('details') !== 'true') {
            setShowPopup(false);
            setSelectedListing(null);
        }
    }, [location]);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await axios.get(`${trading_api_url}/listings`);
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
        const qty = Math.max(0, parseFloat(e.target.value));
        const cappedQty = parseFloat(qty.toFixed(selectedItem.units));
        setQuantity(cappedQty);
        if (selectedItem && cappedQty > selectedItem.quantity) {
            setQuantityError(`Maximum available quantity is ${selectedItem.quantity}.`);
        } else {
            setQuantityError(null);
            setQuantity(cappedQty);
            calculateTotalCost(parseFloat(selectedItem.unitPrice), cappedQty);
        }
    };

    const calculateTotalCost = (unitPrice: number, qty: number) => {
        const subtotal = (unitPrice * qty) / 100000000;
        const fee = subtotal * 0.005;
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

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value); // Update search query as the user types
    };

    const handleSearchSubmit = () => {
        // Perform search logic here based on searchQuery
        console.log(`Search query: ${searchQuery}`);
        // You can implement search filtering on the listings here
    };

    const showDetails = (listing: any) => {
        setSelectedListing(listing);
        setShowPopup(true);
        navigate('?details=true'); // Update the URL
    };

    const closeDetails = () => {
        setSelectedListing(null);
        setShowPopup(false);
        navigate('?details=false'); // Update the URL
    };

    return (
        <div className="trading-page">

<TradingHeader 
                    createListing={createListing} 
                    toggleCartVisibility={toggleCartVisibility}
                    cart={cart}
                />

            {!cartVisible && showPopup && selectedListing ? (
                <div>
                    <TradingDetails 
                        listing={selectedListing}
                        closeDetails={closeDetails}
                        addToCart={addToCart}
                    />
                </div>
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
                        <TradingResultsGrid 
                            results={listings} 
                            addToCart={promptQuantity} 
                            buyNow={handleBuyNow} 
                            showDetails={showDetails}
                        />
                    )}
                </>
            )}

            {quantityPopupVisible && selectedItem && (
                <div className="quantity-popup">
                    <div className="quantity-popup-content">
                        <h3>Select Quantity</h3>
                        <input 
                            type="number" 
                            min={Math.pow(10, -selectedItem.units)} 
                            step={Math.pow(10, -selectedItem.units)}
                            value={quantity} 
                            onChange={handleQuantityChange} 
                        />
                        {quantityError && <p className="error-message">{quantityError}</p>}
                        <p>Total Cost: {totalCost} EVR</p>
                        <p>(Including 0.5% fee)</p>
                        <button onClick={confirmAddToCart} disabled={!!quantityError}>Add to Cart</button>
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
            
            <InvoiceToaster />

        </div>
    );
};

export default Trading;
