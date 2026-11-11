import React, { useState } from 'react';
import { 
  FlaskConical, 
  MapPin, 
  Scale, 
  Copy, 
  Check, 
  ExternalLink,
  Tag,
  Calendar,
  Sparkles
} from 'lucide-react';
import { InventoryItem } from '../types';
import { highlightText, getBlockBadge } from '../utils/chemicalUtils';

interface ItemCardProps {
  item: InventoryItem;
  searchQuery: string;
  onSelectItem: (item: InventoryItem) => void;
  onReserveItem?: (item: InventoryItem) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  searchQuery,
  onSelectItem,
  onReserveItem
}) => {
  const [copiedFormula, setCopiedFormula] = useState(false);
  const blockBadge = getBlockBadge(item.block);

  const handleCopyFormula = (e: React.MouseEvent) => {
    e.stopPropagation();
    const toCopy = item.formula || item.formulaPlain || item.name;
    navigator.clipboard.writeText(toCopy);
    setCopiedFormula(true);
    setTimeout(() => setCopiedFormula(false), 1800);
  };

  const handleReserveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onReserveItem) {
      onReserveItem(item);
    } else {
      onSelectItem(item);
    }
  };

  return (
    <div
      onClick={() => onSelectItem(item)}
      className="group relative flex flex-col justify-between p-4 sm:p-4.5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 hover:border-teal-400 dark:hover:border-teal-500 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      <div>
        {/* Card Header: Item No & Location Badge */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-bold font-mono">
              #{item.itemNo}
            </span>
            <span className="text-[10px] font-bold tracking-wider uppercase text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-md border border-teal-200/60 dark:border-teal-800/60">
              {item.category}
            </span>
          </div>

          {/* Block Location */}
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${blockBadge.bg} ${blockBadge.text} ${blockBadge.border}`}>
            <MapPin className="w-3 h-3" />
            <span>{item.block || item.location}</span>
          </span>
        </div>

        {/* Chemical / Equipment Name */}
        <h3 className="text-base font-bold text-slate-900 dark:text-zinc-50 leading-snug group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-2">
          {highlightText(item.name, searchQuery)}
        </h3>

        {/* Chemical Formula */}
        <div className="mt-2.5 flex items-center justify-between bg-slate-50 dark:bg-zinc-950/60 px-3 py-2 rounded-xl border border-slate-200/70 dark:border-zinc-800/80">
          <div className="flex items-center gap-2 overflow-hidden">
            <FlaskConical className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
            <span className="font-mono text-sm font-semibold text-teal-700 dark:text-teal-300 truncate">
              {item.formula ? highlightText(item.formula, searchQuery) : <span className="text-slate-400 dark:text-zinc-500 italic font-sans text-xs font-normal">Lab Equipment / Apparatus</span>}
            </span>
          </div>

          {item.formula && (
            <button
              type="button"
              onClick={handleCopyFormula}
              className="p-1 rounded-md text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors shrink-0"
              title="Copy Formula"
            >
              {copiedFormula ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>

        {/* Grade Tag (if present) */}
        {item.grade && (
          <div className="mt-2.5 flex items-center gap-1 text-xs">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-md border border-purple-200/60 dark:border-purple-800/60">
              <Tag className="w-2.5 h-2.5" />
              <span>{item.grade}</span>
            </span>
          </div>
        )}

        {/* Notes (if present) */}
        {item.notes && (
          <p className="mt-2.5 text-xs text-slate-500 dark:text-zinc-400 line-clamp-2 italic">
            {item.notes}
          </p>
        )}
      </div>

      {/* Card Footer: Quantity & Action */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-zinc-300">
          <Scale className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
          {item.quantity ? (
            <span>
              <strong className="text-slate-900 dark:text-zinc-50 font-bold">{item.quantity}</strong>{' '}
              {item.unit || 'units'}
            </span>
          ) : (
            <span className="text-slate-400 dark:text-zinc-500 font-normal italic">Ready for use</span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleReserveClick}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900/60 border border-teal-200/60 dark:border-teal-800/60 transition-colors cursor-pointer"
            title="Book this item for laboratory work"
          >
            <Calendar className="w-3 h-3 text-teal-600 dark:text-teal-400" />
            <span>Reserve</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectItem(item);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            title="View Details"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
