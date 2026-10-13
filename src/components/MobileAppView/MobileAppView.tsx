import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { PRODUCTS, CATEGORIES, HERO_IMAGE, EDITORIAL_PORTRAIT_IMAGE, TEAL_HANDBAG_IMAGE } from '../../data/products';
import { Order } from '../../types';
import './MobileAppView.css';
import {
  Home,
  Compass,
  ShoppingBag,
  Heart,
  User,
  Search,
  Sparkles,
  ArrowRight,
  Star,
  ChevronRight,
  Check,
  Plus,
  Minus,
  Trash2,
  Share2,
  Package,
  MapPin,
  CreditCard,
  Bell,
  X,
  Truck,
  FileText,
  CheckCircle2,
} from 'lucide-react';

export const MobileAppView: React.FC = () => {
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    cartCount,
    cartTotal,
    clearCart,
    wishlist,
    toggleWishlist,
    isWishlisted,
    formatPrice,
    setQuickViewProduct,
    setViewMode,
    activeCategory,
    setActiveCategory,
    setIsFlutterModalOpen,
    setIsCheckoutOpen,
    openOrders,
    orders,
    customerAddresses,
    selectedAddress,
    selectDeliveryAddress,
    openAddressBook,
    saveCustomerAddress,
    user,
    login,
    logout,
    isMobileScreen,
    windowWidth,
  } = useShop();

  // Active bottom navigation tab in mobile app
  const [activeTab, setActiveTab] = useState<'home' | 'shop' | 'bag' | 'wishlist' | 'profile'>('home');
  const [activeStory, setActiveStory] = useState<string | null>(null);
  const [phoneFrameSize, setPhoneFrameSize] = useState<'device' | 'fluid'>('device');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [selectedMobileOrder, setSelectedMobileOrder] = useState<Order | null>(null);
  const [isMobileAddAddressOpen, setIsMobileAddAddressOpen] = useState(false);
  const [newAddrForm, setNewAddrForm] = useState({
    name: 'Elena Vance',
    phone: '+91 98450 12345',
    pincode: '560001',
    line1: '',
    line2: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    type: 'HOME' as 'HOME' | 'WORK' | 'OTHER',
  });

  // Automatically adapt to native full-bleed on actual small screens
  const isActualMobile = isMobileScreen || (typeof window !== 'undefined' && window.innerWidth < 768);

  // App stories matching modern fashion apps
  const STORIES = [
    { id: 'new', name: 'New In', image: HERO_IMAGE, unread: true },
    { id: 'bags', name: 'Teal Bags', image: TEAL_HANDBAG_IMAGE, unread: true },
    { id: 'editorial', name: 'Editorial', image: EDITORIAL_PORTRAIT_IMAGE, unread: false },
    { id: 'hair', name: 'Silk Care', image: PRODUCTS[0].image, unread: false },
    { id: 'watches', name: 'Timepieces', image: PRODUCTS[1].image, unread: false },
  ];

  return (
    <div
      className={
        isActualMobile
          ? 'w-full min-h-screen bg-white flex flex-col p-0 m-0'
          : 'py-6 sm:py-10 px-2 sm:px-4 flex flex-col items-center justify-center min-h-screen bg-slate-100'
      }
    >
      {/* Top Device Bar Controls (compact on mobile screens) */}
      {!isActualMobile ? (
        <div className="mb-4 flex items-center justify-between gap-4 max-w-md w-full px-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              📱 Luné Mobile App Prototype
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFlutterModalOpen(true)}
              className="text-[11px] px-2.5 py-1 bg-sky-50 text-sky-700 border border-sky-200 font-semibold rounded-lg hover:bg-sky-100 transition-colors cursor-pointer"
            >
              Flutter Code
            </button>
            <button
              onClick={() => setPhoneFrameSize(phoneFrameSize === 'device' ? 'fluid' : 'device')}
              className="text-[11px] px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              {phoneFrameSize === 'device' ? 'Expand View' : 'Device Frame'}
            </button>
            <button
              onClick={() => setViewMode('desktop')}
              className="text-[11px] px-3 py-1 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 transition-colors cursor-pointer shadow-xs"
            >
              Switch to Website
            </button>
          </div>
        </div>
      ) : (
        /* Unobtrusive Floating Pill on real mobile screens for quick actions */
        <div className="bg-slate-900/90 backdrop-blur-md text-white text-[10px] px-3 py-1 flex items-center justify-between z-40 sticky top-0">
          <span className="font-semibold text-slate-200">📱 Luné Mobile App</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFlutterModalOpen(true)}
              className="text-sky-300 font-semibold hover:underline"
            >
              Flutter Code
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={() => setViewMode('desktop')}
              className="text-sky-300 font-semibold hover:underline"
            >
              Web Store
            </button>
          </div>
        </div>
      )}

      {/* Smartphone Device Shell */}
      <div
        className={
          isActualMobile
            ? 'w-full flex-1 flex flex-col bg-white overflow-hidden'
            : `relative bg-white shadow-2xl overflow-hidden border border-slate-300 transition-all ${
                phoneFrameSize === 'device'
                  ? 'w-full max-w-[400px] h-[840px] rounded-[48px] ring-12 ring-slate-900 shadow-slate-900/30'
                  : 'w-full max-w-lg h-[860px] rounded-3xl'
              } flex flex-col`
        }
      >
        {/* Dynamic Island / Notch + Mobile Status Bar (Exact Instagram Timestamp: 3:54) */}
        <div className="pt-3 px-6 pb-2 flex items-center justify-between text-xs font-semibold text-slate-800 select-none bg-white z-30">
          <span className="tracking-tight text-[13px]">3:54</span>
          {phoneFrameSize === 'device' && (
            <div className="w-24 h-5 bg-black rounded-full flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-1 ring-slate-800 mr-2" />
            </div>
          )}
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-[10px] font-bold">5G</span>
            <div className="w-4 h-2.5 border border-slate-800 rounded-xs p-0.5 flex items-center">
              <div className="w-full h-full bg-slate-800 rounded-2xs" />
            </div>
          </div>
        </div>

        {/* Mobile App Header Bar */}
        <div className="px-5 py-2.5 border-b border-slate-100 flex items-center justify-between bg-white/95 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-1.5">
            <span className="font-serif-luxury text-2xl font-bold tracking-tight text-slate-900">
              Luné
            </span>
            <span className="text-[8px] uppercase tracking-widest text-sky-600 font-bold ml-1 px-1.5 py-0.5 bg-sky-50 rounded">
              APP
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('bag')}
              className="relative p-2 text-slate-700 hover:text-sky-600 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#0284C7] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* App Main Scrollable Screen Content */}
        <div className="flex-1 overflow-y-auto pb-20 bg-[#F8FAFC]">
          {/* TAB 1: HOME */}
          {activeTab === 'home' && (
            <div>
              {/* Stories / Lookbook Bar */}
              <div className="py-3 px-4 bg-white border-b border-slate-100 flex gap-3 overflow-x-auto scrollbar-none">
                {STORIES.map((story) => (
                  <button
                    key={story.id}
                    onClick={() => setActiveStory(story.id)}
                    className="flex flex-col items-center shrink-0 group focus:outline-none"
                  >
                    <div
                      className={`w-14 h-14 rounded-full p-0.5 ${
                        story.unread
                          ? 'ring-2 ring-sky-500 bg-gradient-to-tr from-sky-400 to-sky-600'
                          : 'ring-1 ring-slate-200'
                      }`}
                    >
                      <img
                        src={story.image}
                        alt={story.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover rounded-full border-2 border-white"
                      />
                    </div>
                    <span className="text-[10px] font-medium text-slate-700 mt-1 line-clamp-1">
                      {story.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Mobile Hero Card with Script Tag */}
              <div className="p-4">
                <div className="relative rounded-3xl overflow-hidden bg-slate-900 shadow-lg aspect-[4/3] flex flex-col justify-end p-5 text-white">
                  <img
                    src={HERO_IMAGE}
                    alt="Hero Collection"
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                  {/* Watermark Script */}
                  <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-xl">
                    <span className="font-script text-sky-900 font-bold text-lg">
                      Lifestyle More You ♡
                    </span>
                  </div>

                  <div className="relative z-10">
                    <span className="text-[9px] uppercase tracking-widest text-sky-300 font-bold">
                      NEW SEASON 2026
                    </span>
                    <h2 className="font-serif-luxury text-2xl font-bold leading-tight mt-0.5 mb-1 text-white">
                      Accessories Make It You
                    </h2>
                    <p className="text-[11px] text-slate-300 mb-3">
                      Timeless pieces for every mood and version of you.
                    </p>
                    <button
                      onClick={() => setActiveTab('shop')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-slate-900 text-xs font-bold rounded-full shadow-md"
                    >
                      <span>Shop Collection</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Category Quick Circles */}
              <div className="px-4 mb-4">
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Categories
                  </h3>
                  <button
                    onClick={() => setActiveTab('shop')}
                    className="text-[11px] font-semibold text-sky-600"
                  >
                    See All
                  </button>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
                  {CATEGORIES.slice(0, 5).map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setActiveCategory(cat.id);
                        setActiveTab('shop');
                      }}
                      className="flex flex-col items-center shrink-0 w-16"
                    >
                      <div className="w-13 h-13 rounded-full overflow-hidden bg-slate-100 p-0.5 border border-slate-200/80">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <span className="text-[10px] font-medium text-slate-700 mt-1 truncate w-full text-center">
                        {cat.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Weekly Top Sellers Mobile Grid */}
              <div className="px-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-serif-luxury text-lg font-bold text-slate-900">
                      Weekly Top Sellers
                    </h3>
                    <p className="text-[10px] text-slate-500">Trending items this week</p>
                  </div>
                  <span className="text-[10px] font-semibold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">
                    Top 4
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {PRODUCTS.slice(0, 4).map((product) => {
                    const wishlisted = isWishlisted(product.id);

                    return (
                      <div
                        key={product.id}
                        className="bg-white rounded-2xl p-2.5 border border-slate-200/70 shadow-2xs flex flex-col justify-between"
                      >
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-50 mb-2">
                          {product.badge && (
                            <span className="absolute top-1.5 left-1.5 z-10 px-1.5 py-0.5 text-[9px] font-bold rounded bg-sky-600 text-white">
                              {product.badge}
                            </span>
                          )}
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className="absolute top-1.5 right-1.5 z-10 p-1 rounded-full bg-white/80 backdrop-blur-xs text-slate-400 hover:text-rose-500"
                          >
                            <Heart
                              className={`w-3.5 h-3.5 ${
                                wishlisted ? 'fill-rose-500 text-rose-500' : ''
                              }`}
                            />
                          </button>
                          <img
                            src={product.image}
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => setQuickViewProduct(product)}
                          />
                        </div>

                        <div>
                          <div className="flex items-center gap-0.5 text-amber-400 mb-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                            ))}
                            <span className="text-[9px] text-slate-400 ml-1">
                              ({product.reviewsCount})
                            </span>
                          </div>
                          <h4
                            onClick={() => setQuickViewProduct(product)}
                            className="text-xs font-semibold text-slate-800 line-clamp-1 cursor-pointer"
                          >
                            {product.name}
                          </h4>

                          {/* Image variants thumbnails instead of color dots */}
                          {product.colorVariants && product.colorVariants.length > 0 ? (
                            <div className="flex items-center gap-1 mt-1.5">
                              {product.colorVariants.slice(0, 3).map((v) => (
                                <button
                                  key={v.name}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setQuickViewProduct(product);
                                  }}
                                  className="w-4 h-4 rounded-xs overflow-hidden border border-slate-200"
                                  title={v.name}
                                >
                                  <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                                </button>
                              ))}
                            </div>
                          ) : null}

                          {/* Dress sizes badge */}
                          {(product.category === 'dresses' || (product.sizes && product.sizes.length > 0)) && (
                            <div className="flex items-center gap-1 mt-1 flex-wrap">
                              {(product.sizes || ['XS', 'S', 'M', 'L']).map((s) => (
                                <span key={s} className="text-[8px] px-1 bg-slate-100 text-slate-600 rounded font-mono font-bold">
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 tabular-nums">
                              {formatPrice(product.price)}
                            </span>
                            <button
                              onClick={() => addToCart(product, 1)}
                              className="p-1.5 bg-sky-50 text-sky-700 hover:bg-sky-600 hover:text-white rounded-lg transition-colors cursor-pointer"
                              title="Add to Bag"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Promo Duo Banner Mobile Cards */}
              <div className="px-4 space-y-3 pb-4">
                <div className="bg-gradient-to-r from-sky-50 to-white border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400">
                      SUNGLASSES
                    </span>
                    <h4 className="font-serif-luxury text-lg font-bold text-slate-900">
                      See Your Style
                    </h4>
                    <button
                      onClick={() => {
                        setActiveCategory('sunglasses');
                        setActiveTab('shop');
                      }}
                      className="mt-2 text-[10px] font-bold text-sky-600 flex items-center gap-1"
                    >
                      <span>Explore Shades</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  <img
                    src={PRODUCTS[3].image}
                    alt="Sunglasses"
                    referrerPolicy="no-referrer"
                    className="w-20 h-16 object-contain"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SHOP / EXPLORE */}
          {activeTab === 'shop' && (
            <div className="p-4">
              <h2 className="font-serif-luxury text-2xl font-bold text-slate-900 mb-1">
                Explore Accessories
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Browse our complete curated collection
              </p>

              {/* Category Filter Chips */}
              <div className="flex gap-2 overflow-x-auto pb-3 mb-3 scrollbar-none">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                    activeCategory === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  All ({PRODUCTS.length})
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                      activeCategory === cat.id
                        ? 'bg-sky-600 text-white'
                        : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Product Catalog List */}
              <div className="grid grid-cols-2 gap-3">
                {(activeCategory === 'all'
                  ? PRODUCTS
                  : PRODUCTS.filter((p) => p.category === activeCategory)
                ).map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl p-2.5 border border-slate-200/80 shadow-2xs flex flex-col justify-between"
                  >
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-50 mb-2">
                      <img
                        src={product.image}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onClick={() => setQuickViewProduct(product)}
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-800 line-clamp-1">
                        {product.name}
                      </h4>
                      <p className="text-[10px] text-slate-400">{product.categoryLabel}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 tabular-nums">
                          {formatPrice(product.price)}
                        </span>
                        <button
                          onClick={() => addToCart(product, 1)}
                          className="p-1.5 bg-sky-50 text-sky-700 hover:bg-sky-600 hover:text-white rounded-lg transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: BAG / CART */}
          {activeTab === 'bag' && (
            <div className="p-4">
              <h2 className="font-serif-luxury text-2xl font-bold text-slate-900 mb-1">
                Your Shopping Bag
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                {cartCount} item(s) in your basket
              </p>

              {orderPlaced ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-center">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif-luxury text-xl font-bold text-slate-900">
                    Order Confirmed!
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Receipt sent to your mobile account. Thank you for shopping with Luné.
                  </p>
                  <button
                    onClick={() => {
                      setOrderPlaced(false);
                      setActiveTab('home');
                    }}
                    className="mt-4 px-5 py-2 bg-slate-900 text-white rounded-full text-xs font-bold"
                  >
                    Back to Home
                  </button>
                </div>
              ) : cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-slate-700">Your bag is empty</h4>
                  <p className="text-xs text-slate-400 mt-1">Add items to proceed to checkout</p>
                  <button
                    onClick={() => setActiveTab('shop')}
                    className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-full text-xs font-semibold"
                  >
                    Explore Catalog
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* 1. CUSTOMER DETAILS CARD IN CART */}
                  <div className="p-3 bg-sky-50/80 border border-sky-200/80 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                      {user ? user.name.split(' ').map((n) => n[0]).join('') : 'EV'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {user ? user.name : 'Elena Vance'}
                        </span>
                        <span className="text-[9px] font-bold text-sky-700 bg-sky-100 px-1.5 py-0.5 rounded">
                          {user ? user.tier : 'Gold VIP Member'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">
                        {user ? user.email : 'elena.vance@lifestyle.com'} • +91 98450 12345
                      </p>
                    </div>
                  </div>

                  {/* 2. DELIVERY ADDRESS CARD IN CART */}
                  <div className="p-3 bg-white border border-slate-200 rounded-2xl">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-sky-600" />
                        <span className="text-[11px] font-bold text-slate-900">Shipping Address</span>
                        {selectedAddress?.defaultAddress && (
                          <span className="text-[8px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.2 rounded border border-emerald-200">
                            DEFAULT
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openAddressBook()}
                          className="text-[10px] font-bold text-sky-600 hover:text-sky-800 transition-colors cursor-pointer"
                        >
                          Change
                        </button>
                        <button
                          onClick={() => setIsMobileAddAddressOpen(true)}
                          className="text-[10px] font-bold text-emerald-600 hover:text-emerald-800 transition-colors cursor-pointer"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                    {selectedAddress ? (
                      <div className="text-[11px] text-slate-600 space-y-0.5">
                        <p className="font-semibold text-slate-800">
                          {user?.name || 'Elena Vance'} ({selectedAddress.addressType})
                        </p>
                        <p className="line-clamp-2 text-slate-500 text-[10.5px]">
                          {selectedAddress.addressLine1}
                          {selectedAddress.addressLine2 ? `, ${selectedAddress.addressLine2}` : ''}, {selectedAddress.cityVillage} ({selectedAddress.pincode})
                        </p>
                        <p className="text-[9.5px] text-slate-400">
                          Phone: {selectedAddress.mobileNumber}
                        </p>
                      </div>
                    ) : (
                      <p className="text-[11px] text-rose-500">No delivery address selected</p>
                    )}
                  </div>

                  {cart.map((item, idx) => (
                    <div
                      key={`${item.product.id}-${item.selectedSize}-${idx}`}
                      className="bg-white rounded-2xl p-3 border border-slate-200 flex gap-3 items-center"
                    >
                      <img
                        src={item.selectedVariantImage || item.product.image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-xl object-cover bg-slate-50 border border-slate-100"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-slate-900 truncate">
                          {item.product.name}
                        </h4>
                        <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                          {item.selectedSize && (
                            <span className="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-mono font-bold">
                              Size: {item.selectedSize}
                            </span>
                          )}
                          {item.selectedColor && (
                            <span className="text-[9px] text-sky-700 font-medium">
                              {item.selectedColor}
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-bold text-sky-700 tabular-nums block mt-1">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 bg-slate-100 rounded text-slate-600 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold tabular-nums">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 bg-slate-100 rounded text-slate-600 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1.5 text-slate-300 hover:text-rose-500 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {/* Summary & Mobile Checkout */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-200 mt-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">Subtotal</span>
                      <span className="font-semibold tabular-nums">{formatPrice(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-slate-500">Shipping</span>
                      <span className="font-semibold text-emerald-600">FREE</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold pt-2 border-t border-slate-100">
                      <span>Total</span>
                      <span className="text-sky-800 tabular-nums">{formatPrice(cartTotal)}</span>
                    </div>

                    <button
                      onClick={() => setIsCheckoutOpen(true)}
                      className="w-full mt-4 py-3 bg-[#881337] text-white rounded-xl text-xs font-bold shadow-md hover:bg-[#6b0f2b] transition-colors cursor-pointer"
                    >
                      Proceed to Checkout (COD / Online)
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="p-4">
              <h2 className="font-serif-luxury text-2xl font-bold text-slate-900 mb-1">
                Saved Wishlist
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                {wishlist.length} saved accessory favorites
              </p>

              {wishlist.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">No items saved yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {PRODUCTS.filter((p) => wishlist.includes(p.id)).map((prod) => (
                    <div
                      key={prod.id}
                      className="bg-white rounded-2xl p-3 border border-slate-200 flex items-center justify-between gap-3"
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-xl object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 truncate">{prod.name}</h4>
                        <span className="text-xs font-bold text-sky-700 tabular-nums">
                          {formatPrice(prod.price)}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          addToCart(prod, 1);
                          toggleWishlist(prod.id);
                        }}
                        className="px-3 py-1.5 bg-slate-900 text-white text-[11px] font-semibold rounded-lg"
                      >
                        Add to Bag
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: PROFILE */}
          {activeTab === 'profile' && (
            <div className="p-4">
              {user ? (
                <>
                  <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs mb-4 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center text-lg">
                      {user.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{user.name}</h3>
                      <p className="text-xs text-slate-400">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                        {user.tier}
                      </span>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden mb-4">
                    <div
                      onClick={() => openOrders()}
                      className="p-3.5 flex items-center justify-between text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Package className="w-4 h-4 text-sky-600" />
                        <div>
                          <span className="font-semibold">My Orders &amp; Tracking</span>
                          <span className="block text-[10px] text-slate-400 font-normal">
                            {orders.length} active orders recorded
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                    <div
                      onClick={() => openAddressBook()}
                      className="p-3.5 flex items-center justify-between text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <MapPin className="w-4 h-4 text-sky-600" />
                        <div>
                          <span className="font-semibold">Delivery Addresses</span>
                          {selectedAddress && (
                            <span className="block text-[10px] text-slate-400 font-normal">
                              Default: {selectedAddress.cityVillage} ({selectedAddress.pincode})
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                    <div
                      onClick={() => setIsMobileAddAddressOpen(true)}
                      className="p-3.5 flex items-center justify-between text-xs font-medium text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Plus className="w-4 h-4 text-emerald-600" />
                        <span className="font-semibold">+ Add New Delivery Address</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-emerald-400" />
                    </div>
                  </div>

                  {/* Recent Orders Preview */}
                  {orders.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-bold text-slate-800">Recent Orders</h4>
                        <button
                          onClick={() => openOrders()}
                          className="text-[10px] text-sky-600 font-bold hover:underline"
                        >
                          View All ({orders.length})
                        </button>
                      </div>
                      <div className="space-y-2">
                        {orders.slice(0, 3).map((ord) => (
                          <div
                            key={ord.id}
                            onClick={() => setSelectedMobileOrder(ord)}
                            className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs hover:border-sky-300 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold text-slate-900">#{ord.id}</span>
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                ord.status === 'delivered'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-sky-100 text-sky-700'
                              }`}>
                                {ord.status.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 mb-1.5">
                              {ord.createdAt} • {ord.items.length} item(s)
                            </p>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-[10px] text-slate-400 truncate max-w-[150px]">
                                {ord.shippingAddress.city} ({ord.shippingAddress.pin})
                              </span>
                              <span className="font-bold text-sky-700">
                                {formatPrice(ord.pricing.grandTotal)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => logout()}
                    className="w-full py-3 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold rounded-2xl transition-colors text-center cursor-pointer"
                  >
                    Sign Out of Mobile App
                  </button>
                </>
              ) : (
                <div className="bg-white rounded-3xl p-6 border border-slate-200 text-center shadow-xs">
                  <div className="w-14 h-14 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="w-7 h-7" />
                  </div>
                  <h3 className="font-serif-luxury text-xl font-bold text-slate-900">
                    Sign In to Luné
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 mb-5">
                    Access your saved items, points, and member-exclusive drops.
                  </p>
                  <button
                    onClick={() => login('elena.vance@lifestyle.com', 'Elena Vance')}
                    className="w-full py-3 bg-slate-900 text-white rounded-full text-xs font-bold shadow-md hover:bg-sky-600 transition-colors mb-2.5"
                  >
                    1-Tap Sign In as Elena Vance
                  </button>
                  <button
                    onClick={() => setViewMode('auth_page')}
                    className="w-full py-2.5 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold hover:bg-slate-200 transition-colors"
                  >
                    Full Sign In / Register Page
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sticky Mobile App Bottom Navigation Bar (Pattern 1 from Mobile Touch Reference) */}
        <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 grid grid-cols-5 h-16 items-center px-2 z-30 select-none">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'home' ? 'text-sky-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-0.5">Home</span>
          </button>

          <button
            onClick={() => setActiveTab('shop')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'shop' ? 'text-sky-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-0.5">Explore</span>
          </button>

          <button
            onClick={() => setActiveTab('bag')}
            className={`relative flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'bag' ? 'text-sky-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-5 w-4 h-4 bg-sky-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
            <span className="text-[10px] tracking-tight mt-0.5">Bag</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`relative flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'wishlist'
                ? 'text-sky-600 font-bold'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-0 right-5 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
            <span className="text-[10px] tracking-tight mt-0.5">Saved</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'profile'
                ? 'text-sky-600 font-bold'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-0.5">Profile</span>
          </button>
        </div>
      </div>

      {/* Story View Modal if clicked */}
      {activeStory && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-sm w-full bg-slate-900 rounded-3xl overflow-hidden aspect-[9/16] text-white">
            <button
              onClick={() => setActiveStory(null)}
              className="absolute top-4 right-4 z-20 px-3 py-1 bg-black/60 rounded-full text-xs font-bold"
            >
              ✕ Close
            </button>
            <img
              src={STORIES.find((s) => s.id === activeStory)?.image}
              alt="Story"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-6 inset-x-6 z-10 text-center">
              <span className="font-script text-3xl font-bold text-sky-200 drop-shadow-md">
                Accessories Make It You ♡
              </span>
              <button
                onClick={() => {
                  setActiveStory(null);
                  setActiveTab('shop');
                }}
                className="mt-4 w-full py-2.5 bg-white text-slate-900 font-bold rounded-full text-xs"
              >
                Shop This Look
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Mobile Order Details Sheet Modal */}
      {selectedMobileOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md max-h-[88vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-800">
            {/* Sheet Handle & Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Order Details</span>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>#{selectedMobileOrder.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selectedMobileOrder.status === 'delivered'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-sky-100 text-sky-700'
                  }`}>
                    {selectedMobileOrder.status.toUpperCase()}
                  </span>
                </h3>
              </div>
              <button
                onClick={() => setSelectedMobileOrder(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
              {/* 1. Live Tracking Timeline */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                    <Truck className="w-4 h-4 text-sky-600" />
                    <span>Logistics &amp; Delivery Tracking</span>
                  </div>
                  <span className="text-[10px] text-sky-600 font-semibold">Delhivery Express</span>
                </div>
                <p className="text-[10px] text-slate-500 mb-2">
                  AWB Tracking #: <span className="font-mono text-slate-700">{selectedMobileOrder.delivery.awbNumber || 'TRK-982144810'}</span>
                </p>
                <div className="space-y-2.5 pt-1">
                  {selectedMobileOrder.timeline.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <div className="mt-0.5">
                        {step.completed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-[11px] font-bold ${step.completed ? 'text-slate-800' : 'text-slate-400'}`}>
                            {step.label}
                          </span>
                          <span className="text-[9px] text-slate-400">{step.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Customer Details Card */}
              <div className="p-3 bg-white border border-slate-200 rounded-2xl">
                <div className="flex items-center gap-1.5 text-slate-900 font-bold mb-1.5">
                  <User className="w-3.5 h-3.5 text-sky-600" />
                  <span>Customer Details</span>
                </div>
                <div className="space-y-0.5 text-slate-600 text-[11px]">
                  <p className="font-bold text-slate-800">{selectedMobileOrder.customer.name}</p>
                  <p className="text-slate-500">Email: {selectedMobileOrder.customer.email}</p>
                  <p className="text-slate-500">Phone: {selectedMobileOrder.customer.phone}</p>
                </div>
              </div>

              {/* 3. Shipping Address Card */}
              <div className="p-3 bg-white border border-slate-200 rounded-2xl">
                <div className="flex items-center gap-1.5 text-slate-900 font-bold mb-1.5">
                  <MapPin className="w-3.5 h-3.5 text-sky-600" />
                  <span>Delivery Address</span>
                </div>
                <div className="space-y-0.5 text-slate-600 text-[11px]">
                  <p className="font-bold text-slate-800">{selectedMobileOrder.shippingAddress.name}</p>
                  <p className="text-slate-500 leading-relaxed">
                    {selectedMobileOrder.shippingAddress.addressLine}, {selectedMobileOrder.shippingAddress.city}, {selectedMobileOrder.shippingAddress.state} - {selectedMobileOrder.shippingAddress.pin}
                  </p>
                </div>
              </div>

              {/* 4. Ordered Items Breakdown */}
              <div className="p-3 bg-white border border-slate-200 rounded-2xl">
                <span className="font-bold text-slate-900 block mb-2">Items in Order ({selectedMobileOrder.items.length})</span>
                <div className="space-y-2.5 divide-y divide-slate-100">
                  {selectedMobileOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 pt-1.5 first:pt-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-11 h-11 rounded-lg object-cover bg-slate-50 border border-slate-100"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 truncate">{item.name}</p>
                        <p className="text-[10px] text-slate-400">
                          {item.size ? `Size: ${item.size} • ` : ''}Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="font-bold text-slate-900 tabular-nums">
                        {formatPrice(item.total)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Payment & Invoice Bill Summary */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-1.5 text-slate-700">
                <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                  <div className="flex items-center gap-1.5 text-emerald-800">
                    <FileText className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Payment &amp; Invoice</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold uppercase">{selectedMobileOrder.payment.status}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Payment Method</span>
                  <span className="font-semibold">{selectedMobileOrder.payment.methodDetail || (selectedMobileOrder.payment.type === 'cod' ? 'Cash on Delivery (COD)' : 'Online Payment (UPI/Card)')}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Transaction ID</span>
                  <span className="font-mono text-slate-600 text-[10px]">{selectedMobileOrder.payment.transactionId}</span>
                </div>
                <div className="flex justify-between text-[11px] pt-1 border-t border-emerald-200/60">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-semibold">{formatPrice(selectedMobileOrder.pricing.subtotal)}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Shipping</span>
                  <span className="font-semibold text-emerald-700">FREE</span>
                </div>
                <div className="flex justify-between text-xs font-bold pt-1 border-t border-emerald-200 text-slate-900">
                  <span>Total Amount</span>
                  <span className="text-sky-800 tabular-nums">{formatPrice(selectedMobileOrder.pricing.grandTotal)}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => setSelectedMobileOrder(null)}
                className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Close Order Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Address Modal in Mobile App */}
      {isMobileAddAddressOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md max-h-[90vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-800">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">New Location</span>
                <h3 className="text-base font-bold text-slate-900">Add Delivery Address</h3>
              </div>
              <button
                onClick={() => setIsMobileAddAddressOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!newAddrForm.line1.trim()) return;
                try {
                  await saveCustomerAddress(
                    {
                      countryId: 1,
                      stateId: 28,
                      districtId: 541,
                      pincode: newAddrForm.pincode,
                      addressLine1: newAddrForm.line1,
                      addressLine2: newAddrForm.line2,
                      cityVillage: newAddrForm.city,
                      mobileNumber: newAddrForm.phone,
                      customerAddressType: newAddrForm.type,
                    },
                    true
                  );
                  setIsMobileAddAddressOpen(false);
                } catch (err) {
                  console.error(err);
                }
              }}
              className="flex-1 overflow-y-auto p-4 space-y-3 text-xs"
            >
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Recipient Name</label>
                <input
                  type="text"
                  value={newAddrForm.name}
                  onChange={(e) => setNewAddrForm({ ...newAddrForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-sky-500 outline-none"
                  placeholder="Full Name"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Mobile Phone Number</label>
                <input
                  type="text"
                  value={newAddrForm.phone}
                  onChange={(e) => setNewAddrForm({ ...newAddrForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-sky-500 outline-none"
                  placeholder="+91 98450 12345"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={newAddrForm.pincode}
                    onChange={(e) => setNewAddrForm({ ...newAddrForm, pincode: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-sky-500 outline-none"
                    placeholder="560001"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">City / Town</label>
                  <input
                    type="text"
                    value={newAddrForm.city}
                    onChange={(e) => setNewAddrForm({ ...newAddrForm, city: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-sky-500 outline-none"
                    placeholder="Bengaluru"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Flat / House / Building Details</label>
                <input
                  type="text"
                  value={newAddrForm.line1}
                  onChange={(e) => setNewAddrForm({ ...newAddrForm, line1: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-sky-500 outline-none"
                  placeholder="e.g. Villa 18, Palm Meadows"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Street / Area / Colony</label>
                <input
                  type="text"
                  value={newAddrForm.line2}
                  onChange={(e) => setNewAddrForm({ ...newAddrForm, line2: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-sky-500 outline-none"
                  placeholder="e.g. Phase 2, Varthur Main Road"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    value={newAddrForm.state}
                    onChange={(e) => setNewAddrForm({ ...newAddrForm, state: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:border-sky-500 outline-none"
                    placeholder="Karnataka"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Address Type</label>
                  <div className="flex gap-1 pt-0.5">
                    {(['HOME', 'WORK', 'OTHER'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setNewAddrForm({ ...newAddrForm, type: t })}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold border transition-colors ${
                          newAddrForm.type === t
                            ? 'bg-sky-600 text-white border-sky-600'
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-sky-600 text-white rounded-xl text-xs font-bold hover:bg-sky-700 transition-colors shadow-md"
                >
                  Save &amp; Select Delivery Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
