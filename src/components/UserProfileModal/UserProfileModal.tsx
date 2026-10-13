import React from 'react';
import { useShop } from '../../context/ShopContext';
import './UserProfileModal.css';
import {
  X,
  User,
  Package,
  Heart,
  CreditCard,
  MapPin,
  LogOut,
  Sparkles,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC = () => {
  const {
    user,
    logout,
    isAuthModalOpen,
    setIsAuthModalOpen,
    setIsCartOpen,
    setIsWishlistOpen,
    wishlist,
    cartCount,
    setViewMode,
    customerAddresses,
    openAddressBook,
    openOrders,
  } = useShop();

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsAuthModalOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-sky-600" />
              <h3 className="font-serif-luxury text-xl font-bold text-slate-900">
                Member Profile
              </h3>
            </div>
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {user ? (
              <div className="space-y-6">
                {/* Profile Card */}
                <div className="bg-gradient-to-br from-slate-900 to-sky-950 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/20 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-xl font-bold font-serif-luxury">
                      {user.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="text-base font-bold leading-tight">{user.name}</h4>
                      <p className="text-xs text-sky-200 mt-0.5">{user.email}</p>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-sky-500/30 border border-sky-400/40 rounded-full text-[10px] font-bold text-sky-100 mt-2">
                        <Sparkles className="w-3 h-3 text-sky-300" />
                        <span>{user.tier}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-sky-200">
                    <span>Member since {user.joinedDate}</span>
                    <span className="font-semibold text-white">1,450 Luné Points</span>
                  </div>
                </div>

                {/* Quick stats buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setIsAuthModalOpen(false);
                      setIsWishlistOpen(true);
                    }}
                    className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-left hover:border-sky-300 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Heart className="w-4 h-4 text-rose-500" />
                      <span className="text-xs font-bold text-slate-800">{wishlist.length}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-900 block">Wishlist</span>
                    <span className="text-[10px] text-slate-500">Saved items</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsAuthModalOpen(false);
                      setIsCartOpen(true);
                    }}
                    className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-left hover:border-sky-300 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <ShoppingBag className="w-4 h-4 text-sky-600" />
                      <span className="text-xs font-bold text-slate-800">{cartCount}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-900 block">Shopping Bag</span>
                    <span className="text-[10px] text-slate-500">Active cart</span>
                  </button>
                </div>

                {/* Account Navigation List */}
                <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100 shadow-xs">
                  <div
                    onClick={() => {
                      setIsAuthModalOpen(false);
                      openOrders();
                    }}
                    className="p-3.5 flex items-center justify-between text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Package className="w-4 h-4 text-sky-600" />
                      <span>Order History &amp; Tracking</span>
                    </div>
                    <span className="text-[10px] text-sky-600 font-bold">2 Active</span>
                  </div>
                  <div
                    onClick={() => {
                      setIsAuthModalOpen(false);
                      openAddressBook();
                    }}
                    className="p-3.5 flex items-center justify-between text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-sky-600" />
                      <span>Saved Addresses</span>
                    </div>
                    <span className="text-[10px] text-sky-700 font-bold">
                      {customerAddresses.length} Saved
                    </span>
                  </div>
                  <div className="p-3.5 flex items-center justify-between text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-4 h-4 text-sky-600" />
                      <span>Payment Preferences</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Apple Pay / Visa</span>
                  </div>
                </div>

                {/* Logout Button */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      logout();
                      setIsAuthModalOpen(false);
                    }}
                    className="w-full py-3 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-2xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="w-16 h-16 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8" />
                </div>
                <h4 className="font-serif-luxury text-2xl font-bold text-slate-900">
                  Welcome to Luné
                </h4>
                <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto">
                  Sign in to access your saved wishlist, personalized style recommendations, and VIP benefits.
                </p>

                <div className="mt-8 space-y-3">
                  <button
                    onClick={() => {
                      setIsAuthModalOpen(false);
                      setViewMode('auth_page');
                    }}
                    className="w-full py-3.5 bg-slate-900 hover:bg-[#0284C7] text-white text-xs font-semibold rounded-full shadow-lg transition-colors cursor-pointer"
                  >
                    Sign In / Create Account
                  </button>

                  <button
                    onClick={() => {
                      setIsAuthModalOpen(false);
                    }}
                    className="w-full py-2.5 text-slate-500 hover:text-slate-800 text-xs font-semibold"
                  >
                    Continue as Guest
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
