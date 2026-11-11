import React, { useState } from 'react';
import { 
  X, 
  FlaskConical, 
  MapPin, 
  Scale, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldAlert, 
  Info, 
  Printer, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { InventoryItem } from '../types';
import { getBlockBadge, getChemicalSafetyInfo } from '../utils/chemicalUtils';

interface ItemModalProps {
  item: InventoryItem | null;
  onClose: () => void;
  onReserveItem?: (item: InventoryItem) => void;
}

export const ItemModal: React.FC<ItemModalProps> = ({ item, onClose, onReserveItem }) => {
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const blockBadge = getBlockBadge(item.block);
  const safety = getChemicalSafetyInfo(item);

  const handleCopyDetails = () => {
    const text = `Item #${item.itemNo}: ${item.name}\nFormula: ${item.formula || 'N/A'}\nLocation: ${item.location || item.block}\nQuantity: ${item.quantity || 'Standard'} ${item.unit || ''}\nGrade: ${item.grade || 'Standard'}\nNotes: ${item.notes || 'None'}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintSlip = () => {
    window.print();
  };

  const handleReserve = () => {
    onClose();
    if (onReserveItem) {
      onReserveItem(item);
    }
  };

  const pubchemSearchUrl = `https://pubchem.ncbi.nlm.nih.gov/#query=${encodeURIComponent(item.name.replace(/\(.*?\)/g, '').trim())}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-zinc-800 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header Banner */}
        <div className="p-5 sm:p-6 bg-linear-to-r from-teal-800 via-teal-900 to-cyan-950 text-white flex items-start justify-between">
          <div className="space-y-1.5 pr-6">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-white/15 text-white border border-white/25 backdrop-blur-xs">
                Item #{item.itemNo}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/30 text-teal-100 border border-teal-400/30">
                {item.category}
              </span>
              {item.grade && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/30 text-purple-100 border border-purple-400/30">
                  {item.grade}
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white leading-tight">
              {item.name}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-5 sm:p-6 space-y-4.5 max-h-[75vh] overflow-y-auto">
          
          {/* Formula Display Card */}
          <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-600 text-white shadow-xs">
                <FlaskConical className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider">
                  Chemical Formula / Specs
                </span>
                <div className="text-xl sm:text-2xl font-mono font-extrabold text-teal-950 dark:text-teal-100">
                  {item.formula || <span className="text-slate-400 dark:text-zinc-500 font-sans italic text-base font-normal">Lab Equipment / Apparatus</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyDetails}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-750 transition-colors shadow-2xs cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copied ? 'Copied!' : 'Copy Info'}</span>
              </button>

              <a
                href={pubchemSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-2xs"
                title="Search PubChem Database"
              >
                <span>PubChem</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Key Inventory Attributes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Storage Location */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-800 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>STORAGE LOCATION</span>
              </div>
              <div className="flex items-center gap-2 pt-0.5">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${blockBadge.bg} ${blockBadge.text} ${blockBadge.border}`}>
                  {item.block || item.location}
                </span>
                <span className="text-xs text-slate-500 dark:text-zinc-400">
                  Storage & Workstation
                </span>
              </div>
            </div>

            {/* Packaging / Quantity */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-800 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                <Scale className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>CONTAINER QUANTITY</span>
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-zinc-50 pt-0.5">
                {item.quantity ? (
                  <span>
                    {item.quantity} <span className="font-medium text-slate-500 dark:text-zinc-400">{item.unit || 'units'}</span>
                  </span>
                ) : (
                  <span className="text-slate-400 dark:text-zinc-500 font-normal italic">Standard laboratory container</span>
                )}
              </div>
            </div>
          </div>

          {/* Description & Technical Notes */}
          {item.notes && (
            <div className="p-4 rounded-xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider text-[11px]">
                <Info className="w-4 h-4" />
                <span>TECHNICAL NOTES & APPLICATIONS</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
                {item.notes}
              </p>
            </div>
          )}

          {/* Safety & Lab Handling Guidelines */}
          <div className="p-4 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-3">
            <div className="flex items-center gap-2 text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Laboratory Safety & Handling Protocol</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="font-bold text-slate-700 dark:text-zinc-300 block mb-0.5">Hazard Classification:</span>
                <span className="text-amber-900 dark:text-amber-200 font-semibold">{safety.hazard}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700 dark:text-zinc-300 block mb-0.5">Storage Protocol:</span>
                <span className="text-slate-600 dark:text-zinc-300">{safety.storage}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700 dark:text-zinc-300 block mb-0.5">Incompatibilities:</span>
                <span className="text-slate-600 dark:text-zinc-300">{safety.incompatibilities}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700 dark:text-zinc-300 block mb-0.5">Required PPE:</span>
                <span className="text-slate-600 dark:text-zinc-300">{safety.handling}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-zinc-950/70 border-t border-slate-200/80 dark:border-zinc-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrintSlip}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Slip</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReserve}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-500/20 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              <span>Reserve Apparatus</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
