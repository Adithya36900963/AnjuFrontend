import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { X, Sparkles, Check, ArrowRight, ShoppingBag } from 'lucide-react';

export const StyleAdvisorModal: React.FC = () => {
  const { isStyleAdvisorOpen, setIsStyleAdvisorOpen, addToCart, formatPrice, setIsCartOpen } = useShop();

  const [vibe, setVibe] = useState<'minimal' | 'statement' | 'everyday'>('minimal');
  const [occasion, setOccasion] = useState<'day' | 'evening' | 'work'>('day');

  if (!isStyleAdvisorOpen) return null;

  // Curated capsule based on selection
  const curatedProducts =
    vibe === 'minimal'
      ? [PRODUCTS[3], PRODUCTS[1], PRODUCTS[0]] // Sunglasses, Watch, Scrunchie
      : vibe === 'statement'
      ? [PRODUCTS[2], PRODUCTS[4], PRODUCTS[5]] // Handbag, Gold Hoops, Necklace
      : [PRODUCTS[2], PRODUCTS[3], PRODUCTS[7]]; // Handbag, Sunglasses, Tech case

  const bundleTotal = curatedProducts.reduce((sum, p) => sum + p.price, 0);
  const bundleDiscounted = bundleTotal * 0.85; // 15% off capsule bundle

  const handleAddBundleToBag = () => {
    curatedProducts.forEach((p) => addToCart(p, 1));
    setIsStyleAdvisorOpen(false);
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsStyleAdvisorOpen(false)}
      />

      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl p-6 sm:p-8 z-10 border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={() => setIsStyleAdvisorOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-sky-600 mb-1">
          <Sparkles className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Luné Style Matcher
          </span>
        </div>

        <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-slate-900">
          Find What Makes It You
        </h3>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          Answer two quick style preferences to reveal your personalized accessory capsule.
        </p>

        {/* Step 1: Vibe Selection */}
        <div className="mb-5">
          <label className="text-xs font-semibold text-slate-700 block mb-2">
            1. What is your signature aesthetic?
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { id: 'minimal', label: 'Minimalist Chic', desc: 'Quiet luxury & clean lines' },
              { id: 'statement', label: 'Golden Glamour', desc: 'Warm 18k accents & eye-catchers' },
              { id: 'everyday', label: 'Effortless Modern', desc: 'High-utility urban essentials' },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setVibe(option.id as any)}
                className={`p-3 rounded-xl text-left border transition-all ${
                  vibe === option.id
                    ? 'border-sky-500 bg-sky-50/70 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{option.label}</span>
                  {vibe === option.id && <Check className="w-3.5 h-3.5 text-sky-600" />}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">{option.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Occasion */}
        <div className="mb-6">
          <label className="text-xs font-semibold text-slate-700 block mb-2">
            2. What occasion are you styling for?
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { id: 'day', label: 'Weekend Brunch & Sun' },
              { id: 'evening', label: 'Dinner & Soirée' },
              { id: 'work', label: 'Executive Workspace' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setOccasion(opt.id as any)}
                className={`p-2.5 rounded-xl text-center text-xs font-semibold border transition-all ${
                  occasion === opt.id
                    ? 'border-sky-500 bg-sky-50 text-sky-800'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Curated Capsule Result */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-sky-600 tracking-wider">
                Recommended Capsule
              </span>
              <h4 className="text-xs font-bold text-slate-900">
                Your 3-Piece Synergy Set
              </h4>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 line-through mr-1.5 tabular-nums">
                {formatPrice(bundleTotal)}
              </span>
              <span className="text-xs font-bold text-sky-700 tabular-nums">
                {formatPrice(bundleDiscounted)} (15% Off)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {curatedProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-xl p-2.5 border border-slate-100 flex flex-col items-center text-center"
              >
                <img
                  src={prod.image}
                  alt={prod.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 object-cover rounded-lg mb-1.5"
                />
                <span className="text-[11px] font-semibold text-slate-900 line-clamp-1">
                  {prod.name}
                </span>
                <span className="text-[10px] text-slate-500 tabular-nums">
                  {formatPrice(prod.price)}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={handleAddBundleToBag}
            className="w-full mt-4 py-3 bg-slate-900 hover:bg-[#0284C7] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add Complete 3-Piece Capsule to Bag</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
