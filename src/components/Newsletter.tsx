import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setSubscribed(true);
  };

  return (
    <section className="py-14 bg-gradient-to-b from-white to-[#F0F9FF] border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">
        <div className="inline-flex p-3 bg-sky-100/70 text-sky-700 rounded-2xl mb-4">
          <Mail className="w-6 h-6" />
        </div>

        <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-2">
          Join Our Community
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-8 font-normal">
          Get exclusive offers, style tips and early access to new arrivals.
        </p>

        {subscribed ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 max-w-md mx-auto flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mb-2" />
            <h4 className="text-sm font-bold text-emerald-900">Welcome to the Luné Circle!</h4>
            <p className="text-xs text-emerald-700 mt-1">
              Your 15% welcome code is <strong className="underline tracking-wider">LUNE15</strong>.
              We just sent your invite to {email}.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
          >
            <div className="relative w-full">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 shadow-xs"
              />
              {error && (
                <span className="absolute -bottom-5 left-4 text-[10px] text-rose-500 font-medium">
                  {error}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3.5 bg-slate-900 hover:bg-[#0284C7] text-white text-xs font-semibold rounded-full flex items-center justify-center gap-2 transition-colors shadow-sm shrink-0 cursor-pointer"
            >
              <span>Subscribe</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
