export interface Price {
    asset_name: string;
    price_evr: string;
    price_asset_name: string | null;
    price_asset_amount: string | null;
    ipfs_hash: string | null;
    units: number;
    created_at: string;
    updated_at: string;
}

export interface Balance {
    asset_name: string;
    confirmed_balance: string;
    pending_balance: string;
    units: number;
    last_confirmed_tx_hash: string | null;
    last_confirmed_tx_time: string | null;
    created_at: string;
    updated_at: string;
}

export interface Listing {
    id: string;
    seller_address: string;
    listing_address: string;
    deposit_address: string;
    name: string;
    description: string;
    image_ipfs_hash: string;
    balances: Balance[];
    prices: Price[];
    created_at: string;
    updated_at: string;
    units: number;
    isOwnedByUser?: boolean;
    status?: string;
    tags?: string[];
}

export interface SelectedListing extends Listing {
    units: number;
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
    image_ipfs_hash: string | null;
    seller_address: string;
}

export interface CheckoutItem {
    id: string;
    listingId: string;
    name: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    asset_name: string;
    image_ipfs_hash: string | undefined;
    seller_address: string;
}

export interface FeaturedListing {
    id: string;
    title: string;
    store_name: string;
    asset_name: string;
    price: string;
    highlight?: string;
    image_hash: string | null;
}

export interface ListingsResponse {
    listings: Listing[];
    total_count: number;
    total_pages: number;
    current_page: number;
    limit: number;
    offset: number;
}

export interface WebSocketMessage {
    type: string;
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
    [key: string]: any;
}

export interface MarketUpdate {
    trending?: FeaturedListing[];
    [key: string]: any;
}

export interface WebSocketEvent {
    data: string;
}

export interface WebSocketCloseEvent extends Event {
    code: number;
    reason: string;
    wasClean: boolean;
} 