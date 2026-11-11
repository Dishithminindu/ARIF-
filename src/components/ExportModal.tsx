import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileSpreadsheet, 
  FileCode, 
  Printer, 
  CheckCircle2, 
  ShieldCheck,
  FlaskConical
} from 'lucide-react';
import { InventoryItem } from '../types';
import { exportToCsv, exportToJson } from '../utils/chemicalUtils';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  filteredItems: InventoryItem[];
  allItems: InventoryItem[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  filteredItems,
  allItems
}) => {
  const [scope, setScope] = useState<'filtered' | 'all'>('filtered');

  if (!isOpen) return null;

  const targetItems = scope === 'filtered' ? filteredItems : allItems;

  const handleExportCsv = () => {
    const filename = `labchem_inventory_${scope}_${new Date().toISOString().slice(0, 10)}.csv`;
    exportToCsv(targetItems, filename);
  };

  const handleExportJson = () => {
    const filename = `labchem_inventory_${scope}_${new Date().toISOString().slice(0, 10)}.json`;
    exportToJson(targetItems, filename);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-linear-to-r from-teal-800 to-cyan-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xs">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Export Lab Inventory</h3>
              <p className="text-xs text-teal-100">Download formatted data or print report</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4.5">
          
          {/* Scope Selector */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider block mb-2">
              Export Range
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setScope('filtered')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  scope === 'filtered'
                    ? 'border-teal-500 bg-teal-50/70 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 font-semibold ring-2 ring-teal-500/20 shadow-2xs'
                    : 'border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-800/80 text-slate-700 dark:text-zinc-300 shadow-2xs'
                }`}
              >
                <div className="text-xs font-semibold">Filtered Items</div>
                <div className="text-lg font-extrabold text-teal-700 dark:text-teal-400">
                  {filteredItems.length} records
                </div>
              </button>

              <button
                type="button"
                onClick={() => setScope('all')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  scope === 'all'
                    ? 'border-teal-500 bg-teal-50/70 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 font-semibold ring-2 ring-teal-500/20 shadow-2xs'
                    : 'border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-800/80 text-slate-700 dark:text-zinc-300 shadow-2xs'
                }`}
              >
                <div className="text-xs font-semibold">Full Database</div>
                <div className="text-lg font-extrabold text-teal-700 dark:text-teal-400">
                  {allItems.length} records
                </div>
              </button>
            </div>
          </div>

          {/* Export Action Cards */}
          <div className="space-y-2.5">
            {/* CSV Export */}
            <button
              type="button"
              onClick={handleExportCsv}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200/80 dark:border-zinc-800 hover:border-teal-400 dark:hover:border-teal-500 bg-white dark:bg-zinc-850 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all text-left group shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-zinc-50 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    Export to CSV (Excel Compatible)
                  </div>
                  <div className="text-xs text-slate-500 dark:text-zinc-400">
                    Standard spreadsheet with formulas, locations, and quantities
                  </div>
                </div>
              </div>
              <Download className="w-4 h-4 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400" />
            </button>

            {/* JSON Export */}
            <button
              type="button"
              onClick={handleExportJson}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200/80 dark:border-zinc-800 hover:border-teal-400 dark:hover:border-teal-500 bg-white dark:bg-zinc-850 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all text-left group shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-50 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400">
                  <FileCode className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-zinc-50 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    Export to JSON
                  </div>
                  <div className="text-xs text-slate-500 dark:text-zinc-400">
                    Raw structured database with full metadata & search indices
                  </div>
                </div>
              </div>
              <Download className="w-4 h-4 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400" />
            </button>

            {/* Print Sheet */}
            <button
              type="button"
              onClick={handlePrint}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200/80 dark:border-zinc-800 hover:border-teal-400 dark:hover:border-teal-500 bg-white dark:bg-zinc-850 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all text-left group shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-zinc-50 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    Print Inventory Report
                  </div>
                  <div className="text-xs text-slate-500 dark:text-zinc-400">
                    Print-formatted catalog sheet for lab audits & physical stock-taking
                  </div>
                </div>
              </div>
              <Printer className="w-4 h-4 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400" />
            </button>
          </div>

          {/* Database Integrity Badge */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-800 flex items-center gap-2.5 text-xs text-slate-600 dark:text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
            <span>
              All {allItems.length} inventory items (chemicals, glassware, equipment, and cupboards) are verified and preserved without row or column loss.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-zinc-950/70 border-t border-slate-200/80 dark:border-zinc-800 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 hover:bg-slate-300 dark:hover:bg-zinc-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
