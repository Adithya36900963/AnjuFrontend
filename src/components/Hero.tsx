import React from 'react';
import { HERO_IMAGE, TRUST_BADGES } from '../data/products';
import { useShop } from '../context/ShopContext';
import { ArrowRight, Truck, ShieldCheck, RotateCcw, Headphones, Star } from 'lucide-react';

export const Hero: React.FC = () => {
  const { setActiveCategory } = useShop();

  const handleShopNewArrivals = () => {
    setActiveCategory('all');
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Truck':
        return <Truck className="w-5 h-5 text-sky-600" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-sky-600" />;
      case 'RotateCcw':
        return <RotateCcw className="w-5 h-5 text-sky-600" />;
      case 'Headphones':
        return <Headphones className="w-5 h-5 text-sky-600" />;
      default:
        return <Truck className="w-5 h-5 text-sky-600" />;
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#e0f2fe]/60 via-[#f0f9ff]/40 to-transparent pt-8 pb-12 sm:pt-12 sm:pb-16">
      {/* Background ambient subtle blur circles */}
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Editorial Headline & Copy */}
          <div className="lg:col-span-6 flex flex-col items-start z-10">
            {/* Tag / Kicker matching screenshot */}
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-slate-400 mb-3">
              NEW SEASON
            </span>

            {/* Main Headline */}
            <h1 className="font-serif-luxury text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.05] mb-5 text-balance">
              Accessories <br />
              <span className="text-[#0284C7] drop-shadow-xs">Make It You</span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-lg mb-8 font-normal">
              Timeless pieces for every mood, occasion and version of you.
            </p>

            {/* CTA Button */}
            <button
              onClick={handleShopNewArrivals}
              className="group inline-flex items-center gap-3 px-8 py-3.5 bg-slate-900 hover:bg-[#0284C7] text-white font-medium text-sm rounded-full shadow-lg shadow-slate-900/10 hover:shadow-sky-500/20 active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Shop New Arrivals</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Social Proof matching screenshot */}
            <div className="mt-10 pt-6 border-t border-slate-200/70 flex items-center gap-4">
              {/* Customer Avatar Stack */}
              <div className="flex -space-x-2.5 overflow-hidden">
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Customer"
                  referrerPolicy="no-referrer"
                />
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80"
                  alt="Customer"
                  referrerPolicy="no-referrer"
                />
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80"
                  alt="Customer"
                  referrerPolicy="no-referrer"
                />
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt="Customer"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-900 tracking-tight">
                  10K+ Happy Customer
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual with Lifestyle Script Sticker */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Soft sky-blue backdrop glow frame */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-sky-900/10 border-4 border-white bg-slate-100 aspect-[4/3] sm:aspect-[16/11]">
                <img
                  src={HERO_IMAGE}
                  alt="Luné Modern Accessories Campaign"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transform hover:scale-102 transition-transform duration-700"
                />

                {/* Subtle gradient overlay to enhance typography contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent pointer-events-none" />

                {/* Cursive Sticker Badge from Instagram screenshot: "Lifestyle More You ♡" */}
                <div className="absolute top-6 right-6 sm:top-8 sm:right-8 transform rotate-[-6deg] select-none pointer-events-none">
                  <div className="px-4 py-2 bg-white/70 backdrop-blur-md rounded-2xl shadow-md border border-white/50 text-slate-800">
                    <span className="font-script text-2xl sm:text-3xl text-sky-900 font-bold tracking-wide">
                      Lifestyle More You ♡
                    </span>
                  </div>
                </div>

                {/* Small luxury brand detail tag */}
                <div className="absolute bottom-5 left-5 px-3 py-1.5 bg-slate-900/80 backdrop-blur-md rounded-lg text-[11px] font-medium text-white tracking-wider uppercase">
                  Luné Editorial 2026
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Trust Badges Strip (matching screenshot) */}
        <div className="mt-14 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {TRUST_BADGES.map((badge, idx) => (
              <div
                key={badge.title}
                className={`flex items-start gap-4 ${idx > 0 ? 'pt-4 md:pt-0 md:pl-6' : ''}`}
              >
                <div className="p-2.5 bg-sky-50 rounded-xl shrink-0">
                  {getIcon(badge.icon)}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                    {badge.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                    {badge.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
