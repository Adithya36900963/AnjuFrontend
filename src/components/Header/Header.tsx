import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import './Header.css';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Phone,
  ChevronDown,
  X,
  Smartphone,
  Monitor,
  Sparkles,
  Code2,
  Package,
  MapPin,
  Menu,
} from 'lucide-react';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    products,
    categories,
    cartCount,
    wishlist,
    orders,
    openOrders,
    customerAddresses,
    selectedAddress,
    openAddressBook,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsStyleAdvisorOpen,
    setIsFlutterModalOpen,
    user,
    setIsAuthModalOpen,
    currency,
    setCurrency,
    searchQuery,
    setSearchQuery,
    setActiveCategory,
    openCategory,
    setQuickViewProduct,
    viewMode,
    setViewMode,
  } = useShop();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Filter products for search preview
  const searchResults = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Close search preview on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all">
      {/* Top Announcement Bar (Exact match to Instagram UI) */}
      <div className="bg-[#0284C7] text-white text-xs py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Contact Phone & Delivery Location */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-sky-200" />
              <a
                href="tel:+154644449940"
                className="font-medium tracking-wide hover:text-sky-100 transition-colors hidden sm:inline"
              >
                +1 546 4444 9940
              </a>
            </div>

            {selectedAddress && (
              <button
                onClick={() => openAddressBook()}
                className="hidden lg:flex items-center gap-1 font-medium hover:text-sky-100 transition-colors bg-sky-900/40 hover:bg-sky-900/60 px-2.5 py-0.5 rounded-full cursor-pointer"
                title="Change Delivery Location"
              >
                <MapPin className="w-3 h-3 text-sky-300" />
                <span>
                  Deliver to: {selectedAddress.cityVillage} {selectedAddress.pincode}
                </span>
              </button>
            )}
          </div>

          {/* Center: Highlight Promotion */}
          <div className="text-center font-medium tracking-wider text-[11px] sm:text-xs truncate">
            FREE DELIVERY ON ALL ORDERS. DON&apos;T MISS THIS CHANCE.
          </div>

          {/* Right: Controls & Currency */}
          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            {/* View Mode Toggle: Prototype Web vs App */}
            <div className="flex items-center bg-sky-900/40 rounded-full p-0.5 border border-sky-400/30">
              <button
                onClick={() => setViewMode('desktop')}
                className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full transition-all ${
                  viewMode === 'desktop'
                    ? 'bg-white text-sky-950 font-semibold shadow-xs'
                    : 'text-sky-100 hover:text-white'
                }`}
                title="Desktop Web Storefront"
              >
                <Monitor className="w-3 h-3" />
                <span className="hidden md:inline">Website</span>
              </button>
              <button
                onClick={() => setViewMode('mobile_app')}
                className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full transition-all ${
                  viewMode === 'mobile_app'
                    ? 'bg-white text-sky-950 font-semibold shadow-xs'
                    : 'text-sky-100 hover:text-white'
                }`}
                title="Mobile App Prototype"
              >
                <Smartphone className="w-3 h-3" />
                <span className="hidden md:inline">App View</span>
              </button>
            </div>

            {/* Flutter Code Modal Button */}
            <button
              onClick={() => setIsFlutterModalOpen(true)}
              className="flex items-center gap-1 font-semibold text-sky-100 hover:text-white transition-colors bg-sky-800/50 hover:bg-sky-800 px-2 py-0.5 rounded-full"
              title="Get iOS & Android Flutter Code"
            >
              <Code2 className="w-3 h-3 text-sky-300" />
              <span>Flutter Code</span>
            </button>

            {/* Currency selector */}
            <div className="relative">
              <button
                onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                className="flex items-center gap-1 font-medium hover:text-sky-100 transition-colors"
              >
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {isCurrencyDropdownOpen && (
                <div className="absolute right-0 mt-1 w-24 bg-white text-slate-800 rounded-lg shadow-lg border border-slate-100 py-1 z-50">
                  {(['USD', 'EUR', 'GBP', 'INR'] as const).map((curr) => (
                    <button
                      key={curr}
                      onClick={() => {
                        setCurrency(curr);
                        setIsCurrencyDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-sky-50 transition-colors ${
                        currency === curr ? 'font-bold text-sky-600 bg-sky-50/50' : 'text-slate-600'
                      }`}
                    >
                      {curr} ({curr === 'USD' ? '$' : curr === 'EUR' ? '€' : curr === 'GBP' ? '£' : '₹'})
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 sm:gap-6">
        {/* Zone 1: Mobile Hamburger Toggle + Brand Wordmark */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-sky-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link
            to="/"
            onClick={() => {
              setActiveCategory('all');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group flex flex-col items-start select-none shrink-0 cursor-pointer"
          >
            <span className="font-serif-luxury text-2xl sm:text-4xl tracking-tight text-slate-900 group-hover:text-sky-600 transition-colors leading-none">
              Luné
            </span>
            <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-slate-400 font-semibold mt-0.5">
              Accessories For Her
            </span>
          </Link>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
          <div
            className="relative"
            onMouseEnter={() => setIsShopDropdownOpen(true)}
            onMouseLeave={() => setIsShopDropdownOpen(false)}
          >
            <button
              onClick={() => openCategory('all')}
              className="flex items-center gap-1 hover:text-sky-600 transition-colors py-1 cursor-pointer"
            >
              Shop
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {isShopDropdownOpen && (
              <div className="absolute top-full left-0 w-56 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-50 grid grid-cols-1 gap-1 animate-in fade-in slide-in-from-top-2 duration-150">
                <button
                  onClick={() => {
                    openCategory('all');
                    setIsShopDropdownOpen(false);
                  }}
                  className="text-left px-3 py-2 text-xs font-semibold text-slate-900 rounded-lg hover:bg-sky-50 transition-colors cursor-pointer"
                >
                  All Accessories ({products.length})
                </button>
                <div className="h-px bg-slate-100 my-1" />
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      openCategory(cat.id);
                      setIsShopDropdownOpen(false);
                    }}
                    className="flex items-center justify-between px-3 py-1.5 text-xs text-slate-600 rounded-lg hover:bg-sky-50 hover:text-sky-700 transition-colors cursor-pointer"
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-slate-400">
                      {products.filter((p) => p.category === cat.id).length}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => openCategory('dresses')}
            className="hover:text-sky-600 transition-colors cursor-pointer font-semibold"
          >
            Dresses
          </button>
          <button
            onClick={() => openCategory('sunglasses')}
            className="hover:text-sky-600 transition-colors cursor-pointer"
          >
            Sunglasses
          </button>
          <button
            onClick={() => openCategory('bags')}
            className="hover:text-sky-600 transition-colors cursor-pointer"
          >
            Bags
          </button>
          <button
            onClick={() => openCategory('jewellery')}
            className="hover:text-sky-600 transition-colors cursor-pointer"
          >
            Jewellery
          </button>
          <button
            onClick={() => openCategory('watches')}
            className="hover:text-sky-600 transition-colors cursor-pointer"
          >
            Watches
          </button>
          <button
            onClick={() => openCategory('hair')}
            className="hover:text-sky-600 transition-colors cursor-pointer"
          >
            Hair
          </button>

          <button
            onClick={() => openOrders()}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === 'orders' ? 'text-sky-600 font-bold' : 'hover:text-sky-600'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Orders</span>
            <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded-full font-bold">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => openAddressBook()}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === 'addresses' ? 'text-sky-600 font-bold' : 'hover:text-sky-600'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Addresses</span>
            <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded-full font-bold">
              {customerAddresses.length}
            </span>
          </button>

          <button
            onClick={() => setIsStyleAdvisorOpen(true)}
            className="flex items-center gap-1.5 text-sky-600 font-semibold hover:text-sky-700 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Style Quiz
          </button>
        </nav>

        {/* Zone 3: Search & User Affordances */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Search Bar matching screenshot */}
          <div ref={searchRef} className="relative hidden md:block w-48 lg:w-64">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search for accessories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    setIsSearchFocused(false);
                    navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                  }
                }}
                className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-full focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all text-slate-800 placeholder-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Instant Search Results Dropdown */}
            {isSearchFocused && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-50 max-h-80 overflow-y-auto">
                <div className="text-[11px] font-semibold text-slate-400 px-3 py-1 uppercase tracking-wider">
                  Matching Products ({searchResults.length})
                </div>
                {searchResults.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => {
                      navigate(`/product/${product.id}`);
                      setIsSearchFocused(false);
                    }}
                    className="w-full flex items-center gap-3 p-2 hover:bg-sky-50 rounded-lg text-left transition-colors cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 object-cover rounded-md bg-slate-100"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-[11px] text-slate-500">{product.categoryLabel}</p>
                    </div>
                    <span className="text-xs font-bold text-sky-600 tabular-nums">
                      ${product.price.toFixed(2)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Account Button */}
          {user ? (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-full bg-slate-100 hover:bg-sky-50 text-slate-800 transition-colors"
              title={`Logged in as ${user.name}`}
              aria-label="Member Profile"
            >
              <div className="w-6 h-6 rounded-full bg-sky-600 text-white text-[10px] font-bold flex items-center justify-center">
                {user.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <span className="text-xs font-semibold hidden xl:inline text-slate-700">
                {user.name.split(' ')[0]}
              </span>
            </button>
          ) : (
            <button
              onClick={() => setViewMode('auth_page')}
              className="flex items-center gap-1.5 p-2 text-slate-600 hover:text-sky-600 hover:bg-slate-50 rounded-full transition-colors"
              title="Sign In / Register"
              aria-label="User Account"
            >
              <User className="w-5 h-5" />
              <span className="text-xs font-semibold hidden md:inline text-slate-600">Sign In</span>
            </button>
          )}

          {/* Wishlist Button */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="relative p-2 text-slate-600 hover:text-rose-500 hover:bg-slate-50 rounded-full transition-colors"
            title="Saved Wishlist"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center tabular-nums shadow-xs">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Shopping Bag Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-slate-700 hover:text-sky-600 hover:bg-slate-50 rounded-full transition-colors"
            title="Shopping Bag"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#0284C7] text-white text-[10px] font-bold flex items-center justify-center tabular-nums shadow-xs">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Responsive Navigation Drawer */}
      {isMobileNavOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white/98 backdrop-blur-md px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-150 max-h-[75vh] overflow-y-auto">
          {/* Quick Search on Mobile */}
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search dresses, bags, watches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-sky-500 text-slate-800 placeholder-slate-400"
            />
          </div>

          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Categories
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                openCategory('dresses');
                setIsMobileNavOpen(false);
              }}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50 text-left text-xs font-semibold text-slate-800 hover:text-sky-700 transition-colors flex items-center justify-between"
            >
              <span>👗 Dresses &amp; Gowns</span>
              <span className="text-[10px] text-sky-600 font-bold">New</span>
            </button>
            <button
              onClick={() => {
                openCategory('bags');
                setIsMobileNavOpen(false);
              }}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50 text-left text-xs font-semibold text-slate-800 hover:text-sky-700 transition-colors flex items-center justify-between"
            >
              <span>👜 Bags</span>
            </button>
            <button
              onClick={() => {
                openCategory('sunglasses');
                setIsMobileNavOpen(false);
              }}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50 text-left text-xs font-semibold text-slate-800 hover:text-sky-700 transition-colors flex items-center justify-between"
            >
              <span>🕶️ Sunglasses</span>
            </button>
            <button
              onClick={() => {
                openCategory('watches');
                setIsMobileNavOpen(false);
              }}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50 text-left text-xs font-semibold text-slate-800 hover:text-sky-700 transition-colors flex items-center justify-between"
            >
              <span>⌚ Watches</span>
            </button>
            <button
              onClick={() => {
                openCategory('jewellery');
                setIsMobileNavOpen(false);
              }}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50 text-left text-xs font-semibold text-slate-800 hover:text-sky-700 transition-colors flex items-center justify-between"
            >
              <span>✨ Jewellery</span>
            </button>
            <button
              onClick={() => {
                openCategory('hair');
                setIsMobileNavOpen(false);
              }}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50 text-left text-xs font-semibold text-slate-800 hover:text-sky-700 transition-colors flex items-center justify-between"
            >
              <span>🎀 Hair Silk</span>
            </button>
          </div>

          <div className="h-px bg-slate-100 my-2" />

          {/* Quick Access Menu Items */}
          <div className="space-y-1">
            <button
              onClick={() => {
                openOrders();
                setIsMobileNavOpen(false);
              }}
              className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-sky-600" />
                <span>Orders Dashboard</span>
              </div>
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full font-bold">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => {
                openAddressBook();
                setIsMobileNavOpen(false);
              }}
              className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Saved Addresses</span>
              </div>
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full font-bold">
                {customerAddresses.length}
              </span>
            </button>

            <button
              onClick={() => {
                setIsStyleAdvisorOpen(true);
                setIsMobileNavOpen(false);
              }}
              className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-sky-700 hover:bg-sky-50 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>Style Match Quiz</span>
            </button>

            <button
              onClick={() => {
                setViewMode('mobile_app');
                setIsMobileNavOpen(false);
              }}
              className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Smartphone className="w-4 h-4 text-slate-500" />
              <span>Mobile App Prototype</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
