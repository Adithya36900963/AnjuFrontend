import React from 'react';
import { CATEGORIES } from '../data/products';
import { useShop } from '../context/ShopContext';
import { ArrowRight } from 'lucide-react';

export const CategoryGrid: React.FC = () => {
  const { activeCategory, setActiveCategory } = useShop();

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(activeCategory === categoryId ? 'all' : categoryId);
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header with View All action */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Shop By Category
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Curated essentials to accentuate every contour and outfit
            </p>
          </div>

          <button
            onClick={() => {
              setActiveCategory('all');
              document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-700 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 8 Circular Category Icons */}
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-4 sm:gap-6">
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="group flex flex-col items-center text-center focus:outline-none"
              >
                {/* Circular image badge with subtle border */}
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 transition-all duration-300 ${
                    isActive
                      ? 'ring-2 ring-sky-500 ring-offset-2 scale-105 shadow-md shadow-sky-500/10'
                      : 'hover:scale-105 hover:shadow-md'
                  }`}
                >
                  <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 border border-slate-200/60 relative">
                    <img
                      src={category.image}
                      alt={category.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Category Name */}
                <span
                  className={`text-xs mt-2.5 transition-colors line-clamp-1 ${
                    isActive
                      ? 'font-bold text-sky-600'
                      : 'font-medium text-slate-700 group-hover:text-slate-900'
                  }`}
                >
                  {category.name}
                </span>

                <span className="text-[10px] text-slate-400 mt-0.5">
                  {category.itemCount} items
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
