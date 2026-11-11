import React from 'react';
import type { ReservationStatus } from '../types/api';
import { Clock, CheckCircle2, XCircle, Ban, CheckCheck } from 'lucide-react';

interface ReservationBadgeProps {
  status: ReservationStatus;
  size?: 'sm' | 'md';
}

export const ReservationBadge: React.FC<ReservationBadgeProps> = ({ status, size = 'sm' }) => {
  const configs: Record<ReservationStatus, { bg: string; text: string; border: string; label: string; icon: React.ReactNode }> = {
    pending: {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      text: 'text-amber-700 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-800/80',
      label: 'Pending Approval',
      icon: <Clock className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
    },
    approved: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      text: 'text-emerald-700 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-800/80',
      label: 'Approved & Scheduled',
      icon: <CheckCircle2 className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
    },
    rejected: {
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      text: 'text-rose-700 dark:text-rose-400',
      border: 'border-rose-200 dark:border-rose-800/80',
      label: 'Rejected',
      icon: <XCircle className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
    },
    cancelled: {
      bg: 'bg-zinc-100 dark:bg-zinc-800/60',
      text: 'text-zinc-600 dark:text-zinc-400',
      border: 'border-zinc-200 dark:border-zinc-700',
      label: 'Cancelled',
      icon: <Ban className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
    },
    completed: {
      bg: 'bg-sky-50 dark:bg-sky-950/40',
      text: 'text-sky-700 dark:text-sky-400',
      border: 'border-sky-200 dark:border-sky-800/80',
      label: 'Completed',
      icon: <CheckCheck className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
    }
  };

  const c = configs[status] || configs.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-full border ${c.bg} ${c.text} ${c.border} ${
        size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
      }`}
    >
      {c.icon}
      <span>{c.label}</span>
    </span>
  );
};
