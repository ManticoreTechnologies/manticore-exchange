import React, { useEffect, useRef, useState, useCallback } from 'react';
import TradingResultsGrid from './Results/ResultsGrid/TradingResultsGrid';
import Cart from './Cart/Cart';
import Checkout from './Checkout/Checkout';
import CreateListing from './CreateListing/CreateListing';  
import './Trading.css';
import axios from 'axios';
import TradingHeader from './TradingHeader/TradingHeader';
import InvoiceToaster from './InvoiceToaster/InvoiceToaster';
import ManageListing from './ManageListing/ManageListing';
import TradingDetails from './Results/TradingDetails/TradingDetails';
import { useNavigate, useLocation } from 'react-router-dom';
import FeaturedListings from './TradingHeader/FeaturedListings';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { debounce } from 'lodash';
import Cookies from 'js-cookie';
import {
    Listing,
    SelectedListing,
    FeaturedListing,
    WebSocketMessage,
    WebSocketEvent,
    WebSocketCloseEvent,
    ListingUpdate,
    OrderUpdate,
    BalanceUpdate,
    MarketUpdate,
    CheckoutItem,
    CartItem,
    Balance,
    ListingsResponse
} from './types';

const Trading: React.FC = () => {
    const [listings, setListings] = useState<Listing[]>([]);
    const [cartVisible, setCartVisible] = useState<boolean>(false);
    const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);
    const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
    const [isCreatingListing, setIsCreatingListing] = useState<boolean>(false); 
    const [cart, setCart] = useState<CartItem[]>([]);
    const [quantityPopupVisible, setQuantityPopupVisible] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<SelectedListing | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [totalCost, setTotalCost] = useState<string>('0');
    const [quantityError, setQuantityError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [showPopup, setShowPopup] = useState<boolean>(true);
    const [selectedListing, setSelectedListing] = useState<SelectedListing | null>(null);
    const [searchResults, setSearchResults] = useState<Listing[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchColumn, setSearchColumn] = useState<string>('asset_name');
    const [filterQuery, setFilterQuery] = useState<string>('');
    const [filterType, setFilterType] = useState<string>('');
    const [filterValue, setFilterValue] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [totalResults, setTotalResults] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);
    const [tags, setTags] = useState<string[]>([]);
    const [minPrice, setMinPrice] = useState<string>('');
    const [maxPrice, setMaxPrice] = useState<string>('');
    const [featuredListings, setFeaturedListings] = useState<FeaturedListing[]>([]);
    const [wsConnected, setWsConnected] = useState<boolean>(false);
    const [userAddress, setUserAddress] = useState<string>('');

    // @ts-ignore
    const cartRef = useRef<HTMLDivElement>(null);

    // Update API endpoint configuration to use localhost:8000
    const trading_api_host = 'localhost';
    const trading_api_port = 8000;
    const trading_api_proto = 'http';
    const trading_api_url = `${trading_api_proto}://${trading_api_host}:${trading_api_port}`;

    const navigate = useNavigate();
    const location = useLocation();

    // WebSocket setup with heartbeat
    const ws_host = 'localhost';
    const ws_port = '8000';
    const wsBaseUrl = `ws://${ws_host}:${ws_port}`;
    
    // Heartbeat interval (15 seconds)
    const HEARTBEAT_INTERVAL = 15000;
    const RECONNECT_INTERVAL = 3000;

    // Create separate WebSocket connections for different endpoints
    const { sendMessage: sendListingMessage, lastMessage: lastListingMessage, readyState: listingReadyState } = useWebSocket(`${wsBaseUrl}/ws/listings`, {
        onOpen: () => {
            console.log('Listings WebSocket connected');
            setWsConnected(true);
            // Start heartbeat
            const interval = setInterval(() => {
                sendListingMessage(JSON.stringify({ type: 'ping' }));
            }, HEARTBEAT_INTERVAL);
            return () => clearInterval(interval);
        },
        onClose: () => {
            console.log('Listings WebSocket disconnected');
            setWsConnected(false);
        },
        onError: (error) => {
            console.error('Listings WebSocket error:', error);
            setWsConnected(false);
        },
        onMessage: (event: WebSocketEvent) => {
            try {
                const message: WebSocketMessage = JSON.parse(event.data);
                if (message.type === 'pong') {
                    console.log('Received pong from listings');
                    return;
                }
                if (message.type === 'listing_update') {
                    handleWebSocketMessage(message);
                }
            } catch (error) {
                console.error('Error parsing listings WebSocket message:', error);
            }
        },
        reconnectAttempts: 10,
        reconnectInterval: RECONNECT_INTERVAL,
        shouldReconnect: (closeEvent: WebSocketCloseEvent) => true,
        heartbeat: {
            message: JSON.stringify({ type: 'ping' }),
            interval: HEARTBEAT_INTERVAL,
            timeout: HEARTBEAT_INTERVAL * 2
        }
    });

    const { sendMessage: sendOrderMessage, lastMessage: lastOrderMessage, readyState: orderReadyState } = useWebSocket(`${wsBaseUrl}/ws/orders`, {
        onOpen: () => {
            console.log('Orders WebSocket connected');
            // Start heartbeat
            const interval = setInterval(() => {
                sendOrderMessage(JSON.stringify({ type: 'ping' }));
            }, HEARTBEAT_INTERVAL);
            return () => clearInterval(interval);
        },
        onClose: () => {
            console.log('Orders WebSocket disconnected');
        },
        onError: (error) => {
            console.error('Orders WebSocket error:', error);
        },
        onMessage: (event: WebSocketEvent) => {
            try {
                const message: WebSocketMessage = JSON.parse(event.data);
                if (message.type === 'pong') {
                    console.log('Received pong from orders');
                    return;
                }
                if (message.type === 'order_update') {
                    handleWebSocketMessage(message);
                }
            } catch (error) {
                console.error('Error parsing orders WebSocket message:', error);
            }
        },
        reconnectAttempts: 10,
        reconnectInterval: RECONNECT_INTERVAL,
        shouldReconnect: (closeEvent: WebSocketCloseEvent) => true,
        heartbeat: {
            message: JSON.stringify({ type: 'ping' }),
            interval: HEARTBEAT_INTERVAL,
            timeout: HEARTBEAT_INTERVAL * 2
        }
    });

    const { sendMessage: sendMarketMessage, lastMessage: lastMarketMessage, readyState: marketReadyState } = useWebSocket(`${wsBaseUrl}/ws/market`, {
        onOpen: () => {
            console.log('Market WebSocket connected');
            // Start heartbeat
            const interval = setInterval(() => {
                sendMarketMessage(JSON.stringify({ type: 'ping' }));
            }, HEARTBEAT_INTERVAL);
            return () => clearInterval(interval);
        },
        onClose: () => {
            console.log('Market WebSocket disconnected');
        },
        onError: (error) => {
            console.error('Market WebSocket error:', error);
        },
        onMessage: (event: WebSocketEvent) => {
            try {
                const message: WebSocketMessage = JSON.parse(event.data);
                if (message.type === 'pong') {
                    console.log('Received pong from market');
                    return;
                }
                if (message.type === 'market_update') {
                    handleWebSocketMessage(message);
                }
            } catch (error) {
                console.error('Error parsing market WebSocket message:', error);
            }
        },
        reconnectAttempts: 10,
        reconnectInterval: RECONNECT_INTERVAL,
        shouldReconnect: (closeEvent: WebSocketCloseEvent) => true,
        heartbeat: {
            message: JSON.stringify({ type: 'ping' }),
            interval: HEARTBEAT_INTERVAL,
            timeout: HEARTBEAT_INTERVAL * 2
        }
    });

    // Update the handleWebSocketMessage callback to use the appropriate sendMessage function
    const handleWebSocketMessage = useCallback((message: WebSocketMessage) => {
        switch (message.type) {
            case 'listing_update':
                setListings(prevListings => 
                    prevListings.map(listing => 
                        listing.id === (message.data as ListingUpdate).id 
                            ? { ...listing, ...(message.data as ListingUpdate) } 
                            : listing
                    )
                );
                break;
            case 'order_update':
                if (selectedListing && selectedListing.id === (message.data as OrderUpdate).listing_id) {
                    setSelectedListing((prev: SelectedListing | null) => prev ? { ...prev, ...(message.data as OrderUpdate) } : null);
                }
                break;
            case 'balance_update':
                if (selectedListing && selectedListing.id === (message.data as BalanceUpdate).listing_id) {
                    setSelectedListing((prev: SelectedListing | null) => prev ? {
                        ...prev,
                        balances: prev.balances?.map((balance: Balance) =>
                            balance.asset_name === (message.data as BalanceUpdate).asset_name
                                ? { ...balance, ...(message.data as BalanceUpdate) }
                                : balance
                        ) || []
                    } : null);
                }
                break;
            case 'market_update':
                const marketData = message.data as MarketUpdate;
                if (marketData.trending) {
                    setFeaturedListings(marketData.trending);
                }
                break;
        }
    }, [selectedListing]);

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
        // Get user address from cookies or local storage
        const address = Cookies.get('user_address') || localStorage.getItem('user_address') || '';
        setUserAddress(address);
    }, []);

    // Modify fetchListings to use proper types and handle the API response correctly
    const fetchListings = useCallback(async () => {
        try {
            setLoading(true);
            const offset = (currentPage - 1) * pageSize;
            let url = `${trading_api_url}/listings/search`;
            
            // Add search and filter parameters
            const params = new URLSearchParams({
                limit: pageSize.toString(),
                offset: offset.toString()
            });

            if (searchQuery) params.append('search', searchQuery);
            if (filterType && filterQuery) {
                switch(filterType) {
                    case 'seller':
                        params.append('seller_address', filterQuery);
                        break;
                    case 'asset':
                        params.append('asset_name', filterQuery);
                        break;
                }
            }
            if (tags.length > 0) {
                tags.forEach(tag => params.append('tags', tag.trim()));
            }
            if (minPrice) params.append('min_price', minPrice);
            if (maxPrice) params.append('max_price', maxPrice);

            url = `${url}?${params.toString()}`;
            console.log('Fetching listings from:', url);
            
            const response = await axios.get<ListingsResponse>(url);
            const { listings: fetchedListings, total_count, total_pages, current_page } = response.data;
            
            // Update listings with the results
            setListings(fetchedListings);
            setTotalResults(total_count);
            setTotalPages(total_pages);
            setCurrentPage(current_page);
            
            // Update featured listings with the first 3 items
            if (fetchedListings.length > 0) {
                const featured = fetchedListings.slice(0, 3).map((listing: Listing) => ({
                    id: listing.id,
                    title: listing.name,
                    store_name: listing.name,
                    asset_name: listing.balances[0]?.asset_name || '',
                    price: listing.prices[0]?.price_evr || '0',
                    highlight: isNewListing(listing.created_at) ? 'New' : undefined,
                    image_hash: listing.image_ipfs_hash
                }));
                
                setFeaturedListings(featured);
            }
            
        } catch (error) {
            console.error('Error fetching listings:', error);
            setListings([]);
            setFeaturedListings([]);
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, searchQuery, filterType, filterQuery, tags, minPrice, maxPrice]);

    // Add effect to fetch listings on mount and when dependencies change
    useEffect(() => {
        fetchListings();
    }, [fetchListings]);

    // Add debounced search
    const debouncedSearch = useCallback(
        debounce((value: string) => {
            setSearchQuery(value);
        }, 300),
        []
    );

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        debouncedSearch(value);
    };

    // Helper function to check if a listing is new (less than 24 hours old)
    const isNewListing = (createdAt: string): boolean => {
        const created = new Date(createdAt);
        const now = new Date();
        const diffInHours = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
        return diffInHours < 24;
    };

    const addToCart = (item: CartItem) => {
        const updatedCart = [...cart, item];
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
        navigate('/trade/create');
    };

    const handleBuyNow = (listing: Listing) => {
        setSelectedItem(listing);
        setQuantity(1);
        setQuantityError(null);
        const price = listing.prices[0];
        if (price) {
            const unitPrice = parseFloat(price.price_evr || '0');
            calculateTotalCost(unitPrice, 1);
        }
        setQuantityPopupVisible(true);
    };

    const handleCheckout = () => {
        if (selectedItem) {
            const balance = selectedItem.balances[0];
            const price = selectedItem.prices[0];
            
            if (!balance || !price) {
                console.error('Missing balance or price information.');
                return;
            }

            const checkoutItem: CheckoutItem = {
                id: selectedItem.id,
                listingId: selectedItem.id,
                name: selectedItem.name,
                description: selectedItem.description,
                quantity: quantity,
                unitPrice: parseFloat(price.price_evr || '0'),
                totalPrice: parseFloat(totalCost),
                asset_name: balance.asset_name,
                image_ipfs_hash: selectedItem.image_ipfs_hash,
                seller_address: selectedItem.seller_address
            };
            setCheckoutItems([checkoutItem]);
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

    const promptQuantity = (listing: Listing) => {
        setSelectedItem(listing);
        setQuantity(1);
        setQuantityError(null);
        const price = listing.prices[0];
        if (price) {
            const unitPrice = parseFloat(price.price_evr || '0');
            calculateTotalCost(unitPrice, 1);
        }
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
        if (selectedItem) {
            const cappedQty = parseFloat(qty.toFixed(8));
            setQuantity(cappedQty);

            const balance = selectedItem.balances[0];
            if (!balance) {
                setQuantityError('No balance information available.');
                return;
            }

            const maxQuantity = parseFloat(balance.confirmed_balance || '0');
            const step = Math.pow(10, -(balance.units || 0));

            if (cappedQty > maxQuantity) {
                setQuantityError(`Maximum available quantity is ${maxQuantity}.`);
            } else if (cappedQty % step !== 0) {
                setQuantityError(`Quantity must be a multiple of ${step}.`);
            } else {
                setQuantityError(null);
                setQuantity(cappedQty);
                const price = selectedItem.prices[0];
                if (price) {
                    const unitPrice = parseFloat(price.price_evr || '0');
                    calculateTotalCost(unitPrice, cappedQty);
                }
            }
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
        if (selectedItem && quantity > 0) {
            const balance = selectedItem.balances[0];
            const price = selectedItem.prices[0];
            
            if (!balance || !price) {
                setQuantityError('Missing balance or price information.');
                return;
            }

            const maxQuantity = parseFloat(balance.confirmed_balance || '0');

            if (quantity > maxQuantity) {
                setQuantityError(`Cannot add more than the available quantity of ${maxQuantity}.`);
                return;
            }

            const cartItem: CartItem = {
                id: selectedItem.id,
                listingId: selectedItem.id,
                name: selectedItem.name,
                description: selectedItem.description,
                quantity: quantity,
                unitPrice: parseFloat(price.price_evr || '0'),
                totalPrice: parseFloat(totalCost),
                asset_name: balance.asset_name,
                image_ipfs_hash: selectedItem.image_ipfs_hash,
                seller_address: selectedItem.seller_address
            };

            addToCart(cartItem);
        }
    };

    const showDetails = (listing: any) => {
        navigate(`/trade/listings/by-id/${listing.id}`);
    };

    const closeDetails = () => {
        setSelectedListing(null);
        setShowPopup(false);
        navigate('?details=false'); // Update the URL
    };

    const handleListingUpdate = (updatedListing: Listing) => {
        // Update the selected listing
        setSelectedListing(updatedListing);
        
        // Update the listing in the listings array
        setListings(prevListings => 
            prevListings.map(listing => 
                listing.id === updatedListing.id ? updatedListing : listing
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
        console.log('Changing to page:', page);
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo(0, 0);
        } else {
            console.warn('Invalid page number:', page);
        }
    };

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tagString = e.target.value;
        const tagArray = tagString.split(',').map(tag => tag.trim()).filter(tag => tag);
        setTags(tagArray);
    };

    const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMinPrice(e.target.value);
    };

    const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMaxPrice(e.target.value);
    };

    const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterQuery(e.target.value);
    };

    const handleFilterTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterType(e.target.value);
    };

    const handleFeaturedClick = (listing: any) => {
        navigate(`/trade/listings/by-id/${listing.id}`);
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
                handleFilter={handleFilter}
                filterType={filterType}
                handleFilterTypeChange={handleFilterTypeChange}
                tags={tags}
                handleTagsChange={handleTagsChange}
                minPrice={minPrice}
                handleMinPriceChange={handleMinPriceChange}
                maxPrice={maxPrice}
                handleMaxPriceChange={handleMaxPriceChange}
                isConnected={wsConnected}
                featuredListings={featuredListings}
                onFeaturedClick={handleFeaturedClick}
            />

            {/* Featured listings now outside header */}
            <div className="featured-section">
                <FeaturedListings 
                    listings={featuredListings}
                    onListingClick={handleFeaturedClick}
                />
            </div>

            {/* Rest of the content */}
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

            {isCreatingListing && userAddress && (
                <CreateListing 
                    onClose={() => setIsCreatingListing(false)} 
                    onComplete={handleListingComplete}
                    userAddress={userAddress}
                />
            )}
            
            <InvoiceToaster />

        </div>
    );
};

export default Trading;
