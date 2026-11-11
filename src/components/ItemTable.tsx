import React from 'react';
import { 
  FlaskConical, 
  MapPin, 
  Scale, 
  ExternalLink, 
  ArrowUpDown,
  Tag,
  Calendar
} from 'lucide-react';
import { InventoryItem, SortField, SortOrder } from '../types';
import { highlightText, getBlockBadge } from '../utils/chemicalUtils';

interface ItemTableProps {
  items: InventoryItem[];
  searchQuery: string;
  sortBy: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField) => void;
  onSelectItem: (item: InventoryItem) => void;
  onReserveItem?: (item: InventoryItem) => void;
}

export const ItemTable: React.FC<ItemTableProps> = ({
  items,
  searchQuery,
  sortBy,
  sortOrder,
  onSortChange,
  onSelectItem,
  onReserveItem
}) => {
  return (
    <div className="overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-50 dark:bg-zinc-950/70 border-b border-slate-200/80 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th
                onClick={() => onSortChange('itemNo')}
                className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors w-16"
              >
                <div className="flex items-center gap-1">
                  <span>#</span>
                  {sortBy === 'itemNo' && (
                    <span className="text-teal-600 dark:text-teal-400 font-bold">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>

              <th
                onClick={() => onSortChange('name')}
                className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Chemical / Item Name</span>
                  {sortBy === 'name' && (
                    <span className="text-teal-600 dark:text-teal-400 font-bold">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>

              <th
                onClick={() => onSortChange('formula')}
                className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Formula</span>
                  {sortBy === 'formula' && (
                    <span className="text-teal-600 dark:text-teal-400 font-bold">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>

              <th
                onClick={() => onSortChange('location')}
                className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Location</span>
                  {sortBy === 'location' && (
                    <span className="text-teal-600 dark:text-teal-400 font-bold">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>

              <th className="py-3.5 px-4">Quantity</th>
              <th className="py-3.5 px-4">Grade / Purity</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/70 text-slate-700 dark:text-zinc-200">
            {items.map((item) => {
              const blockBadge = getBlockBadge(item.block);

              return (
                <tr
                  key={item.id}
                  onClick={() => onSelectItem(item)}
                  className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/40 cursor-pointer transition-colors"
                >
                  {/* Item No */}
                  <td className="py-3 px-4 font-mono font-bold text-slate-500 dark:text-zinc-400">
                    {item.itemNo}
                  </td>

                  {/* Name */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 dark:text-zinc-50">
                      {highlightText(item.name, searchQuery)}
                    </div>
                    {item.notes && (
                      <div className="text-[11px] text-slate-400 dark:text-zinc-500 truncate max-w-xs sm:max-w-md italic font-normal">
                        {item.notes}
                      </div>
                    )}
                  </td>

                  {/* Formula */}
                  <td className="py-3 px-4 font-mono text-teal-700 dark:text-teal-300 font-semibold">
                    {item.formula ? highlightText(item.formula, searchQuery) : <span className="text-slate-400 dark:text-zinc-600 font-sans italic text-xs font-normal">—</span>}
                  </td>

                  {/* Location */}
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${blockBadge.bg} ${blockBadge.text} ${blockBadge.border}`}>
                      <MapPin className="w-3 h-3" />
                      <span>{item.block || item.location}</span>
                    </span>
                  </td>

                  {/* Quantity */}
                  <td className="py-3 px-4 font-medium">
                    {item.quantity ? (
                      <span>
                        <strong className="text-slate-900 dark:text-zinc-50 font-bold">{item.quantity}</strong>{' '}
                        {item.unit || 'g'}
                      </span>
                    ) : (
                      <span className="text-slate-400 dark:text-zinc-500 italic text-xs font-normal">Standard</span>
                    )}
                  </td>

                  {/* Grade */}
                  <td className="py-3 px-4">
                    {item.grade ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-md border border-purple-200/60 dark:border-purple-800/60">
                        {item.grade}
                      </span>
                    ) : (
                      <span className="text-slate-400 dark:text-zinc-600 text-xs">—</span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onReserveItem) onReserveItem(item);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900/60 border border-teal-200/60 dark:border-teal-800/60 transition-colors"
                        title="Reserve Apparatus"
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
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 dark:text-zinc-300 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
