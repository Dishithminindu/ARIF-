import React from 'react';
import { SearchX, RotateCcw, PackagePlus, FlaskConical } from 'lucide-react';
import { CategoryType } from '../types';

interface EmptyStateProps {
  category: CategoryType;
  query: string;
  onReset: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  category,
  query,
  onReset
}) => {
  if (category !== 'All' && !query) {
    return (
      <div className="py-16 px-4 text-center rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 shadow-2xs max-w-md mx-auto my-6 space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center">
          <PackagePlus className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-50">
            No {category} Records Found
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1 max-w-xs mx-auto">
            No items are currently categorized under {category}. Try switching to "All Items" or reset your search filters.
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-2xs transition-colors"
        >
          <FlaskConical className="w-3.5 h-3.5" />
          <span>View All Inventory</span>
        </button>
      </div>
    );
  }

  return (
    <div className="py-16 px-4 text-center rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 shadow-2xs max-w-md mx-auto my-6 space-y-4">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 flex items-center justify-center">
        <SearchX className="w-7 h-7" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-50">
          No Matching Inventory Found
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1 max-w-xs mx-auto">
          {query
            ? `No records matched your search "${query}". Try searching by chemical formula, item number, or block location.`
            : 'No items match the active combination of block, grade, and status filters.'}
        </p>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-zinc-200 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 transition-colors shadow-2xs"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Reset Search & Filters</span>
      </button>
    </div>
  );
};
