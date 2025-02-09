export interface ListingPrice {
    asset_name: string;
    price_evr: string;
    price_asset_name: string | null;
    price_asset_amount: string | null;
    ipfs_hash: string;
}

export interface ListingBalance {
    asset_name: string;
    confirmed_balance: string;
    pending_balance: string;
    last_confirmed_tx_hash: string | null;
    last_confirmed_tx_time: string | null;
}

export interface Listing {
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
    tags?: string[];
    listingID?: string;
    ipfsHash?: string;
    listingAddress?: string;
}

export interface SelectedListing extends Listing {
    quantity?: number;
    unitPrice?: number;
    totalPrice?: number;
    asset_name?: string;
    listingId?: string;
    [key: string]: any;
}

export interface FeaturedListing {
    id: string;
    title: string;
    store_name: string;
    price: string;
    asset_name: string;
    highlight?: string;
    image_hash: string | null;
    balance?: string;
}

export interface WebSocketMessage {
    type: 'listing_update' | 'order_update' | 'balance_update' | 'market_update';
    data: ListingUpdate | OrderUpdate | BalanceUpdate | MarketUpdate;
}

export interface ListingUpdate {
    id: string;
    [key: string]: any;
}

export interface OrderUpdate {
    listing_id: string;
    [key: string]: any;
}

export interface BalanceUpdate {
    listing_id: string;
    asset_name: string;
    confirmed_balance: string;
    pending_balance: string;
}

export interface MarketUpdate {
    trending?: FeaturedListing[];
}

export interface WebSocketEvent {
    data: string;
}

export interface WebSocketCloseEvent {
    code: number;
    reason: string;
    wasClean: boolean;
}

export interface CartItem {
    id: string;
    listingId: string;
    name: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    asset_name: string;
    image_ipfs_hash?: string;
    seller_address: string;
}

export interface CheckoutItem extends CartItem {
    // Additional checkout-specific fields can be added here
}

export interface TradingHeaderProps {
    createListing: () => void;
    toggleCartVisibility: () => void;
    cart: any[];
    searchQuery: string;
    handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
    filterQuery: string;
    handleFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
    filterType: string;
    handleFilterTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    tags: string[];
    handleTagsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    minPrice: string;
    handleMinPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    maxPrice: string;
    handleMaxPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isConnected: boolean;
    featuredListings: FeaturedListing[];
    onFeaturedClick: (listing: FeaturedListing) => void;
} 