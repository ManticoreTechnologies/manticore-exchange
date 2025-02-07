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
import FeaturedListings from './TradingHeader/FeaturedListings'; // Add this import

interface ListingPrice {
    asset_name: string;
    price_evr: string;
    price_asset_name: string | null;
    price_asset_amount: string | null;
    ipfs_hash: string;
}

interface ListingBalance {
    asset_name: string;
    confirmed_balance: string;
    pending_balance: string;
    last_confirmed_tx_hash: string | null;
    last_confirmed_tx_time: string | null;
}

interface Listing {
    id: string;
    seller_address: string;
    listing_address: string;
    deposit_address: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
    status: string;
    image_ipfs_hash: string | null;
    prices: ListingPrice[];
    balances: ListingBalance[];
}

interface FeaturedListing {
    id: string;
    title: string;
    store_name: string;
    price: string;
    asset_name: string;
    highlight?: string;
    image_hash: string | null;
    balance?: string;
}

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
    const [pageSize, setPageSize] = useState<number>(10); // Add this new state
    const [tags, setTags] = useState<string[]>([]);
    const [minPrice, setMinPrice] = useState<string>('');
    const [maxPrice, setMaxPrice] = useState<string>('');
    const [featuredListings, setFeaturedListings] = useState<FeaturedListing[]>([]);

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
                
                // Add filter params based on filterType
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

                // Add tags if they exist
                if (tags.length > 0) {
                    tags.forEach(tag => {
                        url += `&tags=${encodeURIComponent(tag.trim())}`;
                    });
                }

                // Add price filters if they exist
                if (minPrice) {
                    url += `&min_price_evr=${encodeURIComponent(minPrice)}`;
                }
                if (maxPrice) {
                    url += `&max_price_evr=${encodeURIComponent(maxPrice)}`;
                }

                console.log('Fetching listings with URL:', url);
                const response = await axios.get(url);
                
                // Log the entire response to see what we're getting
                console.log('Full API Response:', response.data);
                
                const { listings, total_count, total_pages, current_page } = response.data;
                
                console.log('Total Count:', total_count);
                console.log('Total Pages:', total_pages);
                console.log('Current Page:', current_page);
                
                // Update state with the pagination info from backend
                setTotalResults(total_count);
                setTotalPages(total_pages);
                setCurrentPage(current_page);
                
                if (Array.isArray(listings)) {
                    setListings(listings);
                    setSearchResults(listings);
                    
                    // Updated featured listings mapping
                    const featured = listings.slice(0, 3).map(listing => {
                        const price = listing.prices?.[0]?.price_evr || '0';
                        const assetName = listing.balances?.[0]?.asset_name || '';
                        const imageHash = listing.image_ipfs_hash || listing.prices?.[0]?.ipfs_hash || null;
                        
                        return {
                            id: listing.id,
                            title: listing.name,
                            store_name: listing.name,
                            asset_name: assetName,
                            price: price,
                            highlight: isNewListing(listing.created_at) ? 'New' : undefined,
                            image_hash: imageHash
                        };
                    });
                    
                    setFeaturedListings(featured);
                } else {
                    console.error('Unexpected listings format:', listings);
                    setListings([]);
                    setFeaturedListings([]);
                }
            } catch (error) {
                console.error('Error fetching listings:', error);
                setListings([]);
                setFeaturedListings([]);
            } finally {
                setLoading(false);
            }
        };

        // Load cart from local storage
        const savedCart = localStorage.getItem('manticore_cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
        fetchListings();
    }, [currentPage, pageSize, searchQuery, filterType, filterQuery, tags, minPrice, maxPrice]);

    // Helper function to check if a listing is new (less than 24 hours old)
    const isNewListing = (createdAt: string): boolean => {
        const created = new Date(createdAt);
        const now = new Date();
        const diffInHours = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
        return diffInHours < 24;
    };

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
        navigate(`/listing/${listing.id}`);
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
