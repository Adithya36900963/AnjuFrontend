import React from 'react';
import {
  PRODUCTS,
  EDITORIAL_PORTRAIT_IMAGE,
  SCRUNCHIE_IMAGE,
  MINIMAL_WATCH_IMAGE,
  GOLD_JEWELLERY_IMAGE,
} from '../data/products';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';
import { Star, Heart, ShoppingBag, Eye, ArrowRight } from 'lucide-react';

export const WeeklyTopSellers: React.FC = () => {
  const {
    addToCart,
    toggleWishlist,
    isWishlisted,
    formatPrice,
    setQuickViewProduct,
    activeCategory,
    setActiveCategory,
  } = useShop();

  // Filter products based on activeCategory
  const displayedProducts =
    activeCategory === 'all'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory);

  // Take top 4 for the primary 2x2 grid
  const gridProducts = displayedProducts.slice(0, 4);

  const categoriesTab = [
    { id: 'all', label: 'All Top Sellers' },
    { id: 'hair', label: 'Hair' },
    { id: 'watches', label: 'Watches' },
    { id: 'bags', label: 'Bags' },
    { id: 'sunglasses', label: 'Sunglasses' },
    { id: 'jewellery', label: 'Jewellery' },
  ];

  return (
    <section id="catalog" className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Weekly Top Sellers
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Shop the most popular items currently trending.
            </p>
          </div>

          {/* Filter Tabs matching human design */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categoriesTab.map((tab) => {
              const active = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    active
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3-Column Editorial Split Layout matching Instagram UI */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 2x2 Product Grid (Cols 1-6) */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {gridProducts.map((product: Product) => {
                const wishlisted = isWishlisted(product.id);

                return (
                  <div
                    key={product.id}
                    className="group relative bg-[#F8FAFC] rounded-2xl p-3.5 border border-slate-100 hover:border-sky-200 hover:shadow-lg hover:shadow-sky-500/5 transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Top Badges & Actions */}
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white mb-3">
                      {/* Badge if present */}
                      {product.badge && (
                        <span
                          className={`absolute top-2.5 left-2.5 z-10 px-2 py-0.5 text-[10px] font-bold rounded-md ${
                            product.badge === '-20%'
                              ? 'bg-rose-500 text-white'
                              : 'bg-sky-600 text-white'
                          }`}
                        >
                          {product.badge}
                        </span>
                      )}

                      {/* Wishlist Heart Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product.id);
                        }}
                        className={`absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full backdrop-blur-md transition-all ${
                          wishlisted
                            ? 'bg-rose-50 text-rose-500 ring-1 ring-rose-200'
                            : 'bg-white/80 text-slate-400 hover:text-rose-500 hover:bg-white'
                        }`}
                        title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        aria-label="Toggle Wishlist"
                      >
                        <Heart
                          className={`w-4 h-4 ${wishlisted ? 'fill-rose-500' : ''}`}
                        />
                      </button>

                      {/* Product Image with smooth hover scale */}
                      <img
                        src={product.image}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500 cursor-pointer"
                        onClick={() => setQuickViewProduct(product)}
                      />

                      {/* Floating Quick Action Overlay */}
                      <div className="absolute inset-x-2 bottom-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                        <button
                          onClick={() => setQuickViewProduct(product)}
                          className="flex-1 py-1.5 px-2 bg-white/95 backdrop-blur-md text-slate-800 text-[11px] font-semibold rounded-lg shadow-sm hover:bg-white flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          <span>Quick View</span>
                        </button>
                        <button
                          onClick={() => addToCart(product, 1)}
                          className="p-1.5 bg-[#0284C7] hover:bg-sky-700 text-white rounded-lg shadow-sm flex items-center justify-center cursor-pointer"
                          title="Add to Bag"
                          aria-label="Add to Bag"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Product Metadata */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-1">
                          <div className="flex items-center text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <span className="text-[10px] text-slate-400 tabular-nums">
                            ({product.reviewsCount})
                          </span>
                        </div>

                        {/* Title */}
                        <h4
                          onClick={() => setQuickViewProduct(product)}
                          className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-sky-600 transition-colors line-clamp-1 cursor-pointer"
                        >
                          {product.name}
                        </h4>
                      </div>

                      {/* Price & Quick Add Button */}
                      <div className="mt-2.5 pt-2 border-t border-slate-200/50 flex items-center justify-between">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xs sm:text-sm font-bold text-slate-900 tabular-nums">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-[10px] text-slate-400 line-through tabular-nums">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => addToCart(product, 1)}
                          className="p-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-[#0284C7] hover:text-white transition-colors cursor-pointer"
                          title="Quick Add"
                          aria-label="Quick Add"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* If more than 4 products exist */}
            {displayedProducts.length > 4 && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setActiveCategory('all')}
                  className="text-xs font-semibold text-sky-600 hover:text-sky-800"
                >
                  Showing {gridProducts.length} of {displayedProducts.length} items
                </button>
              </div>
            )}
          </div>

          {/* Center Column: Tall Editorial Banner (Cols 7-9) */}
          <div className="lg:col-span-3">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 bg-slate-900 h-full min-h-[480px] flex flex-col justify-between group">
              {/* Editorial Model Image */}
              <img
                src={EDITORIAL_PORTRAIT_IMAGE}
                alt="Details That Complete You Editorial"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-700 opacity-90"
              />

              {/* Gradient Scrim for Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/20 pointer-events-none" />

              {/* Top Cursive Script Sticker from Screenshot: "Same Mood More You ♡" */}
              <div className="relative z-10 p-6 flex justify-end">
                <div className="px-3.5 py-1.5 bg-white/70 backdrop-blur-md rounded-2xl shadow-sm text-slate-800 transform rotate-[4deg]">
                  <span className="font-script text-xl sm:text-2xl text-sky-900 font-bold">
                    Same Mood More You ♡
                  </span>
                </div>
              </div>

              {/* Bottom Editorial Copy & CTA Button */}
              <div className="relative z-10 p-6 sm:p-7 text-white">
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-sky-300">
                  NEW COLLECTION
                </span>
                <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold mt-1.5 mb-2 leading-tight">
                  Details That <br />
                  Complete You
                </h3>
                <p className="text-xs text-slate-300 mb-5 font-normal leading-relaxed">
                  Because it&apos;s always in the details. Handcrafted with modern soul.
                </p>

                <button
                  onClick={() => {
                    setActiveCategory('all');
                    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-white text-slate-900 hover:bg-[#0284C7] hover:text-white text-xs font-semibold rounded-full shadow-lg transition-all cursor-pointer"
                >
                  <span>Shop The Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: 3 Category Spotlights (Cols 10-12) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {/* Spotlight 1: Hair Accessories */}
            <div className="bg-[#F8FAFC] border border-slate-200/70 rounded-2xl p-4 flex items-center justify-between gap-4 group hover:border-sky-300 hover:shadow-md transition-all">
              <div className="flex-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  ESSENTIALS
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                  Hair Accessories
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5 mb-3">Everyday Essentials</p>
                <button
                  onClick={() => {
                    setActiveCategory('hair');
                    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 group-hover:bg-[#0284C7] text-white text-[11px] font-semibold rounded-full transition-colors cursor-pointer"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-white shrink-0 shadow-xs">
                <img
                  src={SCRUNCHIE_IMAGE}
                  alt="Hair Accessories"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform"
                />
              </div>
            </div>

            {/* Spotlight 2: Watches */}
            <div className="bg-[#F8FAFC] border border-slate-200/70 rounded-2xl p-4 flex items-center justify-between gap-4 group hover:border-sky-300 hover:shadow-md transition-all">
              <div className="flex-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  TIMEPIECES
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                  Watches
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5 mb-3">Time for a Better You</p>
                <button
                  onClick={() => {
                    setActiveCategory('watches');
                    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 group-hover:bg-[#0284C7] text-white text-[11px] font-semibold rounded-full transition-colors cursor-pointer"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-white shrink-0 shadow-xs">
                <img
                  src={MINIMAL_WATCH_IMAGE}
                  alt="Watches"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform"
                />
              </div>
            </div>

            {/* Spotlight 3: Jewellery */}
            <div className="bg-[#F8FAFC] border border-slate-200/70 rounded-2xl p-4 flex items-center justify-between gap-4 group hover:border-sky-300 hover:shadow-md transition-all">
              <div className="flex-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  FINE PIECES
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                  Jewellery
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5 mb-3">Little Details, Big Stories</p>
                <button
                  onClick={() => {
                    setActiveCategory('jewellery');
                    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 group-hover:bg-[#0284C7] text-white text-[11px] font-semibold rounded-full transition-colors cursor-pointer"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-white shrink-0 shadow-xs">
                <img
                  src={GOLD_JEWELLERY_IMAGE}
                  alt="Jewellery"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
