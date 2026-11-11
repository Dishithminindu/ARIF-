import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { SiteContent } from '../types/api';
import { X, ShieldAlert, FileText, Clock, Phone, MapPin, CheckCircle2 } from 'lucide-react';

interface SafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafetyModal: React.FC<SafetyModalProps> = ({ isOpen, onClose }) => {
  const [contents, setContents] = useState<SiteContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      api.content.list()
        .then((res) => {
          if (res.success) setContents(res.contents);
        })
        .catch((err) => console.error(err))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const safetyNotice = contents.find(c => c.key === 'safety_notice');
  const labHours = contents.find(c => c.key === 'lab_hours');
  const contactInfo = contents.find(c => c.key === 'contact_info');
  const announcement = contents.find(c => c.key === 'announcement');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-50">
                ARIF Laboratory Safety Guidelines & Protocols
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Mandatory rules for all research students, assistants and academic personnel
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          
          {announcement && (
            <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 text-teal-900 dark:text-teal-200">
              <div className="font-bold flex items-center gap-1.5 mb-1 text-sm">
                <FileText className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>{announcement.title}</span>
              </div>
              <p className="leading-relaxed whitespace-pre-line">{announcement.content}</p>
            </div>
          )}

          {/* Safety Protocols */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-zinc-100">
              <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>{safetyNotice?.title || 'General Laboratory Safety Rules'}</span>
            </div>
            <p className="text-slate-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
              {safetyNotice?.content || '1. Personal Protective Equipment (PPE) mandatory: Lab coat, safety glasses, closed-toe shoes.\n2. No food or beverage in laboratory.'}
            </p>
          </div>

          {/* Operating Hours & Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-zinc-100">
                <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>{labHours?.title || 'Operating Hours'}</span>
              </div>
              <p className="text-slate-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                {labHours?.content || 'Monday – Friday: 08:30 AM – 05:30 PM\nSaturday: 09:00 AM – 01:30 PM'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-zinc-100">
                <Phone className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>{contactInfo?.title || 'Laboratory Support'}</span>
              </div>
              <p className="text-slate-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                {contactInfo?.content || 'Email: support@ariflab.edu\nPhone: +94 11 288 1234'}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Always clean apparatus and inspect storage blocks before completing your reservation.</span>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
