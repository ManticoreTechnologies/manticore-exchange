import { useState, useEffect } from 'react';

export interface CartItem {
  listingId: string;
  name: string;
  description: string;
  image_ipfs_hash: string | null;
  quantity: number;
  unitPrice: string;
  asset_name: string;
  seller_address: string;
}

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('manticore_cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const addToCart = (item: CartItem) => {
    setCartItems(prevItems => {
      // Check if item already exists
      const existingItemIndex = prevItems.findIndex(
        i => i.listingId === item.listingId && i.asset_name === item.asset_name
      );

      let newItems;
      if (existingItemIndex !== -1) {
        // Update quantity if item exists
        newItems = [...prevItems];
        newItems[existingItemIndex].quantity += item.quantity;
      } else {
        // Add new item if it doesn't exist
        newItems = [...prevItems, item];
      }

      // Save to localStorage
      localStorage.setItem('manticore_cart', JSON.stringify(newItems));
      return newItems;
    });
  };

  const removeFromCart = (listingId: string, assetName: string) => {
    setCartItems(prevItems => {
      const newItems = prevItems.filter(
        item => !(item.listingId === listingId && item.asset_name === assetName)
      );
      localStorage.setItem('manticore_cart', JSON.stringify(newItems));
      return newItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('manticore_cart');
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    cartCount: cartItems.length
  };
};

export default useCart; 