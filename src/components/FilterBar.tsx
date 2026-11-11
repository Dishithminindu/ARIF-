import React from 'react';
import { 
  SlidersHorizontal, 
  ArrowUpDown, 
  Filter, 
  X, 
  Check,
  Building2,
  Tag
} from 'lucide-react';
import { FilterState, SortField, SortOrder } from '../types';

interface FilterBarProps {
  filters: FilterState;
  onUpdateFilters: (updates: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalFiltered: number;
  totalAll: number;
  availableBlocks?: string[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onUpdateFilters,
  onResetFilters,
  totalFiltered,
  totalAll,
  availableBlocks
}) => {
  const blocks = availableBlocks && availableBlocks.length > 0 
    ? availableBlocks 
    : ['Block 1', 'Block 2', 'Block 3', 'Block 4', 'Block 5', 'Block 6', 'Block 7', 'Block 8', 'Cupboard 1 (54)', 'Cupboard 1 (56)'];

  const grades = [
    { value: '', label: 'All Grades / Types' },
    { value: 'AR', label: 'AR (Analytical Reagent)' },
    { value: 'Extra Pure', label: 'Extra Pure' },
    { value: 'GR', label: 'GR (Guaranteed Reagent)' },
    { value: 'Pure', label: 'Pure / Standard' },
    { value: 'Practical', label: 'Practical / Indicator' },
    { value: 'Polymer', label: 'Polymer Grade' },
    { value: 'Metal', label: 'Elemental / Metal' },
    { value: 'Borosilicate', label: 'Borosilicate Glass' },
    { value: 'Class A', label: 'Class A Volumetric' },
    { value: 'Natural Oil', label: 'Natural Oils / Extracts' },
  ];

  const sortOptions: { field: SortField; order: SortOrder; label: string }[] = [
    { field: 'itemNo', order: 'asc', label: `Item Number (1 → ${totalAll})` },
    { field: 'itemNo', order: 'desc', label: `Item Number (${totalAll} → 1)` },
    { field: 'name', order: 'asc', label: 'Name (A → Z)' },
    { field: 'name', order: 'desc', label: 'Name (Z → A)' },
    { field: 'formula', order: 'asc', label: 'Formula (A → Z)' },
    { field: 'location', order: 'asc', label: 'Location / Block' },
  ];

  const hasActiveFilters = 
    Boolean(filters.query) || 
    filters.category !== 'All' || 
    Boolean(filters.block) || 
    Boolean(filters.grade) || 
    filters.hasQuantityOnly;

  return (
    <div className="mb-5 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 shadow-2xs space-y-3">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        
        {/* Left Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Block Selector */}
          <div className="flex items-center gap-1.5">
            <label className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Block:</label>
            <select
              value={filters.block}
              onChange={(e) => onUpdateFilters({ block: e.target.value, page: 1 })}
              className="text-xs font-semibold py-1.5 px-2.5 rounded-lg bg-slate-50 dark:bg-zinc-800 border border-slate-200/80 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 focus:outline-hidden"
            >
              <option value="">All Storage Blocks</option>
              {blocks.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Grade Selector */}
          <div className="flex items-center gap-1.5">
            <label className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Grade:</label>
            <select
              value={filters.grade}
              onChange={(e) => onUpdateFilters({ grade: e.target.value, page: 1 })}
              className="text-xs font-semibold py-1.5 px-2.5 rounded-lg bg-slate-50 dark:bg-zinc-800 border border-slate-200/80 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 focus:outline-hidden"
            >
              {grades.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>

          {/* Has Quantity Checkbox Toggle */}
          <button
            type="button"
            onClick={() => onUpdateFilters({ hasQuantityOnly: !filters.hasQuantityOnly, page: 1 })}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              filters.hasQuantityOnly
                ? 'bg-teal-50 text-teal-700 border-teal-300/80 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800'
                : 'bg-slate-50 text-slate-600 border-slate-200/80 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-750'
            }`}
          >
            <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
              filters.hasQuantityOnly 
                ? 'bg-teal-600 border-teal-600 text-white' 
                : 'border-slate-300 dark:border-zinc-600'
            }`}>
              {filters.hasQuantityOnly && <Check className="w-2.5 h-2.5 stroke-[3]" />}
            </div>
            <span>Specified Stock Only</span>
          </button>
        </div>

        {/* Right Sorting & Page Size */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Sort By */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
            <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Sort:</span>
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-') as [SortField, SortOrder];
                onUpdateFilters({ sortBy, sortOrder });
              }}
              className="text-xs font-semibold py-1.5 px-2.5 rounded-lg bg-slate-50 dark:bg-zinc-800 border border-slate-200/80 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 focus:outline-hidden"
            >
              {sortOptions.map((opt) => (
                <option key={`${opt.field}-${opt.order}`} value={`${opt.field}-${opt.order}`}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Per Page */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Show:</span>
            <select
              value={filters.itemsPerPage}
              onChange={(e) => onUpdateFilters({ itemsPerPage: Number(e.target.value), page: 1 })}
              className="text-xs font-semibold py-1.5 px-2 rounded-lg bg-slate-50 dark:bg-zinc-800 border border-slate-200/80 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 focus:outline-hidden"
            >
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
              <option value={112}>All (112)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips & Results Count Bar */}
      <div className="pt-2.5 border-t border-slate-100 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-500 dark:text-zinc-400">
            Showing <strong className="text-slate-900 dark:text-zinc-50 font-bold">{totalFiltered}</strong> of{' '}
            <strong className="text-slate-900 dark:text-zinc-50 font-bold">{totalAll}</strong> items
          </span>

          {filters.query && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 dark:bg-teal-950/70 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800 font-medium">
              Query: "{filters.query}"
              <button
                type="button"
                onClick={() => onUpdateFilters({ query: '' })}
                className="hover:text-teal-900 dark:hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.category !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 dark:bg-teal-950/70 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800 font-medium">
              {filters.category}
              <button
                type="button"
                onClick={() => onUpdateFilters({ category: 'All' })}
                className="hover:text-teal-900 dark:hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.block && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800 font-medium">
              {filters.block}
              <button
                type="button"
                onClick={() => onUpdateFilters({ block: '' })}
                className="hover:text-blue-900 dark:hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.grade && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800 font-medium">
              Grade: {filters.grade}
              <button
                type="button"
                onClick={() => onUpdateFilters({ grade: '' })}
                className="hover:text-purple-900 dark:hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.hasQuantityOnly && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800 font-medium">
              Specified Stock
              <button
                type="button"
                onClick={() => onUpdateFilters({ hasQuantityOnly: false })}
                className="hover:text-emerald-900 dark:hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
};
