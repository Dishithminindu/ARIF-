import React, { useMemo } from 'react';
import { 
  FlaskConical, 
  Boxes, 
  Award, 
  Layers, 
  CheckCircle2
} from 'lucide-react';
import { InventoryItem } from '../types';

interface StatsDashboardProps {
  items: InventoryItem[];
  currentBlock: string;
  onSelectBlock: (block: string) => void;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({
  items,
  currentBlock,
  onSelectBlock
}) => {
  const totalCount = items.length;
  
  // Calculate distinct storage locations / blocks dynamically
  const blocks = useMemo(() => {
    const set = new Set<string>();
    items.forEach(i => {
      if (i.block) set.add(i.block);
    });
    return Array.from(set).sort((a, b) => 
      a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
    );
  }, [items]);
  
  const blockCounts = useMemo(() => {
    return blocks.reduce<Record<string, number>>((acc, b) => {
      acc[b] = items.filter(i => i.block === b || i.location?.includes(b)).length;
      return acc;
    }, {});
  }, [blocks, items]);

  const arGradeCount = items.filter(i => 
    (i.name && (i.name.includes('AR') || i.name.includes('GR') || i.name.includes('Extra Pure'))) ||
    (i.grade && (i.grade.includes('AR') || i.grade.includes('GR') || i.grade.includes('Extra Pure')))
  ).length;

  const withQuantityCount = items.filter(i => Boolean(i.quantity && i.quantity.trim())).length;

  return (
    <div className="mb-6 space-y-3.5">
      {/* Top metrics row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3.5">
        
        {/* Total Items */}
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
              Total Database
            </span>
            <div className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/70 text-teal-600 dark:text-teal-400">
              <FlaskConical className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight">
              {totalCount}
            </span>
            <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">Items</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-zinc-400">100% verified inventory catalog</p>
        </div>

        {/* Storage Blocks & Locations */}
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
              Storage Locations
            </span>
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400">
              <Boxes className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight">
              {blocks.length}
            </span>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Blocks & Cupboards</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-zinc-400">Blocks 1–8 & Cupboards (40, 54, 55, 56, 67)</p>
        </div>

        {/* AR/GR High Purity */}
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
              AR / Pure Grade
            </span>
            <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400">
              <Award className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight">
              {arGradeCount}
            </span>
            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">High Purity</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-zinc-400">Analytical & GR standards</p>
        </div>

        {/* Quantified Items */}
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
              Specified Stock
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight">
              {withQuantityCount}
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Bottles</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-zinc-400">With weight / volume logged</p>
        </div>
      </div>

      {/* Quick block quick-jump filters */}
      <div className="p-2.5 rounded-xl bg-slate-100/70 dark:bg-zinc-900/60 border border-slate-200/70 dark:border-zinc-800/80 flex items-center gap-1.5 overflow-x-auto text-xs">
        <span className="shrink-0 font-semibold text-slate-500 dark:text-zinc-400 flex items-center gap-1 pl-1 pr-1 text-[11px]">
          <Layers className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span>Storage Block:</span>
        </span>

        <button
          type="button"
          onClick={() => onSelectBlock('')}
          className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
            !currentBlock
              ? 'bg-teal-600 text-white shadow-2xs'
              : 'bg-white dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200/80 dark:border-zinc-700/80 hover:border-teal-400 dark:hover:border-teal-600'
          }`}
        >
          All ({totalCount})
        </button>

        {blocks.map(b => {
          const isSelected = currentBlock === b;
          const count = blockCounts[b] || 0;
          return (
            <button
              key={b}
              type="button"
              onClick={() => onSelectBlock(isSelected ? '' : b)}
              className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'bg-white dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200/80 dark:border-zinc-700/80 hover:border-teal-400 dark:hover:border-teal-600'
              }`}
            >
              <span>{b}</span>
              <span className={`text-[10px] font-mono px-1 rounded ${
                isSelected ? 'bg-teal-700 text-white' : 'bg-slate-100 dark:bg-zinc-700 text-slate-500 dark:text-zinc-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
