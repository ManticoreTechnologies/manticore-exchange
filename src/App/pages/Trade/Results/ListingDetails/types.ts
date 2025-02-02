export interface Balance {
  asset_name: string;
  confirmed_balance: string;
  pending_balance: string;
  last_confirmed_tx_hash: string | null;
  last_confirmed_tx_time: string | null;
}

export interface Price {
  asset_name: string;
  price_evr: string;
  price_asset_name: string | null;
  price_asset_amount: string | null;
  ipfs_hash: string | null;
}

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
} 