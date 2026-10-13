import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { useProducts } from '../../hooks/product/productHook';
import { useCategories } from '../../hooks/product/categoryHook';
import { Product } from '../../types';
import './ProductsPage.css';
import {
  Star,
  Heart,
  ShoppingBag,
  Eye,
  ChevronRight,
  ArrowLeft,
  ArrowUpDown,
  Search,
  X,
  LayoutGrid,
  Grid3X3,
  List,
  Check,
  SlidersHorizontal,
} from 'lucide-react';

// Lightweight Progressive Image with Skeleton Placeholder
const LightweightImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
}> = ({ src, alt, className = '', onClick }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      onClick={onClick}
      className={`relative w-full h-full overflow-hidden bg-slate-100 ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Subtle shimmer skeleton placeholder while image loads */}
      {!loaded && (
        <div className="absolute inset-0 bg-slate-200/70 animate-pulse flex items-center justify-center">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">Luné</span>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
      />
    </div>
  );
};

export const ProductsPage: React.FC = () => {
  const {
    products: contextProducts,
    categories: contextCategories,
    isLoadingProducts: isContextLoading,
    activeCategory,
    openCategory,
    setActiveCategory,
    setViewMode,
    addToCart,
    toggleWishlist,
    isWishlisted,
    formatPrice,
    setQuickViewProduct,
    showToast,
  } = useShop();

  // Connect dedicated product & category hooks from user service layer
  const { products: hookProducts, loading: isHookLoading } = useProducts();
  const { categories: hookCategories } = useCategories();

  const products = hookProducts.length > 0 ? hookProducts : contextProducts;
  const categories = hookCategories.length > 0 ? hookCategories : contextCategories;
  const isLoadingProducts = isHookLoading && isContextLoading;

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Read URL query params
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && cat !== activeCategory) {
      setActiveCategory(cat);
    }
    const q = searchParams.get('search');
    if (q) {
      setKeyword(q);
    }
    const s = searchParams.get('sort');
    if (s && ['featured', 'price-asc', 'price-desc', 'rating'].includes(s)) {
      setSortBy(s as any);
    }
  }, [searchParams, activeCategory, setActiveCategory]);

  // Layout density: 'grid' (4-col standard), 'editorial' (2-3 col roomy), 'list' (compact row)
  const [viewLayout, setViewLayout] = useState<'grid' | 'editorial' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [filterType, setFilterType] = useState<'all' | 'sale' | 'bestseller'>('all');
  const [priceRange, setPriceRange] = useState<'all' | 'under-30' | 'under-50' | '50-plus'>('all');
  const [keyword, setKeyword] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(12);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  // Active category object from service layer
  const activeCategoryObj = categories.find((c) => c.id === activeCategory);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = activeCategory === 'all'
      ? [...products]
      : products.filter((p) => p.category === activeCategory);

    // Keyword filter
    if (keyword.trim()) {
      const q = keyword.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Special badge filters
    if (filterType === 'sale') {
      list = list.filter((p) => p.originalPrice || p.badge?.includes('%'));
    } else if (filterType === 'bestseller') {
      list = list.filter((p) => p.isBestSeller || p.badge === 'Best Seller');
    }

    // Price range filter
    if (priceRange === 'under-30') {
      list = list.filter((p) => p.price < 30);
    } else if (priceRange === 'under-50') {
      list = list.filter((p) => p.price < 50);
    } else if (priceRange === '50-plus') {
      list = list.filter((p) => p.price >= 50);
    }

    // Sort order
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [products, activeCategory, keyword, filterType, priceRange, sortBy]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const handleQuickAdd = (product: Product) => {
    addToCart(product, 1);
    setJustAddedId(product.id);
    setTimeout(() => setJustAddedId(null), 1200);
  };

  const resetAllFilters = () => {
    setActiveCategory('all');
    setFilterType('all');
    setPriceRange('all');
    setKeyword('');
    setSortBy('featured');
    setVisibleCount(12);
  };

  const isFiltered =
    activeCategory !== 'all' ||
    filterType !== 'all' ||
    priceRange !== 'all' ||
    keyword.trim() !== '' ||
    sortBy !== 'featured';

  const categoryTitle =
    activeCategory === 'all'
      ? 'All Accessories'
      : activeCategoryObj?.name || 'Accessories';

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-800">
      {/* Whisper-light Navigation Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
          {/* Left: Back to Home + Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode('desktop')}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
              title="Return to Home Storefront"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Store</span>
            </button>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
              <span>/</span>
              <button
                onClick={() => setActiveCategory('all')}
                className={`transition-colors cursor-pointer ${
                  activeCategory === 'all' ? 'text-slate-900 font-semibold' : 'hover:text-slate-700'
                }`}
              >
                Catalog
              </button>
              {activeCategory !== 'all' && (
                <>
                  <span>/</span>
                  <span className="text-slate-900 font-medium capitalize">{activeCategoryObj?.name}</span>
                </>
              )}
            </div>
          </div>

          {/* Center / Right: Quick Live Search */}
          <div className="flex-1 max-w-xs relative hidden sm:block">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={`Search ${activeCategory === 'all' ? 'accessories' : activeCategoryObj?.name || ''}...`}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200/80 rounded-full focus:bg-white focus:outline-none focus:border-sky-500 transition-all placeholder:text-slate-400"
            />
            {keyword && (
              <button
                onClick={() => setKeyword('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Right: View Density Layout Switcher */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-slate-500">
              <button
                onClick={() => setViewLayout('grid')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewLayout === 'grid'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'hover:text-slate-900'
                }`}
                title="Standard Grid (Compact)"
              >
                <Grid3X3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewLayout('editorial')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewLayout === 'editorial'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'hover:text-slate-900'
                }`}
                title="Roomy Editorial View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewLayout('list')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewLayout === 'list'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'hover:text-slate-900'
                }`}
                title="Fast Lightweight List"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lightweight Category Pills & Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 pb-4">
        {/* Title & Count Row */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4">
          <div className="flex items-baseline gap-3">
            <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {categoryTitle}
            </h1>
            <span className="text-xs text-slate-500 font-medium tabular-nums">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'piece' : 'pieces'}
            </span>
          </div>

          {/* Clean Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 hidden sm:inline">Sort:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="pl-3 pr-8 py-1.5 bg-white border border-slate-200/80 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-sky-500 cursor-pointer appearance-none"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <ArrowUpDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Minimal Scrollable Category Pill Ribbon */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 pt-1">
          <button
            onClick={() => {
              setActiveCategory('all');
              searchParams.delete('category');
              setSearchParams(searchParams);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            All Items ({products.length})
          </button>
          {categories.map((cat) => {
            const count = products.filter((p) => p.category === cat.id).length;
            const isSelected = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  searchParams.set('category', cat.id);
                  setSearchParams(searchParams);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {cat.name} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>

        {/* Lightweight Secondary Filters (Under $30, On Sale, Best Sellers) */}
        <div className="flex flex-wrap items-center gap-2 pt-2 pb-2 text-xs">
          <span className="text-slate-400 text-[11px] font-medium mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3" /> Filter:
          </span>

          <button
            onClick={() => setFilterType(filterType === 'sale' ? 'all' : 'sale')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
              filterType === 'sale'
                ? 'bg-rose-50 text-rose-700 border border-rose-200 font-semibold'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            On Sale
          </button>

          <button
            onClick={() => setFilterType(filterType === 'bestseller' ? 'all' : 'bestseller')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
              filterType === 'bestseller'
                ? 'bg-sky-50 text-sky-700 border border-sky-200 font-semibold'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            Best Sellers
          </button>

          <button
            onClick={() => setPriceRange(priceRange === 'under-30' ? 'all' : 'under-30')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
              priceRange === 'under-30'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            Under $30
          </button>

          <button
            onClick={() => setPriceRange(priceRange === 'under-50' ? 'all' : 'under-50')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
              priceRange === 'under-50'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            Under $50
          </button>

          {isFiltered && (
            <button
              onClick={resetAllFilters}
              className="ml-auto text-[11px] font-medium text-slate-500 hover:text-rose-600 underline transition-colors cursor-pointer"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pb-16">
        {displayedProducts.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-slate-100 p-8 mt-2">
            <p className="text-base font-serif-luxury text-slate-700">No pieces found matching your criteria</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting your filters or selecting another category.</p>
            <button
              onClick={resetAllFilters}
              className="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-full transition-colors cursor-pointer"
            >
              View All Pieces
            </button>
          </div>
        ) : viewLayout === 'list' ? (
          /* =========================================================================
             FAST LIGHTWEIGHT LIST VIEW (Ultra-compact, low DOM, instant scanning)
             ========================================================================= */
          <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100 overflow-hidden shadow-2xs">
            {displayedProducts.map((product) => {
              const wishlisted = isWishlisted(product.id);
              const isAdded = justAddedId === product.id;

              return (
                <div
                  key={product.id}
                  className="p-3 sm:p-4 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                >
                  {/* Thumbnail & Info */}
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                      <LightweightImage
                        src={product.image}
                        alt={product.name}
                        onClick={() => setQuickViewProduct(product)}
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">
                          {product.categoryLabel}
                        </span>
                        {product.badge && (
                          <span className="text-[9px] px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded font-semibold">
                            {product.badge}
                          </span>
                        )}
                      </div>
                      <h3
                        onClick={() => setQuickViewProduct(product)}
                        className="text-xs sm:text-sm font-semibold text-slate-900 truncate hover:text-sky-600 cursor-pointer"
                      >
                        {product.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 truncate hidden sm:block max-w-md">
                        {product.description}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5 text-[10px] text-amber-500 font-semibold">
                        <span>★ {product.rating.toFixed(1)}</span>
                        <span className="text-slate-400">({product.reviewsCount})</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Price */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-xs sm:text-sm font-bold text-slate-900 tabular-nums">
                        {formatPrice(product.price)}
                      </div>
                      {product.originalPrice && (
                        <div className="text-[10px] text-slate-400 line-through tabular-nums">
                          {formatPrice(product.originalPrice)}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`p-2 rounded-full transition-colors cursor-pointer ${
                        wishlisted ? 'text-rose-500 bg-rose-50' : 'text-slate-400 hover:text-rose-500'
                      }`}
                      title={wishlisted ? 'Saved' : 'Save item'}
                    >
                      <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500' : ''}`} />
                    </button>

                    <button
                      onClick={() => handleQuickAdd(product)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-900 hover:bg-[#0284C7] text-white'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* =========================================================================
             CLEAN LUXURY GRID VIEW (Featherlight cards, no heavy box borders)
             ========================================================================= */
          <div
            className={`grid gap-4 sm:gap-6 ${
              viewLayout === 'editorial'
                ? 'grid-cols-2 md:grid-cols-3'
                : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
            }`}
          >
            {displayedProducts.map((product) => {
              const wishlisted = isWishlisted(product.id);
              const isAdded = justAddedId === product.id;

              return (
                <div
                  key={product.id}
                  className="group flex flex-col justify-between bg-white rounded-2xl p-2.5 sm:p-3 border border-slate-100 hover:border-slate-200/80 hover:shadow-md transition-all duration-200"
                >
                  {/* Clean Square Image Container */}
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-50 mb-2.5">
                    {/* Badge */}
                    {product.badge && (
                      <span
                        className={`absolute top-2 left-2 z-10 px-1.5 py-0.5 text-[9px] font-bold rounded tracking-wide ${
                          product.badge.includes('%')
                            ? 'bg-rose-500 text-white'
                            : 'bg-slate-900 text-white'
                        }`}
                      >
                        {product.badge}
                      </span>
                    )}

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      className={`absolute top-2 right-2 z-10 p-1.5 rounded-full transition-all cursor-pointer ${
                        wishlisted
                          ? 'bg-white text-rose-500 shadow-xs'
                          : 'bg-white/80 text-slate-400 hover:text-rose-500 hover:bg-white'
                      }`}
                      title={wishlisted ? 'Saved' : 'Save'}
                      aria-label="Wishlist toggle"
                    >
                      <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-rose-500' : ''}`} />
                    </button>

                    {/* Progressive Image with Skeleton */}
                    <LightweightImage
                      src={product.image}
                      alt={product.name}
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="group-hover:scale-103 transition-transform duration-300"
                    />

                    {/* Quick View Button on Hover */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuickViewProduct(product);
                      }}
                      className="absolute bottom-2 inset-x-2 py-1.5 bg-white/95 backdrop-blur-xs text-slate-800 text-[11px] font-semibold rounded-lg shadow-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>Quick View</span>
                    </button>
                  </div>

                  {/* Product Details - Lightweight & Readable */}
                  <div className="flex-1 flex flex-col justify-between pt-1">
                    <div>
                      {/* Compact Star Rating (1 crisp star instead of 5 DOM icons) */}
                      <div className="flex items-center gap-1 mb-1 text-[10px]">
                        <span className="text-amber-500 font-bold">★ {product.rating.toFixed(1)}</span>
                        <span className="text-slate-400">({product.reviewsCount})</span>
                      </div>

                      {/* Product Name */}
                      <h3
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-1 cursor-pointer"
                      >
                        {product.name}
                      </h3>

                      {/* Image variants thumbnails instead of color dots */}
                      {product.colorVariants && product.colorVariants.length > 0 ? (
                        <div className="flex items-center gap-1.5 mt-2">
                          {product.colorVariants.slice(0, 3).map((v) => (
                            <button
                              key={v.name}
                              onClick={(e) => {
                                e.stopPropagation();
                                setQuickViewProduct(product);
                              }}
                              className="w-5 h-5 rounded-md overflow-hidden border border-slate-200 hover:border-sky-500 hover:scale-110 transition-all cursor-pointer"
                              title={v.name}
                            >
                              <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                            </button>
                          ))}
                          {product.colorVariants.length > 3 && (
                            <span className="text-[10px] text-slate-400 font-medium">
                              +{product.colorVariants.length - 3}
                            </span>
                          )}
                        </div>
                      ) : null}

                      {/* Dress Sizes Display */}
                      {(product.category === 'dresses' || (product.sizes && product.sizes.length > 0)) && (
                        <div className="flex items-center gap-1 mt-2 flex-wrap">
                          <span className="text-[9px] text-slate-400 uppercase font-semibold mr-0.5">Sizes:</span>
                          {(product.sizes || ['XS', 'S', 'M', 'L', 'XL']).map((s) => (
                            <span
                              key={s}
                              className="text-[9px] px-1 py-0.2 rounded bg-slate-100 text-slate-700 font-mono font-bold"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Price & Add to Bag */}
                    <div className="mt-2.5 pt-2 border-t border-slate-50 flex items-center justify-between">
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
                        onClick={() => handleQuickAdd(product)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-[#0284C7] hover:text-white'
                        }`}
                        title="Add to Shopping Bag"
                        aria-label="Add to Bag"
                      >
                        {isAdded ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <ShoppingBag className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More Button for Large Catalogs */}
        {hasMore && (
          <div className="mt-10 text-center pb-6">
            <button
              onClick={() => setVisibleCount((prev) => prev + 12)}
              className="px-6 py-2.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-full transition-all shadow-2xs cursor-pointer"
            >
              Load More Pieces ({filteredProducts.length - visibleCount} more)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
