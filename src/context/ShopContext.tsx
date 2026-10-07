import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';
import { PRODUCTS } from '../data/products';

type CurrencyType = 'USD' | 'EUR' | 'GBP';

interface CurrencyRate {
  symbol: string;
  rate: number;
}

const CURRENCY_MAP: Record<CurrencyType, CurrencyRate> = {
  USD: { symbol: '$', rate: 1.0 },
  EUR: { symbol: '€', rate: 0.92 },
  GBP: { symbol: '£', rate: 0.79 },
};

interface ShopContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedColor?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  currency: CurrencyType;
  setCurrency: (c: CurrencyType) => void;
  formatPrice: (usdPrice: number) => string;

  activeCategory: string;
  setActiveCategory: (cat: string) => void;

  searchQuery: string;
  setSearchQuery: (q: string) => void;

  quickViewProduct: Product | null;
  setQuickViewProduct: (p: Product | null) => void;

  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;

  isStyleAdvisorOpen: boolean;
  setIsStyleAdvisorOpen: (open: boolean) => void;

  viewMode: 'desktop' | 'mobile_app';
  setViewMode: (mode: 'desktop' | 'mobile_app') => void;

  toast: string | null;
  showToast: (msg: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: PRODUCTS[2], // Everyday Handbag
      quantity: 1,
      selectedColor: '#0891B2',
    },
  ]);
  const [wishlist, setWishlist] = useState<string[]>([PRODUCTS[3].id]); // Classic Sunglasses
  const [currency, setCurrency] = useState<CurrencyType>('USD');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [isStyleAdvisorOpen, setIsStyleAdvisorOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile_app'>('desktop');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const addToCart = (product: Product, quantity = 1, selectedColor?: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity, selectedColor: selectedColor || item.selectedColor }
            : item
        );
      }
      return [...prev, { product, quantity, selectedColor: selectedColor || product.colors?.[0] }];
    });
    showToast(`Added "${product.name}" to your shopping bag.`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from shopping bag.');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        showToast('Item removed from your wishlist.');
        return prev.filter((id) => id !== productId);
      } else {
        const prod = PRODUCTS.find((p) => p.id === productId);
        showToast(`Saved "${prod?.name || 'Item'}" to your wishlist.`);
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  const formatPrice = (usdPrice: number) => {
    const { symbol, rate } = CURRENCY_MAP[currency];
    const converted = (usdPrice * rate).toFixed(2);
    return `${symbol}${converted}`;
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        wishlist,
        toggleWishlist,
        isWishlisted,
        currency,
        setCurrency,
        formatPrice,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        quickViewProduct,
        setQuickViewProduct,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isStyleAdvisorOpen,
        setIsStyleAdvisorOpen,
        viewMode,
        setViewMode,
        toast,
        showToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
