import React from 'react';
import { useShop } from '../context/ShopContext';
import { Instagram, Facebook, Twitter, Smartphone, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveCategory, setViewMode } = useShop();

  const handleNav = (category: string) => {
    setActiveCategory(category);
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-white border-t border-slate-200/80 pt-16 pb-12 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-slate-100">
          {/* Brand Column */}
          <div className="lg:col-span-2 pr-0 lg:pr-8">
            <div className="flex flex-col items-start select-none">
              <span className="font-serif-luxury text-3xl font-bold tracking-tight text-slate-900 leading-none">
                Luné
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-slate-400 font-semibold mt-1">
                Accessories For Her
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-4 leading-relaxed max-w-sm">
              Thoughtfully curated accessories to make every moment more you. Designed with timeless
              elegance and modern soul.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href="#instagram"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-sky-50 hover:text-sky-600 text-slate-600 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#facebook"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-sky-50 hover:text-sky-600 text-slate-600 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#twitter"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-sky-50 hover:text-sky-600 text-slate-600 flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 1: SHOP */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Shop
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-500">
              <li>
                <button
                  onClick={() => handleNav('sunglasses')}
                  className="hover:text-sky-600 transition-colors"
                >
                  Sunglasses
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('bags')}
                  className="hover:text-sky-600 transition-colors"
                >
                  Bags
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('jewellery')}
                  className="hover:text-sky-600 transition-colors"
                >
                  Jewellery
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('watches')}
                  className="hover:text-sky-600 transition-colors"
                >
                  Watches
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('hair')}
                  className="hover:text-sky-600 transition-colors"
                >
                  Hair Accessories
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('all')}
                  className="hover:text-sky-600 transition-colors"
                >
                  All Products
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: HELP */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Help
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-500">
              <li>
                <a href="#track-order" className="hover:text-sky-600 transition-colors">
                  Track Order
                </a>
              </li>
              <li>
                <a href="#returns" className="hover:text-sky-600 transition-colors">
                  Returns &amp; Exchanges
                </a>
              </li>
              <li>
                <a href="#shipping" className="hover:text-sky-600 transition-colors">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#sizeguide" className="hover:text-sky-600 transition-colors">
                  Size Guide
                </a>
              </li>
              <li>
                <a href="#faqs" className="hover:text-sky-600 transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-sky-600 transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: COMPANY & APP */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-500 mb-6">
              <li>
                <a href="#about" className="hover:text-sky-600 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#story" className="hover:text-sky-600 transition-colors">
                  Our Story
                </a>
              </li>
              <li>
                <a href="#sustainability" className="hover:text-sky-600 transition-colors">
                  Sustainability
                </a>
              </li>
              <li>
                <a href="#careers" className="hover:text-sky-600 transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-sky-600 transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>

            {/* Download Our App */}
            <div>
              <h5 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-sky-600" />
                <span>Download Our App</span>
              </h5>
              <p className="text-[10px] text-slate-400 mb-2.5">
                Experience seamless 1-tap style shopping on mobile.
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setViewMode('mobile_app')}
                  className="inline-flex items-center gap-2.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-sky-600 transition-colors text-left"
                >
                  <div className="text-[9px] uppercase leading-none opacity-80">
                    Preview Interactive
                    <span className="block text-xs font-bold mt-0.5 normal-case">
                      App Store
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => setViewMode('mobile_app')}
                  className="inline-flex items-center gap-2.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-sky-600 transition-colors text-left"
                >
                  <div className="text-[9px] uppercase leading-none opacity-80">
                    GET IT ON
                    <span className="block text-xs font-bold mt-0.5 normal-case">
                      Google Play
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row: Payment icons & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-slate-400">
            &copy; 2026 Luné. All rights reserved. Designed with luxury modern aesthetics.
          </p>

          {/* Payment Badges from Screenshot */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
            <div className="px-2.5 py-1 bg-slate-50 border border-slate-200/60 rounded text-slate-600 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-sky-600" />
              <span>GPay</span>
            </div>
            <div className="px-2.5 py-1 bg-slate-50 border border-slate-200/60 rounded text-slate-600 font-semibold">
              Apple Pay
            </div>
            <div className="px-2.5 py-1 bg-slate-50 border border-slate-200/60 rounded text-slate-600 font-semibold">
              Visa
            </div>
            <div className="px-2.5 py-1 bg-slate-50 border border-slate-200/60 rounded text-slate-600 font-semibold">
              Mastercard
            </div>
            <div className="px-2.5 py-1 bg-slate-50 border border-slate-200/60 rounded text-slate-600 font-semibold">
              PhonePe
            </div>
            <div className="px-2.5 py-1 bg-slate-50 border border-slate-200/60 rounded text-slate-600 font-semibold">
              Amazon Pay
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
