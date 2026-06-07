import React, { createContext, useContext, useState, useEffect } from 'react';
import { requiresQuotation } from '../utils/productHelpers';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = sessionStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    sessionStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const showAddToCartToast = () => {
    // Remove any existing toast
    const existingToast = document.getElementById('cart-toast');
    if (existingToast) {
      document.body.removeChild(existingToast);
    }

    const toast = document.createElement('div');
    toast.id = 'cart-toast';
    toast.className = 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900/90 backdrop-blur-md text-white px-6 py-4 md:px-10 md:py-6 rounded-2xl md:rounded-[32px] shadow-2xl z-[10000] font-black uppercase tracking-widest flex flex-col items-center gap-2 md:gap-4 animate-in fade-in zoom-in duration-300 w-[80%] max-w-[280px] md:w-auto md:max-w-none';
    toast.innerHTML = `
      <div class="w-10 h-10 md:w-16 md:h-16 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
        <svg class="w-5 h-5 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <span class="text-xs md:text-lg text-center">Item Added to Cart</span>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('opacity-0', 'scale-95', 'transition-all', 'duration-500');
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 500);
    }, 1500);
  };

  const addToCart = (product, quantity = 1, silent = false) => {
    if (requiresQuotation(product)) return;
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === product._id);
      if (existingItem) {
        return prevCart.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });

    if (!silent) {
      showAddToCartToast();
    }
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    setCart(prevCart =>
      prevCart.map(item =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Wishlist Logic
  const [wishlist, setWishlist] = useState(() => {
    const saved = sessionStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    sessionStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product) => {
    if (!wishlist.find(item => item._id === product._id)) {
      setWishlist([...wishlist, product]);
    }
  };

  const removeFromWishlist = (productId) => {
    setWishlist(wishlist.filter(item => item._id !== productId));
  };

  const toggleWishlist = (product) => {
    if (wishlist.find(item => item._id === product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item._id === productId);
  };

  const isIndustrialCart = false; // Standardized to always false to allow regular checkout for all items

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getCartTotal,
      getCartCount,
      wishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isInWishlist,
      isIndustrialCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
