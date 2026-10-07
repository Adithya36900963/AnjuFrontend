import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryGrid } from './components/CategoryGrid';
import { PromoBanners } from './components/PromoBanners';
import { WeeklyTopSellers } from './components/WeeklyTopSellers';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { StyleAdvisorModal } from './components/StyleAdvisorModal';
import { MobileAppView } from './components/MobileAppView';
import { Monitor, Smartphone, Sparkles, Check } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { viewMode, setViewMode, setIsStyleAdvisorOpen, toast } = useShop();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-5 h-5 bg-sky-500 rounded-full flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 text-white" />
          </div>
          <span>{toast}</span>
        </div>
      )}

      {/* Floating Mode Switcher Widget for Prototype Testing */}
      <div className="fixed bottom-6 left-6 z-40 hidden sm:flex items-center gap-1.5 p-1.5 bg-white/90 backdrop-blur-md rounded-full shadow-xl border border-slate-200/80">
        <button
          onClick={() => setViewMode('desktop')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            viewMode === 'desktop'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Switch to Desktop Website Storefront"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Web Store</span>
        </button>
        <button
          onClick={() => setViewMode('mobile_app')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            viewMode === 'mobile_app'
              ? 'bg-[#0284C7] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Switch to Mobile App Prototype"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Mobile App</span>
        </button>
        <div className="w-px h-4 bg-slate-200 mx-0.5" />
        <button
          onClick={() => setIsStyleAdvisorOpen(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-sky-700 hover:bg-sky-50 transition-colors cursor-pointer"
          title="Open Style Quiz"
        >
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          <span>Style Match</span>
        </button>
      </div>

      {viewMode === 'desktop' ? (
        <>
          <Header />
          <main className="flex-1">
            <Hero />
            <CategoryGrid />
            <PromoBanners />
            <WeeklyTopSellers />
            <Newsletter />
          </main>
          <Footer />
        </>
      ) : (
        <MobileAppView />
      )}

      {/* Interactive Drawers & Modals */}
      <CartDrawer />
      <WishlistDrawer />
      <QuickViewModal />
      <StyleAdvisorModal />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <MainLayout />
    </ShopProvider>
  );
}
