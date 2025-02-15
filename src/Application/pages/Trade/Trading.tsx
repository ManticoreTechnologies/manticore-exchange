import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import TradingResultsGrid from './Results/ResultsGrid/TradingResultsGrid';
import Cart from './Cart/Cart';
import Checkout from './Checkout/Checkout';
import CreateListing from './CreateListing/CreateListing';  
import './Trading.css';
import axios from 'axios';
import TradingHeader from './TradingHeader/TradingHeader';
import InvoiceToaster from './InvoiceToaster/InvoiceToaster';
import ManageListing from './ManageListing/ManageListing';
import { useNavigate, useLocation } from 'react-router-dom';
import FeaturedListings from './TradingHeader/FeaturedListings';
import { debounce } from 'lodash';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import tradingService, { SearchParams } from '../../services/TradingService';

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
    const [homeListings, setHomeListings] = useState<any>(null);

    // @ts-ignore
    const cartRef = useRef<HTMLDivElement>(null);

    // Update API endpoint configuration to use localhost:8000
    const trading_api_host = '10.0.0.2';
    const trading_api_port = 8000;
    const trading_api_proto = 'http';
    const trading_api_url = `${trading_api_proto}://${trading_api_host}:${trading_api_port}`;

    const navigate = useNavigate();
    const location = useLocation();
    const { userAddress, isAuthenticated } = useAuth();

    // Add validation state
    const [priceRangeError, setPriceRangeError] = useState<string | null>(null);

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

    // Add effect to refetch listings when userAddress changes
    useEffect(() => {
        if (userAddress) {
            console.log('User address changed, refetching listings');
            fetchListings();
        }
    }, [userAddress]);

    // Add fetchHomeListings function
    const fetchHomeListings = useCallback(async () => {
        try {
            const response = await tradingService.getHomeListings({
                featured_count: 5,
                trending_count: 10,
                new_count: 10,
                trending_timeframe: '24h',
                new_hours: 24
            });
            
            if (response) {
                const allFeaturedListings = [
                    ...(response.featured?.listings || []).map((listing: Listing) => ({
                        id: listing.id,
                        title: listing.name,
                        store_name: listing.name,
                        asset_name: listing.balances[0]?.asset_name || '',
                        price: listing.prices[0]?.price_evr || '0',
                        image_hash: listing.image_ipfs_hash || listing.prices[0]?.ipfs_hash || null
                    })),
                    ...(response.new?.listings || []).map((listing: Listing) => ({
                        id: listing.id,
                        title: listing.name,
                        store_name: listing.name,
                        asset_name: listing.balances[0]?.asset_name || '',
                        price: listing.prices[0]?.price_evr || '0',
                        highlight: 'New',
                        image_hash: listing.image_ipfs_hash || listing.prices[0]?.ipfs_hash || null
                    })),
                    ...(response.trending?.listings || []).map((listing: Listing) => ({
                        id: listing.id,
                        title: listing.name,
                        store_name: listing.name,
                        asset_name: listing.balances[0]?.asset_name || '',
                        price: listing.prices[0]?.price_evr || '0',
                        highlight: 'Trending',
                        image_hash: listing.image_ipfs_hash || listing.prices[0]?.ipfs_hash || null
                    }))
                ];
                
                setFeaturedListings(allFeaturedListings);
                setHomeListings(response);
            }
        } catch (error) {
            console.error('Error fetching home listings:', error);
        }
    }, []);

    // Add effect to fetch home listings on mount
    useEffect(() => {
        fetchHomeListings();
    }, [fetchHomeListings]);

    // Validate price range
    const validatePriceRange = useCallback(() => {
        // Clear previous error
        setPriceRangeError(null);

        // If both fields are empty, that's valid
        if (!minPrice && !maxPrice) {
            return true;
        }

        const min = Number(minPrice);
        const max = Number(maxPrice);

        // Check if values are valid numbers
        if (minPrice && isNaN(min)) {
            setPriceRangeError('Minimum price must be a valid number');
            return false;
        }
        if (maxPrice && isNaN(max)) {
            setPriceRangeError('Maximum price must be a valid number');
            return false;
        }

        // Check if values are positive
        if (min < 0) {
            setPriceRangeError('Minimum price cannot be negative');
            return false;
        }
        if (max < 0) {
            setPriceRangeError('Maximum price cannot be negative');
            return false;
        }

        // If both values are set, check their relationship
        if (minPrice && maxPrice && min > max) {
            setPriceRangeError('Minimum price cannot be greater than maximum price');
            return false;
        }

        return true;
    }, [minPrice, maxPrice]);

    // Update fetchListings to include validation
    const fetchListings = useCallback(async () => {
        try {
            // Validate price range before proceeding
            if (!validatePriceRange()) {
                return;
            }

            setLoading(true);
            
            // Prepare search parameters
            const searchParams: SearchParams = {
                per_page: pageSize,
                page: currentPage
            };

            // Only add parameters if they have values
            if (searchQuery?.trim()) {
                searchParams.search_term = searchQuery.trim();
            }

            if (filterType && filterQuery?.trim()) {
                switch (filterType) {
                    case 'seller':
                        searchParams.seller_address = filterQuery.trim();
                        break;
                    case 'asset':
                        searchParams.asset_name = filterQuery.trim();
                        break;
                    case 'tags':
                        searchParams.tags = tags.filter(tag => tag.trim());
                        break;
                }
            }

            // Only add price filters if they're valid numbers
            if (minPrice?.trim()) {
                const min = Number(minPrice);
                if (!isNaN(min) && min >= 0) {
                    searchParams.min_price_evr = minPrice.trim();
                }
            }

            if (maxPrice?.trim()) {
                const max = Number(maxPrice);
                if (!isNaN(max) && max >= 0) {
                    searchParams.max_price_evr = maxPrice.trim();
                }
            }

            // Use trading service to search listings
            const response = await tradingService.searchListings(searchParams);
            
            // Process the listings
            const processedListings = response.listings.map(listing => ({
                ...listing,
                isOwnedByUser: userAddress ? listing.seller_address === userAddress : false
            }));
            
            setListings(processedListings);
            setTotalResults(response.total_count || 0);
            setTotalPages(Math.max(1, response.total_pages || 1));
            
            const validCurrentPage = Math.min(Math.max(1, response.current_page || 1), response.total_pages || 1);
            if (validCurrentPage !== currentPage) {
                setCurrentPage(validCurrentPage);
            }
            
            if (!searchQuery?.trim() && !filterQuery?.trim() && tags.length === 0 && !minPrice && !maxPrice) {
                await fetchHomeListings();
            }
            
        } catch (error) {
            console.error('Error fetching listings:', error);
            toast.error('Failed to fetch listings. Please try again.');
            setListings([]);
            setTotalResults(0);
            setTotalPages(1);
            setCurrentPage(1);
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, searchQuery, filterType, filterQuery, tags, minPrice, maxPrice, userAddress, validatePriceRange]);

    // Update the debounced search implementation
    const debouncedSearch = useMemo(
        () => debounce((value: string) => {
            setSearchQuery(value);
            setCurrentPage(1); // Reset to first page on new search
        }, 500),
        []
    );

    // Update handleSearch to use improved debounced function
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);  // Update the input value immediately for UI responsiveness
        debouncedSearch(value); // Debounce the actual search
    };

    // Update the search effect
    useEffect(() => {
        fetchListings();
    }, [fetchListings]);

    // Update handleFilter
    const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterQuery(e.target.value);
        setCurrentPage(1); // Reset to first page on new filter
    };

    // Update handleFilterTypeChange
    const handleFilterTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterType(e.target.value);
        setFilterQuery(''); // Clear the filter query when changing type
        setCurrentPage(1); // Reset to first page on filter type change
    };

    // Update handleTagsChange
    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tagString = e.target.value;
        const tagArray = tagString.split(',').map(tag => tag.trim()).filter(tag => tag);
        setTags(tagArray);
        setCurrentPage(1); // Reset to first page on tags change
    };

    // Update price filter handlers to validate on change
    const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setMinPrice(value);
        setCurrentPage(1);
        validatePriceRange();
    };

    const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setMaxPrice(value);
        setCurrentPage(1);
        validatePriceRange();
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

    const promptQuantity = (listing: Listing, quantity?: number) => {
        setSelectedItem(listing);
        setQuantity(quantity || 1);
        setQuantityError(null);
        const price = listing.prices[0];
        if (price) {
            const unitPrice = parseFloat(price.price_evr || '0');
            calculateTotalCost(unitPrice, quantity || 1);
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
        const validPage = Math.min(Math.max(1, page), totalPages);
        if (validPage !== currentPage) {
            setCurrentPage(validPage);
            window.scrollTo(0, 0);
        }
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
                loading={loading}
                featuredListings={featuredListings}
                onFeaturedClick={handleFeaturedClick}
                priceRangeError={priceRangeError}
                isConnected={!!userAddress}
            />

            {/* Rest of the content */}
            {loading ? (
                <TradingResultsGrid 
                    results={[]}
                    addToCart={() => {}}
                    buyNow={() => {}}
                    showDetails={() => {}}
                    currentPage={1}
                    totalPages={1}
                    totalResults={0}
                    onPageChange={() => {}}
                    isLoading={true}
                />
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
                    ) : (
                        <TradingResultsGrid 
                            results={listings}
                            addToCart={promptQuantity}
                            buyNow={handleBuyNow}
                            showDetails={showDetails}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalResults={totalResults}
                            onPageChange={handlePageChange}
                            isLoading={false}
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
                            min={Math.pow(10, -(selectedItem.units || 0))} 
                            step={Math.pow(10, -(selectedItem.units || 0))}
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
