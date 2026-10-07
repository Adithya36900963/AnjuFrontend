import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, Star, ShoppingBag, Heart, Shield, Sparkles, Check } from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    isWishlisted,
    toggleWishlist,
    formatPrice,
    setIsCartOpen,
  } = useShop();

  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const activeColor = selectedColor || quickViewProduct.colors?.[0] || '';
  const wishlisted = isWishlisted(quickViewProduct.id);

  const handleAddToCart = () => {
    addToCart(quickViewProduct, quantity, activeColor);
  };

  const handleInstantBuy = () => {
    addToCart(quickViewProduct, quantity, activeColor);
    setQuickViewProduct(null);
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setQuickViewProduct(null)}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden z-10 border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Product Image */}
          <div className="relative bg-slate-50 p-8 flex items-center justify-center min-h-[340px]">
            {quickViewProduct.badge && (
              <span className="absolute top-4 left-4 px-2.5 py-1 text-xs font-bold rounded-lg bg-sky-600 text-white shadow-xs">
                {quickViewProduct.badge}
              </span>
            )}
            <img
              src={quickViewProduct.image}
              alt={quickViewProduct.name}
              referrerPolicy="no-referrer"
              className="max-h-72 w-full object-contain filter drop-shadow-xl"
            />
          </div>

          {/* Right: Product Details & Purchase Module */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="uppercase tracking-wider font-semibold text-slate-400">
                  {quickViewProduct.categoryLabel}
                </span>
                <div className="flex items-center gap-1">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 tabular-nums">
                    ({quickViewProduct.reviewsCount} reviews)
                  </span>
                </div>
              </div>

              {/* Title */}
              <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                {quickViewProduct.name}
              </h3>

              {/* Price */}
              <div className="flex items-baseline gap-2 mt-2 mb-4">
                <span className="text-xl font-bold text-slate-900 tabular-nums">
                  {formatPrice(quickViewProduct.price)}
                </span>
                {quickViewProduct.originalPrice && (
                  <span className="text-xs text-slate-400 line-through tabular-nums">
                    {formatPrice(quickViewProduct.originalPrice)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                {quickViewProduct.description}
              </p>

              {/* Details Bullet points */}
              <div className="space-y-1 mb-5">
                {quickViewProduct.details.map((detail, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>

              {/* Color Swatches if available */}
              {quickViewProduct.colors && quickViewProduct.colors.length > 0 && (
                <div className="mb-5">
                  <span className="text-xs font-semibold text-slate-700 block mb-2">
                    Select Colorway
                  </span>
                  <div className="flex items-center gap-2">
                    {quickViewProduct.colors.map((hex) => (
                      <button
                        key={hex}
                        onClick={() => setSelectedColor(hex)}
                        className={`w-6 h-6 rounded-full border-2 transition-all ${
                          activeColor === hex
                            ? 'ring-2 ring-sky-500 ring-offset-1 border-white scale-110'
                            : 'border-white opacity-80 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-slate-200 rounded-full px-2 py-1 bg-slate-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2 text-slate-500 hover:text-slate-800"
                  >
                    -
                  </button>
                  <span className="px-2 text-xs font-bold text-slate-800 tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2 text-slate-500 hover:text-slate-800"
                  >
                    +
                  </button>
                </div>

                {/* Add to Bag Button */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-4 bg-slate-900 hover:bg-[#0284C7] text-white text-xs font-semibold rounded-full shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Shopping Bag</span>
                </button>

                {/* Wishlist toggle */}
                <button
                  onClick={() => toggleWishlist(quickViewProduct.id)}
                  className={`p-3 rounded-full border transition-colors ${
                    wishlisted
                      ? 'border-rose-200 bg-rose-50 text-rose-500'
                      : 'border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-slate-50'
                  }`}
                  aria-label="Wishlist toggle"
                >
                  <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              {/* Buy Now 1-Click */}
              <button
                onClick={handleInstantBuy}
                className="w-full py-2.5 px-4 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold rounded-full transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>Instant Buy &amp; Checkout</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 pt-1">
                <Shield className="w-3 h-3 text-emerald-600" />
                <span>30-Day Risk-Free Returns &amp; Authenticity Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
