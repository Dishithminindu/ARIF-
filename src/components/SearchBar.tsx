import React, { useRef, useEffect } from 'react';
import { Search, X, FlaskConical, TestTubes, Wrench, Package, HelpCircle } from 'lucide-react';
import { CategoryType } from '../types';

interface SearchBarProps {
  query: string;
  onChangeQuery: (q: string) => void;
  category: CategoryType;
  onChangeCategory: (c: CategoryType) => void;
  countsByCategory: Record<CategoryType, number>;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onChangeQuery,
  category,
  onChangeCategory,
  countsByCategory
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Pressing '/' anywhere focuses the search bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const categories: { id: CategoryType; label: string; icon: React.ReactNode }[] = [
    { id: 'All', label: 'All Items', icon: <Package className="w-4 h-4" /> },
    { id: 'Chemical', label: 'Chemicals', icon: <FlaskConical className="w-4 h-4" /> },
    { id: 'Glassware', label: 'Glassware', icon: <TestTubes className="w-4 h-4" /> },
    { id: 'Equipment', label: 'Equipment', icon: <Wrench className="w-4 h-4" /> },
    { id: 'Other', label: 'Other', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  const quickSearches = [
    'Sodium',
    'Zinc',
    'Copper',
    'Chloride',
    'AR Grade',
    'Oxide',
    'Block 1',
    'Block 6'
  ];

  return (
    <div className="space-y-3.5 mb-2">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const isSelected = category === cat.id;
          const count = countsByCategory[cat.id] ?? 0;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onChangeCategory(cat.id)}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-2xs active:scale-98 ${
                isSelected
                  ? 'bg-teal-600 dark:bg-teal-500 text-white shadow-teal-500/20 ring-2 ring-teal-600/30'
                  : 'bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-850 hover:border-slate-300 dark:hover:border-zinc-700'
              }`}
            >
              <span className={isSelected ? 'text-white' : 'text-teal-600 dark:text-teal-400'}>
                {cat.icon}
              </span>
              <span>{cat.label}</span>
              <span
                className={`text-[11px] font-mono px-2 py-0.5 rounded-md font-bold ${
                  isSelected
                    ? 'bg-teal-700 dark:bg-teal-600 text-white'
                    : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Thick Search Input Container */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500 transition-colors group-focus-within:text-teal-600 dark:group-focus-within:text-teal-400">
          <Search className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600 dark:text-teal-400" />
        </div>
        
        <input
          id="main-chemical-search-input"
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => onChangeQuery(e.target.value)}
          placeholder="Search by chemical name, formula (e.g. NaCl, AgNO3), Item #, location, or notes..."
          className="w-full pl-12 sm:pl-14 pr-24 sm:pr-28 py-4 sm:py-5 rounded-2xl text-base sm:text-lg bg-[#d0eee5] dark:bg-teal-950/40 border-2 border-teal-200/80 dark:border-teal-800/80 text-slate-900 dark:text-teal-50 placeholder-teal-800/60 dark:placeholder-teal-300/60 focus:outline-none focus:ring-4 focus:ring-teal-500/25 focus:border-teal-600 dark:focus:border-teal-400 shadow-sm dark:shadow-none hover:border-teal-300 dark:hover:border-teal-700 transition-all font-medium"
        />

        <div className="absolute inset-y-0 right-0 pr-4 sm:pr-5 flex items-center gap-2">
          {query ? (
            <button
              type="button"
              onClick={() => onChangeQuery('')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Clear search"
              aria-label="Clear search query"
            >
              <X className="w-5 h-5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center px-2.5 py-1 text-xs font-mono font-semibold text-slate-400 dark:text-zinc-500 bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg shadow-2xs">
              /
            </kbd>
          )}
        </div>
      </div>

      {/* Quick Search Suggestions Chips */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-zinc-400 px-1">
        <span className="font-semibold text-slate-400 dark:text-zinc-500 text-[11px] uppercase tracking-wider">Popular:</span>
        {quickSearches.map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => onChangeQuery(term)}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-teal-300 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-800 transition-colors text-xs font-medium shadow-2xs cursor-pointer"
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
};
