import React from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

export const WishlistDrawer: React.FC = () => {
  const {
    wishlist,
    isWishlistOpen,
    setIsWishlistOpen,
    toggleWishlist,
    addToCart,
    formatPrice,
  } = useShop();

  if (!isWishlistOpen) return null;

  const wishlistedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsWishlistOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <h3 className="font-serif-luxury text-xl font-bold text-slate-900">
                Saved Wishlist ({wishlist.length})
              </h3>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {wishlistedProducts.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8" />
                </div>
                <h4 className="font-serif-luxury text-xl font-bold text-slate-900">
                  No Saved Favorites
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Click the heart icon on any accessory to save it to your personal inspiration list.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {wishlistedProducts.map((product) => (
                  <div key={product.id} className="py-4 flex gap-3.5 items-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 object-cover rounded-xl bg-slate-100 shrink-0 border border-slate-100"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-slate-900 line-clamp-1">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-slate-500">{product.categoryLabel}</p>
                      <p className="text-xs font-bold text-sky-700 mt-1 tabular-nums">
                        {formatPrice(product.price)}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          addToCart(product, 1);
                          toggleWishlist(product.id);
                        }}
                        className="p-2 bg-sky-50 text-sky-700 hover:bg-[#0284C7] hover:text-white rounded-lg transition-colors cursor-pointer"
                        title="Move to Bag"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="p-2 text-slate-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
