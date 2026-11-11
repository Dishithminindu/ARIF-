import React, { useState, useEffect } from 'react';
import { InventoryItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  FlaskConical, 
  CheckCircle2, 
  AlertCircle, 
  Info,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

interface ReservationModalProps {
  item: InventoryItem | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({ item, onClose, onSuccess }) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();

  // Get tomorrow or today as default
  const today = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(today);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('11:00');
  const [projectName, setProjectName] = useState('');
  const [supervisorName, setSupervisorName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successData, setSuccessData] = useState<any>(null);

  // Availability timeslots for the selected date
  const [bookedSlots, setBookedSlots] = useState<any[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  useEffect(() => {
    if (!item) return;

    const fetchAvailability = async () => {
      setIsLoadingSlots(true);
      try {
        const res = await api.equipment.getAvailability(item.id, date);
        if (res.success) {
          setBookedSlots(res.timeSlots);
        }
      } catch (err) {
        console.error('Error checking availability:', err);
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchAvailability();
  }, [item, date]);

  if (!item) return null;

  const handlePresetDuration = (hours: number) => {
    const [startH, startM] = startTime.split(':').map(Number);
    const endH = Math.min(18, startH + hours);
    setEndTime(`${String(endH).padStart(2, '0')}:${String(startM).padStart(2, '0')}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    if (startTime >= endTime) {
      setErrorMessage('Start time must be earlier than end time.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await api.reservations.create({
        equipment_id: item.id,
        reservation_date: date,
        start_time: startTime,
        end_time: endTime,
        purpose,
        project_name: projectName,
        supervisor_name: supervisorName,
        notes
      });

      if (res.success) {
        setSuccessData(res.reservation);
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create reservation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-50">
                Reserve Equipment / Apparatus
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                ARIF Laboratory Session Booking
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* Equipment Info Summary Banner */}
          <div className="p-4 rounded-xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/60 dark:border-teal-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-teal-600 dark:bg-teal-500 text-white">
                  #{item.itemNo}
                </span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-zinc-100">
                  {item.name}
                </h3>
              </div>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-600 dark:text-zinc-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  {item.location || item.block || 'Main Lab'}
                </span>
                <span>•</span>
                <span className="font-medium text-slate-700 dark:text-zinc-300">
                  Category: {item.category}
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5" />
                Available to Reserve
              </span>
            </div>
          </div>

          {/* Success State Screen */}
          {successData ? (
            <div className="p-6 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-zinc-100">
                  Booking Request Submitted!
                </h4>
                <p className="text-xs text-slate-600 dark:text-zinc-400 max-w-md mx-auto mt-1">
                  Your reservation request <strong className="font-mono text-teal-600 dark:text-teal-400">#{successData.id}</strong> has been logged in the system. The laboratory administration will review and confirm your session.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-zinc-400">Scheduled Date:</span>
                  <span className="font-bold text-slate-800 dark:text-zinc-200">{successData.reservation_date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-zinc-400">Time Window:</span>
                  <span className="font-bold text-slate-800 dark:text-zinc-200">{successData.start_time} - {successData.end_time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-zinc-400">Project:</span>
                  <span className="font-bold text-slate-800 dark:text-zinc-200">{successData.project_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-zinc-400">Status:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400 uppercase">PENDING APPROVAL</span>
                </div>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  Close & Continue Browsing
                </button>
              </div>
            </div>
          ) : (
            /* Reservation Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Login Banner for Guests */}
              {!isAuthenticated && (
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>Please sign in or register your student account to complete this booking.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => openAuthModal('login')}
                    className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Date & Time Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                    Reservation Date *
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="date"
                      required
                      min={today}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-zinc-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                    Start Time *
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="time"
                      required
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-zinc-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                    End Time *
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="time"
                      required
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-zinc-100"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Duration Preset Buttons */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 dark:text-zinc-400 font-medium">Quick Duration:</span>
                <button
                  type="button"
                  onClick={() => handlePresetDuration(1)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-teal-50 dark:hover:bg-teal-950 text-slate-700 dark:text-zinc-300 font-semibold border border-slate-200 dark:border-zinc-700 transition-colors"
                >
                  1 Hour
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetDuration(2)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-teal-50 dark:hover:bg-teal-950 text-slate-700 dark:text-zinc-300 font-semibold border border-slate-200 dark:border-zinc-700 transition-colors"
                >
                  2 Hours
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetDuration(4)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-teal-50 dark:hover:bg-teal-950 text-slate-700 dark:text-zinc-300 font-semibold border border-slate-200 dark:border-zinc-700 transition-colors"
                >
                  Half Day (4h)
                </button>
              </div>

              {/* Day Availability Status Preview */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-700 dark:text-zinc-300">
                    Existing Bookings on {date}:
                  </span>
                  {isLoadingSlots && <span className="text-slate-400">Checking...</span>}
                </div>
                {bookedSlots.length === 0 ? (
                  <p className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    No conflicting reservations. All time slots are currently open.
                  </p>
                ) : (
                  <div className="space-y-1">
                    {bookedSlots.map((slot) => (
                      <div 
                        key={slot.id} 
                        className="flex items-center justify-between px-2 py-1 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-[11px] text-amber-900 dark:text-amber-200 font-medium"
                      >
                        <span>🕒 {slot.start_time} – {slot.end_time}</span>
                        <span className="font-bold">{slot.display_label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Project & Research Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                    Research Project / Practical Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g. Synthesis of Titanium Nanoparticles"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-zinc-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                    Academic Supervisor / Lecturer
                  </label>
                  <input
                    type="text"
                    value={supervisorName}
                    onChange={(e) => setSupervisorName(e.target.value)}
                    placeholder="e.g. Prof. J. M. Bandara"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                  Purpose & Experimental Methodology *
                </label>
                <textarea
                  required
                  rows={2}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Describe your planned analysis, parameters to record, or experimental goal..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-zinc-100 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                  Special Requirements / Reagents Needed (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Nitrogen gas purging line, quartz cuvette 10mm"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-zinc-100"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white font-bold text-xs shadow-md shadow-teal-500/20 disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? 'Submitting Reservation...' : 'Confirm & Submit Reservation'}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
