import React, { useEffect, useRef, useState } from 'react';
import TradingResultsGrid from './Results/ResultsGrid/TradingResultsGrid';
import Cart from './Cart/Cart';

//@ts-ignore
import Checkout from './Checkout/Checkout';
import CreateListing from './CreateListing/CreateListing';  
import './Trading.css';
import axios from 'axios';
import TradingHeader from './TradingHeader/TradingHeader';
import InvoiceToaster from './InvoiceToaster/InvoiceToaster'; // Import InvoiceToaster

//@ts-ignore
import ManageListing from './ManageListing/ManageListing';
import TradingDetails from './Results/TradingDetails/TradingDetails';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate and useLocation

const Trading: React.FC = () => {
    const [listings, setListings] = useState<any[]>([]);
    const [cartVisible, setCartVisible] = useState<boolean>(false);
    //@ts-ignore
    const [checkoutItems, setCheckoutItems] = useState<any[]>([]);
    
//@ts-ignore
    const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
    const [isCreatingListing, setIsCreatingListing] = useState<boolean>(false); 
    const [cart, setCart] = useState<any[]>([]);
    const [quantityPopupVisible, setQuantityPopupVisible] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [totalCost, setTotalCost] = useState<string>('0');
    const [quantityError, setQuantityError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>(''); // New state for search
    const [showPopup, setShowPopup] = useState<boolean>(true); // New state for showing TradingDetails
    const [selectedListing, setSelectedListing] = useState<any | null>(null); // New state for selected listing
    const [searchResults, setSearchResults] = useState<any[]>([]); // New state for search results
    //@ts-ignore
    const [loading, setLoading] = useState<boolean>(false); // New state for loading indicator
    const [searchColumn, setSearchColumn] = useState<string>('asset_name');
    const [filterQuery, setFilterQuery] = useState<string>('');
    const [filterType, setFilterType] = useState<string>('');
    const [filterValue, setFilterValue] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [totalResults, setTotalResults] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(50); // Add this new state

    // @ts-ignore
    const cartRef = useRef<HTMLDivElement>(null);

    const trading_api_host = import.meta.env.VITE_TRADING_API_HOST || 'api.manticore.exchange';
    // const trading_api_port = import.meta.env.VITE_TRADING_API_PORT || '668';
    const trading_api_port = 8000;
    const trading_api_proto = import.meta.env.VITE_TRADING_API_PROTO || 'https';
    const trading_api_url = `${trading_api_proto}://${trading_api_host}:${trading_api_port}`;

    const navigate = useNavigate(); // Initialize useNavigate
    const location = useLocation(); // Initialize useLocation

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        if (searchParams.get('details') !== 'true') {
            setShowPopup(false);
            setSelectedListing(null);
        } else {
            console.log('Showing popup');
            setShowPopup(true);
        }
    }, [location]);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                setLoading(true);
                const offset = (currentPage - 1) * pageSize;
                let url = `${trading_api_url}/listings/?limit=${pageSize}&offset=${offset}`;
                
                // Add search params if they exist
                if (searchQuery) {
                    url += `&search_term=${encodeURIComponent(searchQuery)}`;
                }
                
                const response = await axios.get(url);
                console.log('API Response:', response.data);
                
                // The response is now directly an array of listings
                if (Array.isArray(response.data)) {
                    setListings(response.data);
                    setSearchResults(response.data);
                    
                    // Calculate total pages based on array length and pageSize
                    const totalItems = response.data.length;
                    setTotalResults(totalItems);
                    setTotalPages(Math.ceil(totalItems / pageSize));
                    setLoading(false);
                } else {
                    console.error('Unexpected response format:', response.data);
                    setListings([]);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching listings:', error);
                setListings([]);
                setLoading(false);
            }
        };

        // Load cart from local storage
        const savedCart = localStorage.getItem('manticore_cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
        fetchListings();
    }, [currentPage, pageSize, searchQuery]);

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
//@ts-ignore
    const handleCheckoutComplete = () => {
        setIsCheckingOut(false);
        setCheckoutItems([]);
        clearCart();
    };

//@ts-ignore
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
        setSearchQuery(e.target.value);
        setLoading(true);
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchQuery || (filterType && filterQuery)) {
                try {
                    const offset = (currentPage - 1) * pageSize;
                    let url = `${trading_api_url}/listings/?limit=${pageSize}&offset=${offset}`;
                    
                    if (searchQuery) {
                        url += `&search_term=${encodeURIComponent(searchQuery)}`;
                    }
                    
                    // Add other filters based on filterType
                    if (filterType && filterQuery) {
                        switch(filterType) {
                            case 'seller':
                                url += `&seller_address=${encodeURIComponent(filterQuery)}`;
                                break;
                            case 'asset':
                                url += `&asset_name=${encodeURIComponent(filterQuery)}`;
                                break;
                        }
                    }
                    
                    const response = await axios.get(url);
                    
                    if (Array.isArray(response.data)) {
                        setSearchResults(response.data);
                        setTotalResults(response.data.length);
                        setTotalPages(Math.ceil(response.data.length / pageSize));
                    }
                } catch (error) {
                    console.error('Error fetching search results:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setSearchResults([]);
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, filterType, filterQuery, currentPage, pageSize]);

    const showDetails = (listing: any) => {
        navigate(`/listing/${listing.id}`);
    };

    const closeDetails = () => {
        setSelectedListing(null);
        setShowPopup(false);
        navigate('?details=false'); // Update the URL
    };

    const handleListingUpdate = (updatedListing: any) => {
        // Update the selected listing
        setSelectedListing(updatedListing);
        
        // Update the listing in the listings array
        setListings(prevListings => 
            prevListings.map(listing => 
                listing.listingID === updatedListing.listingID ? updatedListing : listing
            )
        );
    };

    useEffect(() => {
        // Update body class when cart is visible
        if (cartVisible) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }

        return () => {
            document.body.classList.remove('modal-open');
        };
    }, [cartVisible]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo(0, 0); // Scroll to top when page changes
    };

    return (
        <div className="trading-page">
            <TradingHeader 
                createListing={createListing} 
                toggleCartVisibility={toggleCartVisibility}
                cart={cart}
                searchQuery={searchQuery}
                handleSearch={handleSearch}
                filterQuery={filterQuery}
                handleFilter={(e) => setFilterQuery(e.target.value)}
                filterType={filterType}
                handleFilterTypeChange={(e) => setFilterType(e.target.value)}
            />
            {loading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading listings...</p>
                </div>
            ) : listings.length === 0 ? (
                <div className="no-results">
                    <p>No listings found</p>
                </div>
            ) : (
                <>
                    {/* Main Content */}
                    {isCheckingOut ? (
                        <Checkout 
                            selectedItems={checkoutItems}
                            onCheckoutComplete={handleCheckoutComplete}
                            onBack={handleBack}
                        />
                    ) : showPopup && selectedListing ? (
                        <TradingDetails 
                            listing={selectedListing}
                            closeDetails={closeDetails}
                            addToCart={promptQuantity}
                            onListingUpdate={handleListingUpdate}
                        />
                    ) : (
                        <TradingResultsGrid 
                            results={searchQuery ? searchResults : listings}
                            addToCart={promptQuantity}
                            buyNow={handleBuyNow}
                            showDetails={showDetails}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalResults={totalResults}
                            onPageChange={handlePageChange}
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
