import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { useAuth } from '../../hooks/auth/authHook';
import { EDITORIAL_PORTRAIT_IMAGE, HERO_IMAGE } from '../../data/products';
import './AuthPage.css';
import {
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Check,
  Sparkles,
  ChevronLeft,
  X,
} from 'lucide-react';

interface AuthPageProps {
  isModal?: boolean;
  onClose?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ isModal = false, onClose }) => {
  const { login, setViewMode } = useShop();
  const { login: hookLogin, register: hookRegister } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (mode === 'signup' && !name.trim()) {
      setErrorMessage('Please provide your name.');
      return;
    }
    if (mode === 'signup' && !agreeTerms) {
      setErrorMessage('Please accept the Terms & Privacy Policy.');
      return;
    }

    setIsLoading(true);

    // Call hook auth API
    if (mode === 'signup') {
      hookRegister({ name, email, password }).catch(console.error);
    } else {
      hookLogin({ email, password }).catch(console.error);
    }

    setTimeout(() => {
      setIsLoading(false);
      login(email, mode === 'signup' ? name : undefined);
      if (onClose) {
        onClose();
      } else {
        setViewMode('desktop');
      }
    }, 600);
  };

  const handleDemoFill = () => {
    setEmail('elena.vance@lifestyle.com');
    setPassword('LuxuryLune2026');
    if (mode === 'signup') {
      setName('Elena Vance');
    }
    setErrorMessage('');
  };

  const handleSocialLogin = (provider: 'Apple' | 'Google') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login(`${provider.toLowerCase()}.user@lunevip.com`, `${provider} Guest`);
      if (onClose) {
        onClose();
      } else {
        setViewMode('desktop');
      }
    }, 600);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes('@')) return;
    setResetSent(true);
  };

  return (
    <div className={`w-full ${isModal ? 'p-0' : 'min-h-screen py-6 sm:py-12 px-4 sm:px-6 lg:px-8'} bg-[#F8FAFC] flex items-center justify-center`}>
      {/* Container with responsive break: Mobile (1-col full), Tab (768px - 1024px padded rounded card), Desktop (1440px wide split-screen) */}
      <div className={`relative w-full max-w-5xl bg-white rounded-3xl ${isModal ? 'shadow-none border-0' : 'shadow-2xl shadow-slate-200/60 border border-slate-200/80'} overflow-hidden`}>
        {/* Top bar with back to store affordance */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          <button
            onClick={() => {
              if (onClose) {
                onClose();
              } else {
                setViewMode('desktop');
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white text-slate-700 text-xs font-semibold backdrop-blur-md shadow-xs border border-slate-200/60 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Store</span>
          </button>
        </div>

        {isModal && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Responsive Grid: Mobile stacked, Tablet stacked/side-by-side, Desktop 12-col split */}
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[640px]">
          {/* Left Column (Desktop & Tablet): Editorial Brand Showcase */}
          <div className="hidden md:flex md:col-span-5 lg:col-span-6 relative bg-slate-900 overflow-hidden flex-col justify-between p-8 lg:p-12 text-white">
            <img
              src={mode === 'signin' ? EDITORIAL_PORTRAIT_IMAGE : HERO_IMAGE}
              alt="Luné Campaign Model"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-luminosity transform hover:scale-102 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/20 pointer-events-none" />

            {/* Top Brand Tag */}
            <div className="relative z-10 pt-8">
              <span className="font-serif-luxury text-3xl sm:text-4xl font-bold tracking-tight text-white block">
                Luné
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-sky-300 font-semibold mt-1 block">
                Accessories For Her
              </span>
            </div>

            {/* Handwritten sticker badge */}
            <div className="relative z-10 self-end">
              <div className="px-4 py-2 bg-white/70 backdrop-blur-md rounded-2xl shadow-md text-slate-900 transform rotate-[-4deg]">
                <span className="font-script text-2xl text-sky-900 font-bold">
                  Lifestyle More You ♡
                </span>
              </div>
            </div>

            {/* Bottom Proof & Editorial Quote */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-500/20 backdrop-blur-md rounded-full text-sky-200 text-[11px] font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>Luné Privé Membership</span>
              </div>
              <h2 className="font-serif-luxury text-2xl lg:text-3xl font-bold leading-tight mb-2">
                &ldquo;Accessories are the exclamation point of a woman&apos;s outfit.&rdquo;
              </h2>
              <p className="text-xs text-slate-300 font-normal">
                Join our private circle for early drop access, curated style capsules, and complimentary shipping.
              </p>
            </div>
          </div>

          {/* Right Column: Authentication Form (Responsive for Mobile, Tab, Desktop) */}
          <div className="col-span-1 md:col-span-7 lg:col-span-6 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
            {/* Header Mobile Brand for Small Screens (< 768px) */}
            <div className="md:hidden text-center mb-6 pt-6">
              <span className="font-serif-luxury text-3xl font-bold text-slate-900 block leading-none">
                Luné
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-slate-400 font-semibold mt-1 block">
                Accessories For Her
              </span>
            </div>

            {/* Sign In vs Create Account Toggle Tabs */}
            <div className="flex items-center justify-center p-1 bg-slate-100 rounded-2xl mb-8 max-w-sm mx-auto w-full">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMessage('');
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  mode === 'signin'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMessage('');
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Title & Subtitle */}
            <div className="mb-6">
              <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {mode === 'signin' ? 'Welcome Back' : 'Create Your Account'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {mode === 'signin'
                  ? 'Access your saved wishlist, order history, and VIP style profile.'
                  : 'Join today and receive 15% off your first order with code LUNE15.'}
              </p>
            </div>

            {/* Error Message if any */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                <span className="font-bold">Error:</span> {errorMessage}
              </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative flex items-center">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="e.g. Elena Vance"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => {
                        setForgotEmail(email);
                        setForgotPasswordOpen(true);
                      }}
                      className="text-[11px] font-semibold text-sky-600 hover:text-sky-800 transition-colors cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-600 p-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Checkboxes: Remember me or Terms */}
              <div className="flex items-center justify-between pt-1 text-xs">
                {mode === 'signin' ? (
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    <span>Remember this device</span>
                  </label>
                ) : (
                  <label className="flex items-start gap-2 cursor-pointer text-slate-600">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    <span className="text-[11px] leading-tight">
                      I agree to Luné Terms of Service and Privacy Policy.
                    </span>
                  </label>
                )}
              </div>

              {/* Primary Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 bg-slate-900 hover:bg-[#0284C7] text-white text-xs sm:text-sm font-semibold rounded-full shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:scale-[0.99]"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>{mode === 'signin' ? 'Sign In to Luné' : 'Create Luné Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Quick Demo Autofill Helper for Testing */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={handleDemoFill}
                  className="text-[11px] text-sky-700 hover:text-sky-900 font-semibold underline underline-offset-2 cursor-pointer"
                >
                  ⚡ Auto-fill Demo VIP Member
                </button>
              </div>

              {/* Divider */}
              <div className="relative my-4 flex items-center justify-center">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
                  Or continue with
                </span>
              </div>

              {/* Social Login Buttons (Apple & Google) */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Apple')}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.61-.75 1.04-1.8 0.92-2.84-.9.04-2 .6-2.63 1.34-.56.65-.99 1.71-.85 2.73.99.08 2.01-.52 2.56-1.23z" />
                  </svg>
                  <span>Apple</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Google')}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Google</span>
                </button>
              </div>

              {/* Guest Checkout Option */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    if (onClose) {
                      onClose();
                    } else {
                      setViewMode('desktop');
                    }
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Continue browsing as guest
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                setForgotPasswordOpen(false);
                setResetSent(false);
              }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            {resetSent ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-serif-luxury text-2xl font-bold text-slate-900">
                  Check Your Inbox
                </h4>
                <p className="text-xs text-slate-600 mt-2">
                  We have sent instructions to reset your password to{' '}
                  <strong className="text-slate-900">{forgotEmail}</strong>.
                </p>
                <button
                  onClick={() => {
                    setForgotPasswordOpen(false);
                    setResetSent(false);
                  }}
                  className="mt-6 px-6 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-full"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <div>
                <h4 className="font-serif-luxury text-2xl font-bold text-slate-900">
                  Reset Password
                </h4>
                <p className="text-xs text-slate-500 mt-1 mb-5">
                  Enter your registered email address and we will send you a secure link to create a new password.
                </p>
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@domain.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-slate-900 hover:bg-sky-600 text-white text-xs font-semibold rounded-full transition-colors"
                  >
                    Send Reset Link
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
