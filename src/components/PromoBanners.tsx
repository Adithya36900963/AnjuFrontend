import React from 'react';
import { DESIGNER_SUNGLASSES_IMAGE, TEAL_HANDBAG_IMAGE } from '../data/products';
import { useShop } from '../context/ShopContext';
import { ArrowRight } from 'lucide-react';

export const PromoBanners: React.FC = () => {
  const { setActiveCategory } = useShop();

  const handleShopCategory = (cat: string) => {
    setActiveCategory(cat);
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-8 sm:py-12 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Card 1: Sunglasses - "See Your Style" */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-50 via-white to-sky-100/50 border border-slate-200/60 p-6 sm:p-8 flex items-center justify-between shadow-xs hover:shadow-md transition-shadow group">
            <div className="flex-1 z-10 pr-4">
              <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-slate-400">
                SUNGLASSES
              </span>
              <h3 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-slate-900 mt-2 mb-2 leading-tight">
                See <br />
                Your Style
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xs mb-5">
                Timeless frames for brighter days.
              </p>
              <button
                onClick={() => handleShopCategory('sunglasses')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 group-hover:bg-[#0284C7] text-white text-xs font-semibold rounded-full transition-colors shadow-xs"
              >
                <span>Shop Sunglasses</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="w-40 sm:w-52 h-40 sm:h-48 relative shrink-0">
              <img
                src={DESIGNER_SUNGLASSES_IMAGE}
                alt="Designer Sunglasses"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain filter drop-shadow-xl group-hover:scale-105 group-hover:rotate-[-2deg] transition-all duration-500"
              />
            </div>
          </div>

          {/* Card 2: Bags - "Carry Confidence" */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#e0f2fe]/80 via-white to-sky-100 border border-slate-200/60 p-6 sm:p-8 flex items-center justify-between shadow-xs hover:shadow-md transition-shadow group">
            <div className="flex-1 z-10 pr-4">
              <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-slate-400">
                BAGS
              </span>
              <h3 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-slate-900 mt-2 mb-2 leading-tight">
                Carry <br />
                Confidence
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xs mb-5">
                Designed for your everyday and beyond.
              </p>
              <button
                onClick={() => handleShopCategory('bags')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 group-hover:bg-[#0284C7] text-white text-xs font-semibold rounded-full transition-colors shadow-xs"
              >
                <span>Shop Bags</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="w-40 sm:w-52 h-40 sm:h-48 relative shrink-0">
              <img
                src={TEAL_HANDBAG_IMAGE}
                alt="Luxury Teal Handbag"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain filter drop-shadow-xl group-hover:scale-105 group-hover:rotate-1 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
