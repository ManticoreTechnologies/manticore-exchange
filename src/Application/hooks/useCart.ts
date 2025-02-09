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

// Create a custom event for cart updates with data
const CART_UPDATED_EVENT = 'cartUpdated';
const createCartEvent = (count: number) => {
  return new CustomEvent(CART_UPDATED_EVENT, { 
    detail: { count } 
  });
};

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);

  const updateCartAndNotify = useCallback((newItems: CartItem[] | null) => {
    if (newItems === null) {
      setCartItems([]);
      setCartCount(0);
      localStorage.removeItem('manticore_cart');
      window.dispatchEvent(createCartEvent(0));
    } else {
      setCartItems(newItems);
      const newCount = newItems.reduce((total, item) => total + item.quantity, 0);
      setCartCount(newCount);
      localStorage.setItem('manticore_cart', JSON.stringify(newItems));
      window.dispatchEvent(createCartEvent(newCount));
    }
  }, []);

  // Load initial cart
  useEffect(() => {
    const savedCart = localStorage.getItem('manticore_cart');
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        updateCartAndNotify(items);
      } catch (error) {
        console.error('Error loading cart:', error);
        updateCartAndNotify(null);
      }
    }
  }, [updateCartAndNotify]);

  // Listen for storage changes and custom events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'manticore_cart') {
        const savedCart = localStorage.getItem('manticore_cart');
        if (savedCart) {
          try {
            const items = JSON.parse(savedCart);
            updateCartAndNotify(items);
          } catch (error) {
            console.error('Error loading cart:', error);
            updateCartAndNotify(null);
          }
        } else {
          updateCartAndNotify(null);
        }
      }
    };

    const handleCartUpdate = (e: CustomEvent) => {
      setCartCount(e.detail.count);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(CART_UPDATED_EVENT, handleCartUpdate as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(CART_UPDATED_EVENT, handleCartUpdate as EventListener);
    };
  }, [updateCartAndNotify]);

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

      updateCartAndNotify(newItems);
      return newItems;
    });
  }, [updateCartAndNotify]);

  const removeFromCart = useCallback((listingId: string, assetName: string) => {
    setCartItems(prevItems => {
      const newItems = prevItems.filter(
        item => !(item.listingId === listingId && item.asset_name === assetName)
      );
      updateCartAndNotify(newItems);
      return newItems;
    });
  }, [updateCartAndNotify]);

  const clearCart = useCallback(() => {
    // Immediately update state and localStorage
    setCartItems([]);
    setCartCount(0);
    localStorage.removeItem('manticore_cart');
    
    // Dispatch event with count 0
    window.dispatchEvent(createCartEvent(0));
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