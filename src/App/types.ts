export interface Listing {
    id: string;
    seller_address: string;
    listing_address: string;
    deposit_address: string;
    name: string;
    description: string;
    image_ipfs_hash: string | null;
    status: string;
    created_at: string;
    updated_at: string;
    prices: Price[];
    balances: Balance[];
    listingID?: string;
    ipfsHash?: string;
    listingAddress?: string;
    severity?: string;
}

export interface SelectedListing extends Listing {
    quantity?: number;
    unitPrice?: number;
    totalPrice?: number;
    units?: number;
    asset_name?: string;
}

export interface Price {
    asset_name: string;
    price_evr: string;
    price_asset_name?: string | null;
    price_asset_amount?: string | null;
    ipfs_hash?: string | null;
    units: number;
}

export interface Balance {
    asset_name: string;
    confirmed_balance: string;
    pending_balance: string;
    units: number;
} 