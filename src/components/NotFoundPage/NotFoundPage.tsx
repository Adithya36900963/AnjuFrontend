import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, ShoppingBag } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-[#F8FAFC]">
      <div className="max-w-md w-full text-center bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-lg">
        <span className="text-xs uppercase tracking-[0.25em] text-sky-600 font-semibold mb-2 block">
          Error 404
        </span>
        <h1 className="font-serif-luxury text-4xl sm:text-5xl text-slate-900 mb-3">
          Page Not Found
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed mb-8">
          The curated destination you requested does not exist or has been shifted in our seasonal catalog.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-sky-600 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Atelier</span>
          </Link>
          <Link
            to="/products"
            className="w-full sm:w-auto px-6 py-3 bg-sky-50 text-sky-700 rounded-xl text-sm font-medium hover:bg-sky-100 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Browse Products</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
