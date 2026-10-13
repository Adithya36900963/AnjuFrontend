import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Product,
  CartItem,
  UserProfile,
  Order,
  OrderStatus,
  PaymentStatus,
  CustomerLocationRes,
  AdminLocationRes,
  LocationReq,
  PincodeRes,
  Category,
} from '../types';
import { INITIAL_ORDERS } from '../data/mockOrders';
import { locationService } from '../services/locationService';
import { productService } from '../services/productService';
import { cartApi } from '../services/cart/cartApi';
import { whishlistApi } from '../services/whishlist/whishlistApi';
import { orderApi } from '../services/orders/orderApi';
import { authApi } from '../services/auth/authApi';

type CurrencyType = 'USD' | 'EUR' | 'GBP' | 'INR';

interface CurrencyRate {
  symbol: string;
  rate: number;
}

const CURRENCY_MAP: Record<CurrencyType, CurrencyRate> = {
  USD: { symbol: '$', rate: 1.0 },
  EUR: { symbol: '€', rate: 0.92 },
  GBP: { symbol: '£', rate: 0.79 },
  INR: { symbol: '₹', rate: 85.0 },
};

interface ShopContextType {
  // Product Data Layer (Decoupled from dummy data via productService)
  products: Product[];
  categories: Category[];
  topSellers: Product[];
  featuredProducts: Product[];
  isLoadingProducts: boolean;
  productError: string | null;
  refreshProducts: () => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  brandAssets: {
    heroImage: string;
    editorialImage: string;
    tealHandbagImage: string;
    designerSunglassesImage: string;
    minimalWatchImage: string;
  };
  trustBadges: Array<{ icon: string; title: string; desc: string }>;

  cart: CartItem[];
  addToCart: (
    product: Product,
    quantity?: number,
    selectedColor?: string,
    selectedSize?: string,
    selectedVariantImage?: string
  ) => void;
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
  openCategory: (cat: string) => void;

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

  isFlutterModalOpen: boolean;
  setIsFlutterModalOpen: (open: boolean) => void;

  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;

  // Orders Management
  orders: Order[];
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order | null) => void;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  updateOrderPayment: (orderId: string, status: PaymentStatus, transactionId?: string) => void;
  updateShippingAddress: (orderId: string, address: Order['shippingAddress']) => void;
  createOrder: (order: Partial<Order>) => Order;
  openOrders: (orderId?: string) => void;

  // Address Management matching Spring Boot LocationController & PincodeController
  customerAddresses: CustomerLocationRes[];
  adminAddresses: AdminLocationRes[];
  selectedAddress: CustomerLocationRes | null;
  setSelectedAddress: (addr: CustomerLocationRes | null) => void;
  selectDeliveryAddress: (addr: CustomerLocationRes) => void;
  saveCustomerAddress: (req: LocationReq, isDefault?: boolean) => Promise<CustomerLocationRes>;
  updateCustomerAddress: (id: number, req: Partial<LocationReq>) => Promise<CustomerLocationRes>;
  updateDefaultCustomerAddress: (id: number) => Promise<void>;
  deleteCustomerAddress: (id: number) => Promise<void>;
  resolvePincode: (pin: string) => Promise<PincodeRes | null>;
  openAddressBook: () => void;

  user: UserProfile | null;
  login: (email: string, name?: string) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  viewMode: 'desktop' | 'mobile_app' | 'auth_page' | 'products' | 'orders' | 'addresses';
  setViewMode: (mode: 'desktop' | 'mobile_app' | 'auth_page' | 'products' | 'orders' | 'addresses') => void;
  isMobileScreen: boolean;
  windowWidth: number;
  isAutoResponsive: boolean;
  setIsAutoResponsive: (auto: boolean) => void;
  effectiveViewMode: 'desktop' | 'mobile_app' | 'auth_page' | 'products' | 'orders' | 'addresses';

  toast: string | null;
  showToast: (msg: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Product Catalog State (driven by productService)
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [topSellers, setTopSellers] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);
  const [productError, setProductError] = useState<string | null>(null);
  const [brandAssets, setBrandAssets] = useState<{
    heroImage: string;
    editorialImage: string;
    tealHandbagImage: string;
    designerSunglassesImage: string;
    minimalWatchImage: string;
  }>({
    heroImage: '',
    editorialImage: '',
    tealHandbagImage: '',
    designerSunglassesImage: '',
    minimalWatchImage: '',
  });
  const [trustBadges, setTrustBadges] = useState<Array<{ icon: string; title: string; desc: string }>>([]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [currency, setCurrency] = useState<CurrencyType>('USD');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [isStyleAdvisorOpen, setIsStyleAdvisorOpen] = useState<boolean>(false);
  const [isFlutterModalOpen, setIsFlutterModalOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

  // Load persistent cart, wishlist, orders, and user profile from APIs
  useEffect(() => {
    cartApi.getCart().then((items) => {
      if (items && items.length > 0) {
        setCart(items);
      }
    }).catch(console.error);

    whishlistApi.getWishlist().then((ids) => {
      if (ids && ids.length > 0) {
        setWishlist(ids);
      }
    }).catch(console.error);

    orderApi.getOrders().then((ordList) => {
      if (ordList && ordList.length > 0) {
        setOrders(ordList);
        setSelectedOrder(ordList[0]);
      }
    }).catch(console.error);

    authApi.getProfile().then((prof) => {
      if (prof) {
        setUser(prof);
      }
    }).catch(console.error);
  }, []);

  // Load product catalog through productService layer
  const refreshProducts = async () => {
    try {
      setIsLoadingProducts(true);
      const [prods, cats, top, feat, assets, badges] = await Promise.all([
        productService.getProducts(),
        productService.getCategories(),
        productService.getTopSellers(),
        productService.getFeaturedProducts(),
        productService.getBrandAssets(),
        productService.getTrustBadges(),
      ]);
      setProducts(prods);
      setCategories(cats);
      setTopSellers(top);
      setFeaturedProducts(feat);
      setBrandAssets(assets);
      setTrustBadges(badges);
      setProductError(null);

      // Seed initial cart item if empty
      setCart((prev) => {
        if (prev.length > 0) return prev;
        const initialItem = prods.find((p) => p.id === 'prod-3') || prods[0];
        if (initialItem) {
          return [
            {
              product: initialItem,
              quantity: 1,
              selectedColor: initialItem.colorVariants?.[0]?.name || '#0891B2',
              selectedVariantImage: initialItem.colorVariants?.[0]?.image || initialItem.image,
            },
          ];
        }
        return prev;
      });

      // Seed initial wishlist item if empty
      setWishlist((prev) => {
        if (prev.length > 0) return prev;
        const initialWish = prods.find((p) => p.id === 'prod-4') || prods[1];
        return initialWish ? [initialWish.id] : [];
      });
    } catch (err: any) {
      console.error('Failed to load products from productService', err);
      setProductError(err?.message || 'Error fetching products');
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  const getProductById = (id: string): Product | undefined => {
    return products.find((p) => p.id === id);
  };

  // Orders state
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(INITIAL_ORDERS[0]);

  // Customer & Admin Addresses state
  const [customerAddresses, setCustomerAddresses] = useState<CustomerLocationRes[]>([]);
  const [adminAddresses, setAdminAddresses] = useState<AdminLocationRes[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<CustomerLocationRes | null>(null);

  // Load addresses on mount
  useEffect(() => {
    locationService.getCustomersAddress().then((res) => {
      if (res.data) {
        setCustomerAddresses(res.data);
        const def = res.data.find((a) => a.defaultAddress) || res.data[0] || null;
        setSelectedAddress(def);
      }
    });
    locationService.getAdminAddress().then((res) => {
      if (res.data) {
        setAdminAddresses(res.data);
      }
    });
  }, []);

  const [user, setUser] = useState<UserProfile | null>({
    id: 'user-1',
    name: 'Elena Vance',
    email: 'elena.vance@lifestyle.com',
    isVip: true,
    tier: 'Gold Tier VIP',
    joinedDate: 'March 2026',
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<
    'desktop' | 'mobile_app' | 'auth_page' | 'products' | 'orders' | 'addresses'
  >('desktop');

  // Real-time responsive window size detection
  const [windowWidth, setWindowWidth] = useState<number>(() => {
    return typeof window !== 'undefined' ? window.innerWidth : 1200;
  });
  const [isMobileScreen, setIsMobileScreen] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  });
  const [isAutoResponsive, setIsAutoResponsive] = useState<boolean>(true);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window === 'undefined') return;
      const width = window.innerWidth;
      setWindowWidth(width);
      setIsMobileScreen(width < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Automatically load mobile or desktop based on window size if auto-responsive is on
  const effectiveViewMode = useMemo(() => {
    if (
      viewMode === 'orders' ||
      viewMode === 'addresses' ||
      viewMode === 'products' ||
      viewMode === 'auth_page'
    ) {
      return viewMode;
    }
    if (isAutoResponsive) {
      return isMobileScreen ? 'mobile_app' : 'desktop';
    }
    return viewMode;
  }, [viewMode, isAutoResponsive, isMobileScreen]);

  // Two-way synchronization with URL route
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/products') || path.startsWith('/product/')) {
      setViewMode('products');
    } else if (path.startsWith('/orders')) {
      setViewMode('orders');
    } else if (path.startsWith('/addresses')) {
      setViewMode('addresses');
    } else if (path.startsWith('/mobile')) {
      setViewMode('mobile_app');
    } else if (path.startsWith('/auth') || path.startsWith('/login')) {
      setViewMode('auth_page');
    } else if (path === '/') {
      setViewMode('desktop');
    }
  }, [location.pathname]);

  const [toast, setToast] = useState<string | null>(null);

  const selectDeliveryAddress = (addr: CustomerLocationRes) => {
    setSelectedAddress(addr);
    showToast(`Delivery address set to ${addr.cityVillage} (${addr.pincode})`);
  };

  const saveCustomerAddress = async (
    req: LocationReq,
    isDefault = false
  ): Promise<CustomerLocationRes> => {
    const res = await locationService.saveCustomerAddress(req, isDefault);
    const refreshed = await locationService.getCustomersAddress();
    setCustomerAddresses(refreshed.data);
    if (res.data.defaultAddress || !selectedAddress) {
      setSelectedAddress(res.data);
    }
    showToast('New address saved to your address book!');
    return res.data;
  };

  const updateCustomerAddress = async (
    id: number,
    req: Partial<LocationReq>
  ): Promise<CustomerLocationRes> => {
    const res = await locationService.updateCustomerAddress(id, req);
    const refreshed = await locationService.getCustomersAddress();
    setCustomerAddresses(refreshed.data);
    if (selectedAddress?.id === id) {
      setSelectedAddress(res.data);
    }
    showToast('Address updated successfully!');
    return res.data;
  };

  const updateDefaultCustomerAddress = async (id: number) => {
    const res = await locationService.updateDefaultCustomerAddress(id);
    const refreshed = await locationService.getCustomersAddress();
    setCustomerAddresses(refreshed.data);
    setSelectedAddress(res.data);
    showToast('Default delivery address updated!');
  };

  const deleteCustomerAddress = async (id: number) => {
    await locationService.deleteCustomerAddress(id);
    const refreshed = await locationService.getCustomersAddress();
    setCustomerAddresses(refreshed.data);
    if (selectedAddress?.id === id) {
      const def = refreshed.data.find((a) => a.defaultAddress) || refreshed.data[0] || null;
      setSelectedAddress(def);
    }
    showToast('Address removed from address book.');
  };

  const resolvePincode = async (pin: string) => {
    const res = await locationService.resolvePincode(pin);
    if (res.success && res.data) {
      return res.data;
    }
    return null;
  };

  const openAddressBook = () => {
    setViewMode('addresses');
    if (location.pathname !== '/addresses') {
      navigate('/addresses');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openCategory = (cat: string) => {
    setActiveCategory(cat);
    setViewMode('products');
    const targetUrl = cat === 'all' ? '/products' : `/products?category=${encodeURIComponent(cat)}`;
    navigate(targetUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openOrders = (orderId?: string) => {
    if (orderId) {
      const found = orders.find((o) => o.id === orderId);
      if (found) setSelectedOrder(found);
      navigate(`/orders/${orderId}`);
    } else {
      navigate('/orders');
    }
    setViewMode('orders');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        const updatedTimeline = ord.timeline.map((step) => {
          if (step.label.toLowerCase() === newStatus.toLowerCase()) {
            return {
              ...step,
              completed: true,
              current: true,
              timestamp: 'Just now',
            };
          }
          return step;
        });
        return {
          ...ord,
          status: newStatus,
          timeline: updatedTimeline,
        };
      })
    );

    setSelectedOrder((prev) => {
      if (!prev || prev.id !== orderId) return prev;
      return {
        ...prev,
        status: newStatus,
      };
    });

    orderApi.updateOrderStatus(orderId, newStatus).catch(console.error);
    showToast(`Order #${orderId} status updated to ${newStatus.toUpperCase()}`);
  };

  const updateOrderPayment = (
    orderId: string,
    paymentStatus: PaymentStatus,
    transactionId?: string
  ) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        const newLog = {
          title: paymentStatus === 'success' ? 'Payment Success' : 'Payment Failed',
          timestamp: `Today, ${nowTime}`,
          transactionId: transactionId || ord.payment.transactionId,
          amount: ord.pricing.grandTotal,
          type: paymentStatus === 'success' ? ('success' as const) : ('failed' as const),
          details: paymentStatus === 'success' ? 'Payment verified via gateway' : 'Payment cancelled or failed',
        };
        return {
          ...ord,
          status: paymentStatus === 'success' ? ('confirmed' as const) : ord.status,
          payment: {
            ...ord.payment,
            status: paymentStatus,
            transactionId: transactionId || ord.payment.transactionId,
            paidAt: paymentStatus === 'success' ? `Today, ${nowTime}` : undefined,
          },
          paymentLogs: [...ord.paymentLogs, newLog],
        };
      })
    );

    setSelectedOrder((prev) => {
      if (!prev || prev.id !== orderId) return prev;
      return {
        ...prev,
        status: paymentStatus === 'success' ? 'confirmed' : prev.status,
        payment: {
          ...prev.payment,
          status: paymentStatus,
          transactionId: transactionId || prev.payment.transactionId,
        },
      };
    });

    if (paymentStatus === 'success') {
      showToast(`Payment of ₹${selectedOrder?.pricing.grandTotal || ''} verified successfully!`);
    } else {
      showToast('Payment was not completed. You can retry anytime.');
    }
  };

  const updateShippingAddress = (orderId: string, address: Order['shippingAddress']) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, shippingAddress: address } : ord))
    );
    setSelectedOrder((prev) => (prev && prev.id === orderId ? { ...prev, shippingAddress: address } : prev));
    showToast('Shipping address updated.');
  };

  const createOrder = (orderData: Partial<Order>): Order => {
    const nextNum = 10025 + orders.length + 1;
    const newId = `ORD-${nextNum}`;
    const hash = Math.random().toString(36).substring(2, 12).toUpperCase();
    const now = new Date();
    const formattedDate = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newOrder: Order = {
      id: newId,
      hash,
      createdAt: formattedDate,
      customer: orderData.customer || {
        name: user?.name || 'Valued Customer',
        phone: '+91 98765 43210',
        email: user?.email || 'customer@gmail.com',
      },
      shippingAddress: orderData.shippingAddress || {
        name: user?.name || 'Valued Customer',
        addressLine: '12-45, Main Road, Arundelpet',
        city: 'Guntur',
        state: 'Andhra Pradesh',
        pin: '522002',
        country: 'India',
      },
      items: orderData.items || [],
      pricing: orderData.pricing || {
        subtotal: 0,
        discount: 0,
        productTotal: 0,
        deliveryCharges: 0,
        codCharges: 0,
        grandTotal: 0,
      },
      status: orderData.payment?.type === 'cod' ? 'confirmed' : (orderData.status || 'pending'),
      payment: orderData.payment || {
        type: 'online',
        status: 'pending',
        attempts: 1,
      },
      delivery: {
        carrier: 'DELHIVERY',
        status: 'Order Placed',
      },
      timeline: [
        { label: 'Order Placed', timestamp: formattedDate, completed: true },
        { label: 'Confirmed', timestamp: orderData.payment?.type === 'cod' ? formattedDate : undefined, completed: orderData.payment?.type === 'cod' },
        { label: 'Shipped', completed: false },
        { label: 'Out for Delivery', completed: false },
        { label: 'Delivered', completed: false },
      ],
      paymentLogs: orderData.paymentLogs || [
        {
          title: orderData.payment?.type === 'cod' ? 'COD Selected' : 'Payment Initiated',
          timestamp: formattedDate,
          type: 'init',
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    setSelectedOrder(newOrder);
    clearCart();

    // Persist via Order API service
    orderApi.createOrder(newOrder).catch(console.error);

    return newOrder;
  };

  const login = (email: string, name?: string) => {
    const formattedName = name || email.split('@')[0].replace('.', ' ').replace(/^./, (c) => c.toUpperCase());
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: formattedName,
      email: email,
      isVip: true,
      tier: 'Gold Tier VIP',
      joinedDate: 'October 2026',
    };
    setUser(newUser);
    authApi.login({ email }).catch(console.error);
    showToast(`Welcome back, ${formattedName}!`);
  };

  const logout = () => {
    setUser(null);
    authApi.logout().catch(console.error);
    showToast('Signed out successfully.');
  };

  const showToast = (msg: string) => {
    setToast(msg);
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const addToCart = (
    product: Product,
    quantity = 1,
    selectedColor?: string,
    selectedSize?: string,
    selectedVariantImage?: string
  ) => {
    const itemToAdd: CartItem = {
      product,
      quantity,
      selectedColor: selectedColor || product.colorVariants?.[0]?.name || product.colors?.[0],
      selectedSize: selectedSize || (product.sizes ? product.sizes[0] : undefined),
      selectedVariantImage: selectedVariantImage || product.colorVariants?.[0]?.image || product.image,
    };

    setCart((prev) => {
      const matchIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === itemToAdd.selectedColor &&
          item.selectedSize === itemToAdd.selectedSize
      );

      if (matchIndex > -1) {
        return prev.map((item, idx) =>
          idx === matchIndex
            ? {
                ...item,
                quantity: item.quantity + quantity,
                selectedVariantImage: selectedVariantImage || item.selectedVariantImage,
              }
            : item
        );
      }

      return [...prev, itemToAdd];
    });

    // Persist via Cart API service
    cartApi.addToCart(itemToAdd).catch(console.error);

    const sizeMsg = selectedSize ? ` (Size: ${selectedSize})` : '';
    showToast(`Added "${product.name}"${sizeMsg} to your shopping bag.`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    cartApi.removeFromCart(productId).catch(console.error);
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
    cartApi.updateQuantity(productId, quantity).catch(console.error);
  };

  const clearCart = () => {
    setCart([]);
    cartApi.clearCart().catch(console.error);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        showToast('Item removed from your wishlist.');
        return prev.filter((id) => id !== productId);
      } else {
        const prod = products.find((p) => p.id === productId);
        showToast(`Saved "${prod?.name || 'Item'}" to your wishlist.`);
        return [...prev, productId];
      }
    });
    whishlistApi.toggleWishlist(productId).catch(console.error);
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
        products,
        categories,
        topSellers,
        featuredProducts,
        isLoadingProducts,
        productError,
        refreshProducts,
        getProductById,
        brandAssets,
        trustBadges,
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
        openCategory,
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
        isFlutterModalOpen,
        setIsFlutterModalOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        orders,
        selectedOrder,
        setSelectedOrder,
        updateOrderStatus,
        updateOrderPayment,
        updateShippingAddress,
        createOrder,
        openOrders,
        customerAddresses,
        adminAddresses,
        selectedAddress,
        setSelectedAddress,
        selectDeliveryAddress,
        saveCustomerAddress,
        updateCustomerAddress,
        updateDefaultCustomerAddress,
        deleteCustomerAddress,
        resolvePincode,
        openAddressBook,
        user,
        login,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        viewMode,
        setViewMode,
        isMobileScreen,
        windowWidth,
        isAutoResponsive,
        setIsAutoResponsive,
        effectiveViewMode,
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
