import { useState, useEffect, useCallback } from 'react';

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

// Create a custom event for cart updates
const CART_UPDATED_EVENT = 'cartUpdated';
const cartUpdateEvent = new Event(CART_UPDATED_EVENT);

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);

  // Function to load cart data
  const loadCart = useCallback(() => {
    const savedCart = localStorage.getItem('manticore_cart');
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        setCartItems(items);
        const totalCount = items.reduce((total: number, item: CartItem) => total + item.quantity, 0);
        setCartCount(totalCount);
      } catch (error) {
        console.error('Error loading cart:', error);
        localStorage.removeItem('manticore_cart');
        setCartItems([]);
        setCartCount(0);
      }
    } else {
      setCartItems([]);
      setCartCount(0);
    }
  }, []);

  // Load initial cart and set up listeners
  useEffect(() => {
    loadCart();

    // Listen for custom event
    const handleCartUpdate = () => loadCart();
    window.addEventListener(CART_UPDATED_EVENT, handleCartUpdate);

    // Listen for storage changes (other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'manticore_cart') {
        loadCart();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, handleCartUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadCart]);

  const addToCart = useCallback((item: CartItem) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        i => i.listingId === item.listingId && i.asset_name === item.asset_name
      );

      let newItems;
      if (existingItemIndex !== -1) {
        newItems = [...prevItems];
        newItems[existingItemIndex].quantity += item.quantity;
      } else {
        newItems = [...prevItems, item];
      }

      // Save to localStorage and dispatch event
      localStorage.setItem('manticore_cart', JSON.stringify(newItems));
      window.dispatchEvent(cartUpdateEvent);

      return newItems;
    });
  }, []);

  const removeFromCart = useCallback((listingId: string, assetName: string) => {
    setCartItems(prevItems => {
      const newItems = prevItems.filter(
        item => !(item.listingId === listingId && item.asset_name === assetName)
      );
      
      // Save to localStorage and dispatch event
      localStorage.setItem('manticore_cart', JSON.stringify(newItems));
      window.dispatchEvent(cartUpdateEvent);

      return newItems;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem('manticore_cart');
    window.dispatchEvent(cartUpdateEvent);
  }, []);

  return {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    cartCount
  };
};

export default useCart; 