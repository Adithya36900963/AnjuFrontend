import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, CheckCircle2, ShoppingBag } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    formatPrice,
  } = useShop();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [promoFeedback, setPromoFeedback] = useState<string>('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  if (!isCartOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 99;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartTotal);
  const freeShippingProgress = Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100);

  const discountAmount = (cartTotal * discountPercent) / 100;
  const finalTotal = Math.max(0, cartTotal - discountAmount);

  const applyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'LUNE15' || promoCode.trim().toUpperCase() === 'WELCOME15') {
      setDiscountPercent(15);
      setPromoFeedback('15% discount applied successfully!');
    } else {
      setPromoFeedback('Invalid discount code. Try "LUNE15".');
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      const generatedOrder = `LUNE-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderNumber(generatedOrder);
      setIsCheckingOut(false);
      setOrderConfirmed(true);
      clearCart();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-sky-600" />
              <h3 className="font-serif-luxury text-xl font-bold text-slate-900">
                Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h3>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {orderConfirmed ? (
              <div className="py-12 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="font-serif-luxury text-2xl font-bold text-slate-900">
                  Thank You for Your Order!
                </h4>
                <p className="text-xs text-slate-500 mt-2 max-w-xs">
                  Your order has been confirmed and our styling atelier is preparing your package.
                </p>
                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200/60 w-full text-center">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold">
                    Order Reference
                  </span>
                  <p className="text-base font-bold text-sky-700 font-mono mt-0.5">
                    #{orderNumber}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setOrderConfirmed(false);
                    setIsCartOpen(false);
                  }}
                  className="mt-6 px-6 py-2.5 bg-slate-900 text-white rounded-full text-xs font-semibold hover:bg-sky-600 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-serif-luxury text-xl font-bold text-slate-900">
                  Your Bag is Empty
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Discover our weekly top sellers to find accessories that make you feel truly you.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="mt-6 px-6 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-full hover:bg-sky-600 transition-colors"
                >
                  Explore Top Sellers
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Free Shipping Meter */}
                <div className="p-3 bg-sky-50/70 rounded-xl border border-sky-100">
                  <div className="flex items-center justify-between text-[11px] font-semibold mb-1.5">
                    <span className="text-sky-900">
                      {amountToFreeShipping > 0
                        ? `Add ${formatPrice(amountToFreeShipping)} more for FREE Delivery`
                        : '🎉 You qualified for FREE Delivery!'}
                    </span>
                    <span className="text-sky-700 font-bold tabular-nums">
                      {Math.round(freeShippingProgress)}%
                    </span>
                  </div>
                  <div className="w-full bg-sky-200/60 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-[#0284C7] h-full transition-all duration-500"
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                </div>

                {/* Cart Items List */}
                <div className="divide-y divide-slate-100">
                  {cart.map((item) => (
                    <div key={item.product.id} className="py-4 flex gap-3.5 items-start">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 object-cover rounded-xl bg-slate-100 shrink-0 border border-slate-100"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs font-semibold text-slate-900 line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-slate-400 hover:text-rose-500 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {item.product.categoryLabel}
                        </p>

                        <div className="flex items-center justify-between mt-3">
                          {/* Quantity selector */}
                          <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 hover:bg-white text-slate-600 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2.5 text-xs font-semibold text-slate-800 tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 hover:bg-white text-slate-600 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Price */}
                          <span className="text-xs font-bold text-slate-900 tabular-nums">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo code form */}
                <form onSubmit={applyPromo} className="pt-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo code (e.g. LUNE15)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 uppercase"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {promoFeedback && (
                    <p
                      className={`text-[11px] mt-1.5 ${
                        discountPercent > 0 ? 'text-emerald-600 font-semibold' : 'text-rose-500'
                      }`}
                    >
                      {promoFeedback}
                    </p>
                  )}
                </form>
              </div>
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {!orderConfirmed && cart.length > 0 && (
            <div className="p-6 bg-slate-50 border-t border-slate-100">
              <div className="space-y-1.5 text-xs text-slate-500 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount ({discountPercent}%)</span>
                    <span className="font-semibold tabular-nums">
                      -{formatPrice(discountAmount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Standard Shipping</span>
                  <span className="font-semibold text-slate-900">
                    {amountToFreeShipping === 0 ? 'FREE' : formatPrice(6.0)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200/80">
                  <span>Estimated Total</span>
                  <span className="text-base text-sky-800 tabular-nums">
                    {formatPrice(finalTotal + (amountToFreeShipping === 0 ? 0 : 6.0))}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-3.5 bg-slate-900 hover:bg-[#0284C7] text-white text-xs font-semibold rounded-full shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isCheckingOut ? (
                  <span>Processing Order...</span>
                ) : (
                  <>
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>256-bit Encrypted Secure Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
