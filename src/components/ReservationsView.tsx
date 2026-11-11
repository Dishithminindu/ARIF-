import React, { useState, useEffect } from 'react';
import type { Reservation } from '../types/api';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ReservationBadge } from './ReservationBadge';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  FlaskConical, 
  Search, 
  Plus, 
  AlertCircle, 
  CheckCircle2, 
  Ban, 
  User, 
  Building2,
  RefreshCw,
  FileText,
  X
} from 'lucide-react';

interface ReservationsViewProps {
  onOpenCatalog: () => void;
}

export const ReservationsView: React.FC<ReservationsViewProps> = ({ onOpenCatalog }) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cancelModalId, setCancelModalId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchMyReservations = async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await api.reservations.getMy();
      if (res.success) {
        setReservations(res.reservations);
      }
    } catch (err: any) {
      console.error('Error fetching reservations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReservations();
  }, [isAuthenticated]);

  const handleCancelReservation = async (id: string) => {
    setIsCancelling(true);
    try {
      const res = await api.reservations.cancel(id, cancelReason);
      if (res.success) {
        setNotification({
          type: 'success',
          message: 'Reservation cancelled successfully.'
        });
        setCancelModalId(null);
        setCancelReason('');
        fetchMyReservations();
      }
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Failed to cancel reservation.'
      });
    } finally {
      setIsCancelling(false);
    }
  };

  // Filtered reservations
  const filteredReservations = reservations.filter((r) => {
    if (filterStatus !== 'All' && r.status !== filterStatus.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (r.equipment_name || '').toLowerCase().includes(q);
      const matchCode = (r.equipment_code || '').toLowerCase().includes(q);
      const matchProject = (r.project_name || '').toLowerCase().includes(q);
      const matchPurpose = (r.purpose || '').toLowerCase().includes(q);
      return matchName || matchCode || matchProject || matchPurpose;
    }
    return true;
  });

  if (!isAuthenticated) {
    return (
      <div className="p-8 sm:p-12 text-center max-w-lg mx-auto bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4 my-8">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 mx-auto flex items-center justify-center">
          <Calendar className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-50">
          Equipment Reservation Hub
        </h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400">
          Sign in to view your equipment bookings, check approval statuses, and submit new reservation applications for laboratory apparatus.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => openAuthModal('login')}
            className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-500/20 cursor-pointer"
          >
            Sign In to Account
          </button>
          <button
            type="button"
            onClick={() => openAuthModal('register')}
            className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200 font-bold text-xs cursor-pointer"
          >
            Register Student
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Quick Action */}
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-50">
              My Equipment Reservations
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
              {reservations.length} total
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Track your laboratory apparatus requests, confirmed time slots, and supervisor approvals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchMyReservations}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={onOpenCatalog}
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white font-bold text-xs shadow-md shadow-teal-500/20 flex items-center gap-2 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Browse Catalog & Reserve</span>
          </button>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`p-4 rounded-xl text-xs font-medium flex items-center justify-between gap-2 ${
          notification.type === 'success' 
            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900' 
            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{notification.message}</span>
          </div>
          <button type="button" onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 shadow-2xs">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['All', 'Pending', 'Approved', 'Completed', 'Cancelled', 'Rejected'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                filterStatus === status
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bookings..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-zinc-100"
          />
        </div>
      </div>

      {/* Reservations List */}
      {isLoading ? (
        <div className="py-12 text-center text-xs text-slate-400 animate-pulse">
          Loading your laboratory reservations...
        </div>
      ) : filteredReservations.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-slate-200 dark:border-zinc-800 space-y-3">
          <Calendar className="w-10 h-10 text-slate-300 dark:text-zinc-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-zinc-300">
            No Reservations Found
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto">
            {searchQuery || filterStatus !== 'All' 
              ? 'No bookings match your selected filter criteria.' 
              : 'You haven’t made any equipment reservations yet. Browse the laboratory catalog to book an apparatus.'}
          </p>
          <button
            type="button"
            onClick={onOpenCatalog}
            className="mt-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs"
          >
            Explore Laboratory Equipment
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReservations.map((res) => (
            <div
              key={res.id}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-teal-600 dark:text-teal-400">
                        {res.equipment_code || 'ARIF-EQ'}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-400 font-mono">#{res.id.slice(-6)}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 mt-0.5">
                      {res.equipment_name || 'Equipment'}
                    </h3>
                  </div>
                  <ReservationBadge status={res.status} />
                </div>

                {/* Date & Time Pill */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-zinc-300 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span>{res.reservation_date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-zinc-300 font-mono font-bold">
                    <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span>{res.start_time} - {res.end_time}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="text-xs space-y-1.5">
                  <div className="flex items-start gap-2 text-slate-600 dark:text-zinc-400">
                    <span className="font-bold text-slate-700 dark:text-zinc-300 shrink-0">Project:</span>
                    <span className="truncate">{res.project_name}</span>
                  </div>

                  <div className="flex items-start gap-2 text-slate-600 dark:text-zinc-400">
                    <span className="font-bold text-slate-700 dark:text-zinc-300 shrink-0">Purpose:</span>
                    <span className="line-clamp-2">{res.purpose}</span>
                  </div>

                  {res.supervisor_name && (
                    <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400 text-[11px]">
                      <span>Supervisor:</span>
                      <span className="font-medium text-slate-700 dark:text-zinc-300">{res.supervisor_name}</span>
                    </div>
                  )}

                  {/* Rejection / Approval metadata */}
                  {res.status === 'rejected' && res.rejection_reason && (
                    <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-[11px]">
                      <strong>Reason for Rejection:</strong> {res.rejection_reason}
                    </div>
                  )}

                  {res.status === 'approved' && res.approved_by && (
                    <div className="text-[11px] text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Approved by {res.approved_by}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              {(res.status === 'pending' || res.status === 'approved') && (
                <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setCancelModalId(res.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>Cancel Reservation</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-zinc-800 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
              Cancel Equipment Reservation?
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Are you sure you want to cancel this booking? The time slot will be immediately freed for other laboratory students.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                Reason for Cancellation (Optional)
              </label>
              <input
                type="text"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Experiment rescheduled / sample not ready"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-zinc-100"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalId(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 font-bold text-xs"
              >
                Keep Booking
              </button>
              <button
                type="button"
                disabled={isCancelling}
                onClick={() => handleCancelReservation(cancelModalId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
              >
                {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
