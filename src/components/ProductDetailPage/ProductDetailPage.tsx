import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { useProduct } from '../../hooks/product/productHook';
import { ProductVariant } from '../../types';
import './ProductDetailPage.css';
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ArrowLeft,
  Check,
  Share2,
  Package,
  Layers,
  HelpCircle,
  Clock,
  Eye,
  Plus,
  Minus,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    products,
    addToCart,
    toggleWishlist,
    isWishlisted,
    formatPrice,
    setIsCartOpen,
    setIsCheckoutOpen,
    showToast,
  } = useShop();

  // Load product from API hook, falling back to shop context list
  const { product: hookProduct, loading: isProductLoading } = useProduct(id);
  const product = useMemo(() => {
    return hookProduct || products.find((p) => p.id === id);
  }, [hookProduct, products, id]);

  // Gallery state
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'shipping' | 'reviews'>('details');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [addedAnimation, setAddedAnimation] = useState<boolean>(false);

  // Sync state when product loads
  useEffect(() => {
    if (product) {
      const defaultImg =
        product.colorVariants?.[0]?.image || product.image;
      setSelectedImage(defaultImg);
      setSelectedColor(
        product.colorVariants?.[0]?.name || product.colors?.[0] || 'Default'
      );
      setSelectedSize(product.sizes?.[0] || '');
      setQuantity(1);
    }
  }, [product]);

  // Handle color change: update swatch & main image
  const handleSelectColor = (variant: ProductVariant) => {
    setSelectedColor(variant.name);
    if (variant.image) {
      setSelectedImage(variant.image);
    }
  };

  // Image list for gallery
  const galleryImages = useMemo(() => {
    if (!product) return [];
    const list: string[] = [];
    if (product.image) list.push(product.image);
    if (product.secondaryImage) list.push(product.secondaryImage);
    if (product.images) {
      product.images.forEach((img) => {
        if (!list.includes(img)) list.push(img);
      });
    }
    if (product.colorVariants) {
      product.colorVariants.forEach((v) => {
        if (v.image && !list.includes(v.image)) list.push(v.image);
      });
    }
    return list;
  }, [product]);

  // Related products from the same category
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.id !== product.id && p.category === product.category)
      .slice(0, 4);
  }, [products, product]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity, selectedColor, selectedSize, selectedImage);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity, selectedColor, selectedSize, selectedImage);
    setIsCheckoutOpen(true);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      showToast('Product link copied to clipboard!');
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  if (isProductLoading && !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 animate-pulse">
        <div className="h-6 w-48 bg-slate-200 rounded-lg mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-slate-200 rounded-2xl" />
          <div className="space-y-6">
            <div className="h-10 w-3/4 bg-slate-200 rounded-lg" />
            <div className="h-6 w-1/4 bg-slate-200 rounded-lg" />
            <div className="h-24 w-full bg-slate-200 rounded-lg" />
            <div className="h-12 w-1/2 bg-slate-200 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 bg-sky-50 text-sky-600 rounded-3xl mx-auto flex items-center justify-center mb-6">
          <Package className="w-10 h-10" />
        </div>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl text-slate-900 mb-3">
          Piece Not Found
        </h1>
        <p className="text-slate-500 mb-8 max-w-md mx-auto text-sm">
          The accessory you are looking for may have been archived or belongs to an exclusive past capsule collection.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/products"
            className="px-6 py-3 bg-slate-900 text-white rounded-xl font-medium text-sm hover:bg-sky-600 transition-colors shadow-sm"
          >
            Explore All Accessories
          </Link>
          <Link
            to="/"
            className="px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-medium text-sm hover:bg-slate-50 transition-colors"
          >
            Return to Atelier
          </Link>
        </div>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Breadcrumbs Navigation */}
      <nav className="border-b border-slate-200/80 bg-white/70 backdrop-blur-xs py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-slate-500">
          <Link to="/" className="hover:text-sky-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <Link to="/products" className="hover:text-sky-600 transition-colors">
            Collection
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <Link
            to={`/products?category=${product.category}`}
            className="hover:text-sky-600 transition-colors capitalize"
          >
            {product.categoryLabel || product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-900 font-medium truncate max-w-[200px] sm:max-w-xs">
            {product.name}
          </span>
        </div>
      </nav>

      {/* Main Product Showcase Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
          {/* Left Column: Image Gallery (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails list */}
            {galleryImages.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[580px] shrink-0 pb-2 md:pb-0 scrollbar-none">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                      selectedImage === img
                        ? 'border-sky-600 ring-2 ring-sky-200 scale-[1.02]'
                        : 'border-slate-200/80 opacity-70 hover:opacity-100 hover:border-slate-400'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} angle ${idx + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Stage Image */}
            <div className="relative flex-1 aspect-4/5 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-xs">
              <img
                src={selectedImage || product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />

              {/* Badges on image */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.badge && (
                  <span className="product-badge-luxury px-3.5 py-1 bg-slate-900/85 text-white text-[11px] font-semibold tracking-wider uppercase rounded-full shadow-md">
                    {product.badge}
                  </span>
                )}
                {product.isBestSeller && !product.badge?.includes('Best Seller') && (
                  <span className="product-badge-luxury px-3.5 py-1 bg-amber-500/90 text-white text-[11px] font-semibold tracking-wider uppercase rounded-full shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Best Seller
                  </span>
                )}
              </div>

              {/* Action buttons on image */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="p-2.5 bg-white/90 hover:bg-white text-slate-700 rounded-full shadow-md hover:text-sky-600 transition-all cursor-pointer"
                  title="Share Piece"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-2.5 bg-white/90 hover:bg-white rounded-full shadow-md transition-all cursor-pointer ${
                    wishlisted
                      ? 'text-rose-600 bg-rose-50'
                      : 'text-slate-700 hover:text-rose-600'
                  }`}
                  title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart
                    className={`w-4 h-4 ${wishlisted ? 'fill-rose-600 text-rose-600' : ''}`}
                  />
                </button>
              </div>

              {/* Watermark / Brand stamp */}
              <div className="absolute bottom-4 left-4 text-white/90 text-[10px] tracking-widest uppercase font-mono px-3 py-1 bg-slate-900/60 backdrop-blur-md rounded-lg">
                Luné Atelier Edition
              </div>
            </div>
          </div>

          {/* Right Column: Product Info & Commerce Actions (5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            {/* Header info */}
            <div className="mb-4">
              <span className="text-xs uppercase tracking-widest text-sky-600 font-semibold mb-1 block">
                {product.categoryLabel || product.category}
              </span>
              <h1 className="font-serif-luxury text-3xl sm:text-4xl text-slate-900 leading-tight mb-2">
                {product.name}
              </h1>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-3">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-slate-200 text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-slate-700">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-xs text-slate-400">
                  ({product.reviewsCount} verified reviews)
                </span>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 mb-6 shadow-xs flex items-baseline justify-between">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-slate-900 tracking-tight">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-slate-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Save{' '}
                    {Math.round(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                        100
                    )}
                    %
                  </span>
                )}
              </div>
              <span className="text-[11px] font-medium text-slate-500">
                Taxes included
              </span>
            </div>

            {/* Short Narrative */}
            <p className="text-slate-600 text-sm leading-relaxed mb-6 font-light">
              {product.description}
            </p>

            {/* Color Variant Swatches (if available) */}
            {product.colorVariants && product.colorVariants.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Color: <span className="text-sky-600 font-normal">{selectedColor}</span>
                  </span>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  {product.colorVariants.map((variant, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectColor(variant)}
                      className={`group flex items-center gap-2 p-1.5 pr-3 rounded-full border transition-all cursor-pointer ${
                        selectedColor === variant.name
                          ? 'border-sky-600 bg-sky-50/50 shadow-xs ring-2 ring-sky-200'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                      title={variant.name}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-slate-300/80 shrink-0 shadow-xs"
                        style={{ backgroundColor: variant.colorHex || '#0284C7' }}
                      />
                      <span className="text-xs font-medium text-slate-700">
                        {variant.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes Selection (if apparel/rings) */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Select Size: <span className="text-sky-600 font-normal">{selectedSize}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => showToast('Standard international sizing applies.')}
                    className="text-xs text-sky-600 hover:underline cursor-pointer"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`min-w-12 h-10 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center justify-center ${
                        selectedSize === sz
                          ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Primary Purchase CTAs */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                {/* Stepper */}
                <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-30 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-semibold text-sm text-slate-800">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Bag Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`flex-1 py-3 px-6 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                    addedAnimation
                      ? 'bg-emerald-600 text-white scale-[0.98]'
                      : 'bg-slate-900 hover:bg-sky-600 text-white'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Added to Shopping Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag • {formatPrice(product.price * quantity)}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Direct Buy Now Button */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full py-3 px-6 rounded-xl font-medium text-sm bg-sky-600 hover:bg-sky-700 text-white transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Buy Now with Express Checkout</span>
              </button>
            </div>

            {/* Trust Badges & Guarantee Micro-Cards */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-white rounded-2xl border border-slate-200/80 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-800">Free Express Delivery</h4>
                  <p className="text-[11px] text-slate-400">On all prepaid & COD orders</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-800">Authentic Luxury</h4>
                  <p className="text-[11px] text-slate-400">Handcrafted certificate included</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-800">30-Day Easy Returns</h4>
                  <p className="text-[11px] text-slate-400">Doorstep pickup available</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-800">2-4 Day Dispatch</h4>
                  <p className="text-[11px] text-slate-400">Shipped via Delhivery Air</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section: Specifications, Materials, Reviews, Shipping */}
      <section className="border-t border-slate-200 bg-white py-12 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex items-center gap-8 border-b border-slate-200 pb-4 mb-8 overflow-x-auto">
            {(
              [
                { id: 'details', label: 'Craftsmanship & Details' },
                { id: 'specs', label: 'Specifications' },
                { id: 'shipping', label: 'Shipping & Returns' },
                { id: 'reviews', label: `Reviews (${product.reviewsCount})` },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`text-sm font-semibold tracking-wide whitespace-nowrap cursor-pointer transition-colors relative py-2 ${
                  activeTab === tab.id
                    ? 'text-slate-900 after:absolute after:bottom-[-17px] after:left-0 after:right-0 after:h-0.5 after:bg-sky-600'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Details */}
          {activeTab === 'details' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h3 className="font-serif-luxury text-2xl text-slate-900">
                Artisan Heritage & Tailoring
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed max-w-3xl">
                Each piece in the Luné atelier is carefully finished by master artisans who have perfected their trade over decades. From custom-molded gold-tone hardware to delicate hypoallergenic coatings, every millimeter reflects timeless elegance.
              </p>
              {product.details && product.details.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                  {product.details.map((detail, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <Check className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-700 font-medium">{detail}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Specifications */}
          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm animate-in fade-in duration-200">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-400 block mb-1">Category</span>
                <span className="font-medium text-slate-800 capitalize">
                  {product.categoryLabel || product.category}
                </span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-400 block mb-1">SKU Identification</span>
                <span className="font-mono text-xs text-slate-800">
                  LNE-{product.id.toUpperCase()}-2026
                </span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-400 block mb-1">Weight & Form</span>
                <span className="font-medium text-slate-800">Lightweight Ergonomic Structure</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-400 block mb-1">Packaging</span>
                <span className="font-medium text-slate-800">
                  Signature Luné Velvet Dustbag & Gift Box
                </span>
              </div>
            </div>
          )}

          {/* Tab 3: Shipping */}
          {activeTab === 'shipping' && (
            <div className="space-y-4 text-sm text-slate-600 animate-in fade-in duration-200">
              <div className="p-5 bg-sky-50/50 rounded-2xl border border-sky-100">
                <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-sky-600" />
                  Domestic & International Logistics
                </h4>
                <p className="text-xs leading-relaxed text-slate-600">
                  Orders are dispatched within 24 to 48 hours from our central fulfillment hub in Bengaluru. Standard express transit takes 2-4 business days across India and 5-7 business days worldwide.
                </p>
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-slate-700" />
                  Effortless Returns & Exchanges
                </h4>
                <p className="text-xs leading-relaxed text-slate-600">
                  If this piece does not exceed your expectations, schedule a complimentary return pickup within 30 days of delivery. Refunds are credited to your original payment method immediately following inspection.
                </p>
              </div>
            </div>
          )}

          {/* Tab 4: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-serif-luxury text-2xl text-slate-900">
                    Client Reflections
                  </h3>
                  <p className="text-xs text-slate-500">
                    {product.reviewsCount} authenticated purchases
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-slate-900">
                    {product.rating.toFixed(1)}
                  </span>
                  <span className="text-xs text-slate-400 block">out of 5.0</span>
                </div>
              </div>

              {/* Sample verified review cards */}
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-sky-600 text-white font-semibold text-xs flex items-center justify-center">
                        A
                      </div>
                      <span className="text-xs font-semibold text-slate-900">Ananya R.</span>
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                        Verified Buyer
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">3 days ago</span>
                  </div>
                  <div className="flex text-amber-400 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    The quality of the craftsmanship took my breath away. It looks even more stunning in person than in the photographs, and the packaging felt like receiving a haute couture parcel!
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-700 text-white font-semibold text-xs flex items-center justify-center">
                        M
                      </div>
                      <span className="text-xs font-semibold text-slate-900">Meera S.</span>
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                        Verified Buyer
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">1 week ago</span>
                  </div>
                  <div className="flex text-amber-400 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Delivery arrived 2 days earlier than estimated. The color accuracy is remarkable and it compliments both traditional and contemporary wardrobe ensembles effortlessly.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Related Products Recommendation Carousel/Grid */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16 border-t border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs uppercase tracking-widest text-sky-600 font-semibold mb-1 block">
                Harmonious Pairings
              </span>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl text-slate-900">
                You May Also Admire
              </h2>
            </div>
            <Link
              to={`/products?category=${product.category}`}
              className="text-xs font-medium text-slate-700 hover:text-sky-600 flex items-center gap-1 transition-colors"
            >
              <span>Explore Category</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                onClick={() => navigate(`/product/${rel.id}`)}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col"
              >
                <div className="aspect-square bg-slate-100 overflow-hidden relative">
                  <img
                    src={rel.image}
                    alt={rel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {rel.badge && (
                    <span className="absolute top-2 left-2 px-2.5 py-0.5 bg-slate-900/80 text-white text-[10px] font-semibold uppercase tracking-wider rounded-full backdrop-blur-xs">
                      {rel.badge}
                    </span>
                  )}
                </div>
                <div className="p-3.5 flex flex-col flex-1 justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block mb-0.5">
                      {rel.categoryLabel}
                    </span>
                    <h3 className="font-serif-luxury text-base text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-1">
                      {rel.name}
                    </h3>
                  </div>
                  <div className="flex items-baseline justify-between mt-3 pt-2 border-t border-slate-100">
                    <span className="text-sm font-bold text-slate-900">
                      {formatPrice(rel.price)}
                    </span>
                    <div className="flex items-center text-amber-400 text-xs">
                      <Star className="w-3 h-3 fill-amber-400 mr-1" />
                      <span className="text-slate-600 font-semibold text-[11px]">
                        {rel.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;
