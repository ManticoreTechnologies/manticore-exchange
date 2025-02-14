import { useState, useEffect, useCallback } from 'react';
import TradingService from '@/Application/services/TradingService';
import { toast } from 'react-toastify';
import { useAuth } from '@/Application/contexts/AuthContext';

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
  const [isProcessing, setIsProcessing] = useState(false);
  const { userAddress } = useAuth();

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
    updateCartAndNotify(null);
  }, [updateCartAndNotify]);

  const processCart = useCallback(async () => {
    if (!userAddress) {
      toast.error('Please sign in to proceed with checkout');
      return null;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return null;
    }

    setIsProcessing(true);
    try {
      // Group items by listing
      const itemsByListing = cartItems.reduce((acc, item) => {
        if (!acc[item.listingId]) {
          acc[item.listingId] = [];
        }
        acc[item.listingId].push({
          asset_name: item.asset_name,
          amount: item.quantity.toString()
        });
        return acc;
      }, {} as Record<string, { asset_name: string; amount: string; }[]>);

      // Create orders for each listing
      const orders = await Promise.all(
        Object.entries(itemsByListing).map(([listingId, items]) =>
          TradingService.createOrder(listingId, {
            buyer_address: userAddress,
            items
          })
        )
      );

      // Clear cart after successful order creation
      clearCart();

      return orders;
    } catch (error: any) {
      if (error.code === 'INSUFFICIENT_BALANCE') {
        toast.error('Insufficient balance in listing');
      } else if (error.code === 'LISTING_NOT_FOUND') {
        toast.error('One or more listings not found');
      } else {
        toast.error('Failed to create order: ' + error.message);
      }
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [cartItems, userAddress, clearCart]);

  return {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    cartCount,
    processCart,
    isProcessing
  };
};

export default useCart; 