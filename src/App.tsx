import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
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
import { FlutterExportModal } from './components/FlutterExportModal';
import { AuthPage } from './components/AuthPage';
import { UserProfileModal } from './components/UserProfileModal';
import { ProductsPage } from './components/ProductsPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { MobileAppView } from './components/MobileAppView';
import { OrdersManagementPage } from './components/OrdersManagementPage';
import { CheckoutModal } from './components/CheckoutModal';
import { AddressBookPage } from './components/AddressBookPage';
import { NotFoundPage } from './components/NotFoundPage';
import { ScrollToTop } from './components/ScrollToTop';
import './App.css';
import {
  Sparkles,
  Check,
  Code2,
} from 'lucide-react';

// Responsive Home Page: adapts between mobile app prototype and luxury storefront
const HomePage: React.FC = () => {
  const { isAutoResponsive, isMobileScreen } = useShop();

  if (isAutoResponsive && isMobileScreen) {
    return <MobileAppView />;
  }

  return (
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
  );
};

// Products Catalog Layout
const ProductsLayout: React.FC = () => (
  <>
    <Header />
    <main className="flex-1">
      <ProductsPage />
    </main>
    <Footer />
  </>
);

// Dedicated Product Detail Layout
const ProductDetailLayout: React.FC = () => (
  <>
    <Header />
    <main className="flex-1">
      <ProductDetailPage />
    </main>
    <Footer />
  </>
);

// 404 Fallback Layout
const NotFoundLayout: React.FC = () => (
  <>
    <Header />
    <main className="flex-1">
      <NotFoundPage />
    </main>
    <Footer />
  </>
);

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const {
    setIsStyleAdvisorOpen,
    isFlutterModalOpen,
    setIsFlutterModalOpen,
    toast,
  } = useShop();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800 app-container">
      {/* Scroll to Top on every route transition */}
      <ScrollToTop />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-5 h-5 bg-sky-500 rounded-full flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 text-white" />
          </div>
          <span>{toast}</span>
        </div>
      )}

      {/* Discrete Quick Actions (Style Quiz & Flutter Code) */}
      <div className="fixed bottom-5 left-5 z-40 hidden sm:flex items-center gap-2 p-1.5 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-slate-200/80 text-xs">
        <button
          onClick={() => setIsStyleAdvisorOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-slate-700 hover:text-sky-600 hover:bg-sky-50 font-medium transition-colors cursor-pointer"
          title="Open AI Style Quiz"
        >
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          <span>Style Match</span>
        </button>

        <div className="w-px h-4 bg-slate-200" />

        <button
          onClick={() => setIsFlutterModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-slate-700 hover:text-sky-600 hover:bg-sky-50 font-medium transition-colors cursor-pointer"
          title="Export Flutter Mobile App Code"
        >
          <Code2 className="w-3.5 h-3.5 text-sky-600" />
          <span>Flutter Code</span>
        </button>
      </div>

      {/* Route Definitions */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsLayout />} />
        <Route path="/products/:id" element={<ProductDetailLayout />} />
        <Route path="/product/:id" element={<ProductDetailLayout />} />
        <Route path="/orders" element={<OrdersManagementPage />} />
        <Route path="/orders/:id" element={<OrdersManagementPage />} />
        <Route path="/addresses" element={<AddressBookPage />} />
        <Route path="/mobile" element={<MobileAppView />} />
        <Route path="/auth" element={<AuthPage onClose={() => navigate('/')} />} />
        <Route path="/login" element={<AuthPage onClose={() => navigate('/')} />} />
        <Route path="*" element={<NotFoundLayout />} />
      </Routes>

      {/* Interactive Global Drawers & Modals */}
      <CartDrawer />
      <WishlistDrawer />
      <QuickViewModal />
      <StyleAdvisorModal />
      <UserProfileModal />
      <CheckoutModal />
      <FlutterExportModal
        isOpen={isFlutterModalOpen}
        onClose={() => setIsFlutterModalOpen(false)}
      />
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
