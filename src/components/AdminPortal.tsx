import React, { useState, useEffect } from 'react';
import type { SafeUser, Equipment, Reservation, AuditLog, SiteContent } from '../types/api';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ReservationBadge } from './ReservationBadge';
import { 
  Shield, 
  Users, 
  Calendar, 
  FlaskConical, 
  FileText, 
  Settings, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Ban, 
  CheckCheck, 
  Plus, 
  Edit, 
  KeyRound, 
  Lock, 
  AlertCircle, 
  Activity,
  Trash2,
  RefreshCw,
  Eye,
  SlidersHorizontal,
  Info
} from 'lucide-react';

type AdminTab = 'overview' | 'reservations' | 'equipment' | 'users' | 'audit' | 'content';

export const AdminPortal: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // State
  const [stats, setStats] = useState<any>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [usersList, setUsersList] = useState<SafeUser[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [siteContents, setSiteContents] = useState<SiteContent[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filters
  const [resSearch, setResSearch] = useState('');
  const [resStatusFilter, setResStatusFilter] = useState('All');
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');
  const [eqSearch, setEqSearch] = useState('');
  const [auditSearch, setAuditSearch] = useState('');

  // Modals
  const [rejectModalRes, setRejectModalRes] = useState<Reservation | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const [viewResModal, setViewResModal] = useState<Reservation | null>(null);

  const [editEquipmentModal, setEditEquipmentModal] = useState<Equipment | null>(null);
  const [isAddingNewEquipment, setIsAddingNewEquipment] = useState(false);
  const [eqFormData, setEqFormData] = useState<any>({
    name: '',
    category: 'Equipment',
    equipment_code: '',
    location: '',
    block: '',
    quantity: '1',
    condition: 'Good',
    status: 'available',
    manufacturer: '',
    model: '',
    safety_information: '',
    operating_instructions: '',
    is_reservable: true
  });

  const [resetPassUser, setResetPassUser] = useState<SafeUser | null>(null);
  const [adminNewPassword, setAdminNewPassword] = useState('');

  // Content edit
  const [editingContentKey, setEditingContentKey] = useState<string | null>(null);
  const [contentFormData, setContentFormData] = useState<{ title: string; content: string }>({ title: '', content: '' });

  // Initial load
  const fetchAllData = async () => {
    if (!isAdmin) return;
    setIsLoading(true);
    try {
      const [sRes, rRes, eRes, uRes, aRes, cRes] = await Promise.all([
        api.stats.getDashboard(),
        api.reservations.listAll(),
        api.equipment.list(),
        api.users.list(),
        api.stats.getAuditLogs(),
        api.content.list()
      ]);

      if (sRes.success) setStats(sRes.stats);
      if (rRes.success) setReservations(rRes.reservations);
      if (eRes.success) setEquipmentList(eRes.equipment);
      if (uRes.success) setUsersList(uRes.users);
      if (aRes.success) setAuditLogs(aRes.logs);
      if (cRes.success) setSiteContents(cRes.contents);
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [isAdmin]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Reservation Actions
  const handleApproveReservation = async (id: string) => {
    try {
      const res = await api.reservations.approve(id);
      if (res.success) {
        showNotification('success', res.message);
        fetchAllData();
        if (viewResModal?.id === id) setViewResModal(null);
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to approve reservation.');
    }
  };

  const handleRejectReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalRes) return;
    try {
      const res = await api.reservations.reject(rejectModalRes.id, rejectReason);
      if (res.success) {
        showNotification('success', res.message);
        setRejectModalRes(null);
        setRejectReason('');
        fetchAllData();
        if (viewResModal?.id === rejectModalRes.id) setViewResModal(null);
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to reject reservation.');
    }
  };

  const handleCompleteReservation = async (id: string) => {
    try {
      const res = await api.reservations.complete(id);
      if (res.success) {
        showNotification('success', res.message);
        fetchAllData();
        if (viewResModal?.id === id) setViewResModal(null);
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to complete reservation.');
    }
  };

  // User Management Actions
  const handleToggleUserStatus = async (userToUpdate: SafeUser, nextStatus: string) => {
    try {
      const res = await api.users.updateStatus(userToUpdate.id, nextStatus);
      if (res.success) {
        showNotification('success', res.message);
        fetchAllData();
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to update user status.');
    }
  };

  const handleToggleUserRole = async (userToUpdate: SafeUser, nextRole: string) => {
    try {
      const res = await api.users.updateRole(userToUpdate.id, nextRole);
      if (res.success) {
        showNotification('success', res.message);
        fetchAllData();
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to change role.');
    }
  };

  const handleAdminResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPassUser) return;
    try {
      const res = await api.users.resetPassword(resetPassUser.id, adminNewPassword);
      if (res.success) {
        showNotification('success', res.message);
        setResetPassUser(null);
        setAdminNewPassword('');
        fetchAllData();
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to reset password.');
    }
  };

  // Equipment Actions
  const handleSaveEquipment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isAddingNewEquipment) {
        const res = await api.equipment.create(eqFormData);
        if (res.success) {
          showNotification('success', res.message);
          setIsAddingNewEquipment(false);
          fetchAllData();
        }
      } else if (editEquipmentModal) {
        const res = await api.equipment.update(editEquipmentModal.id, eqFormData);
        if (res.success) {
          showNotification('success', res.message);
          setEditEquipmentModal(null);
          fetchAllData();
        }
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to save equipment.');
    }
  };

  const handleDeactivateEquipment = async (eq: Equipment) => {
    if (!confirm(`Are you sure you want to deactivate equipment "${eq.name}"?`)) return;
    try {
      const res = await api.equipment.deactivate(eq.id, 'Deactivated by administrator');
      if (res.success) {
        showNotification('success', res.message);
        fetchAllData();
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to deactivate equipment.');
    }
  };

  // Content Actions
  const handleSaveContent = async (key: string) => {
    try {
      const res = await api.content.update(key, contentFormData);
      if (res.success) {
        showNotification('success', res.message);
        setEditingContentKey(null);
        fetchAllData();
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to update content.');
    }
  };

  // Filtered lists
  const filteredReservations = reservations.filter((r) => {
    if (resStatusFilter !== 'All' && r.status !== resStatusFilter.toLowerCase()) return false;
    if (resSearch.trim()) {
      const q = resSearch.toLowerCase();
      return (
        (r.user_name || '').toLowerCase().includes(q) ||
        (r.student_id || '').toLowerCase().includes(q) ||
        (r.equipment_name || '').toLowerCase().includes(q) ||
        (r.equipment_code || '').toLowerCase().includes(q) ||
        (r.project_name || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredUsers = usersList.filter((u) => {
    if (userRoleFilter !== 'All' && u.role !== userRoleFilter.toLowerCase()) return false;
    if (userSearch.trim()) {
      const q = userSearch.toLowerCase();
      return (
        u.full_name.toLowerCase().includes(q) ||
        u.student_id.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.department.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredEquipment = equipmentList.filter((e) => {
    if (eqSearch.trim()) {
      const q = eqSearch.toLowerCase();
      return (
        e.name.toLowerCase().includes(q) ||
        e.equipment_code.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        (e.manufacturer && e.manufacturer.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const filteredAudit = auditLogs.filter((l) => {
    if (auditSearch.trim()) {
      const q = auditSearch.toLowerCase();
      return (
        l.description.toLowerCase().includes(q) ||
        l.user_name.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 dark:bg-zinc-900 text-white border border-slate-800 dark:border-zinc-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-400 flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">
                ARIF Laboratory Management Portal
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/30 text-teal-300 border border-teal-500/40 uppercase">
                ADMIN ACCESS
              </span>
            </div>
            <p className="text-xs text-slate-300 dark:text-zinc-400 mt-0.5">
              Secure laboratory operations, user authority control & apparatus bookings
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchAllData}
            disabled={isLoading}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className={`p-4 rounded-xl text-xs font-medium flex items-center justify-between gap-2 shadow-md animate-in fade-in ${
          notification.type === 'success' 
            ? 'bg-emerald-600 text-white' 
            : 'bg-rose-600 text-white'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{notification.message}</span>
          </div>
          <button type="button" onClick={() => setNotification(null)} className="text-white/80 hover:text-white">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto p-1.5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 shadow-2xs">
        {[
          { id: 'overview', label: 'Dashboard & Metrics', icon: Activity, badge: stats?.pendingReservations > 0 ? `${stats.pendingReservations} pending` : null },
          { id: 'reservations', label: 'Reservations', icon: Calendar, count: reservations.length },
          { id: 'equipment', label: 'Equipment & Assets', icon: FlaskConical, count: equipmentList.length },
          { id: 'users', label: 'User Accounts', icon: Users, count: usersList.length },
          { id: 'audit', label: 'Audit Trail', icon: FileText },
          { id: 'content', label: 'Site Content & Rules', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-slate-900 font-bold">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW DASHBOARD */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase">Pending Bookings</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2">
                {stats?.pendingReservations ?? 0}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Awaiting administrator approval</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase">Approved Sessions</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
                {stats?.approvedReservations ?? 0}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Confirmed laboratory bookings</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase">Catalog Assets</span>
                <FlaskConical className="w-4 h-4 text-teal-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-zinc-100 mt-2">
                {stats?.totalEquipment ?? equipmentList.length}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Chemicals & laboratory apparatus</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase">Registered Users</span>
                <Users className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-zinc-100 mt-2">
                {stats?.totalUsers ?? usersList.length}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{stats?.activeUsers ?? 0} active accounts</p>
            </div>
          </div>

          {/* Today's Schedule & Actionable Pending List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Urgent Pending Review */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                    Pending Reservation Requests
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => { setActiveTab('reservations'); setResStatusFilter('Pending'); }}
                  className="text-xs text-teal-600 dark:text-teal-400 font-bold hover:underline"
                >
                  View All
                </button>
              </div>

              {reservations.filter(r => r.status === 'pending').length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  <CheckCheck className="w-8 h-8 text-emerald-500 mx-auto mb-1 opacity-80" />
                  No pending reservation requests requiring review.
                </div>
              ) : (
                <div className="space-y-3">
                  {reservations.filter(r => r.status === 'pending').slice(0, 4).map((r) => (
                    <div key={r.id} className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-zinc-100">
                          {r.user_name} ({r.student_id})
                        </div>
                        <div className="text-slate-500 dark:text-zinc-400">
                          {r.equipment_name} • {r.reservation_date} ({r.start_time} - {r.end_time})
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleApproveReservation(r.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => { setRejectModalRes(r); }}
                          className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Today's Lab Sessions */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                    Today's Laboratory Schedule
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {new Date().toISOString().split('T')[0]}
                </span>
              </div>

              {reservations.filter(r => r.reservation_date === new Date().toISOString().split('T')[0] && (r.status === 'approved' || r.status === 'pending')).length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  No active equipment bookings scheduled for today.
                </div>
              ) : (
                <div className="space-y-2">
                  {reservations.filter(r => r.reservation_date === new Date().toISOString().split('T')[0] && (r.status === 'approved' || r.status === 'pending')).map((r) => (
                    <div key={r.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-zinc-100">
                          {r.equipment_name}
                        </div>
                        <div className="text-slate-500 dark:text-zinc-400 text-[11px]">
                          Student: {r.user_name} • {r.start_time} - {r.end_time}
                        </div>
                      </div>
                      <ReservationBadge status={r.status} size="sm" />
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: RESERVATIONS MANAGEMENT */}
      {activeTab === 'reservations' && (
        <div className="space-y-4">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 shadow-2xs">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {['All', 'Pending', 'Approved', 'Completed', 'Cancelled', 'Rejected'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setResStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    resStatusFilter === st
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={resSearch}
                onChange={(e) => setResSearch(e.target.value)}
                placeholder="Search student, equipment, ID..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-zinc-100"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-zinc-800/50 border-b border-slate-200/80 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="px-4 py-3">ID / Equipment</th>
                    <th className="px-4 py-3">Student / Department</th>
                    <th className="px-4 py-3">Date & Time</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                  {filteredReservations.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                        No reservations match your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredReservations.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-900 dark:text-zinc-100">
                            {r.equipment_name}
                          </div>
                          <div className="text-slate-400 font-mono text-[11px]">
                            {r.equipment_code} • #{r.id.slice(-6)}
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-800 dark:text-zinc-200">
                            {r.user_name}
                          </div>
                          <div className="text-slate-400 text-[11px]">
                            {r.student_id} • {r.user_department}
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-800 dark:text-zinc-200">
                            {r.reservation_date}
                          </div>
                          <div className="font-mono text-slate-500 dark:text-zinc-400 text-[11px]">
                            {r.start_time} - {r.end_time}
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <ReservationBadge status={r.status} size="sm" />
                        </td>

                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setViewResModal(r)}
                              className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
                              title="View Full Booking Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {r.status === 'pending' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleApproveReservation(r.id)}
                                  className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px]"
                                >
                                  Approve
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setRejectModalRes(r)}
                                  className="px-2 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px]"
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            {r.status === 'approved' && (
                              <button
                                type="button"
                                onClick={() => handleCompleteReservation(r.id)}
                                className="px-2 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-[11px]"
                              >
                                Mark Completed
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EQUIPMENT MANAGEMENT */}
      {activeTab === 'equipment' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 shadow-2xs">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={eqSearch}
                onChange={(e) => setEqSearch(e.target.value)}
                placeholder="Search equipment, code, block..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-zinc-100"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setEqFormData({
                  name: '',
                  category: 'Equipment',
                  equipment_code: '',
                  location: '',
                  block: '',
                  quantity: '1',
                  condition: 'Good',
                  status: 'available',
                  manufacturer: '',
                  model: '',
                  safety_information: '',
                  operating_instructions: '',
                  is_reservable: true
                });
                setIsAddingNewEquipment(true);
              }}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Equipment</span>
            </button>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto max-h-[600px]">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-slate-50 dark:bg-zinc-800/90 backdrop-blur-xs border-b border-slate-200/80 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Code / Name</th>
                    <th className="px-4 py-3">Category / Location</th>
                    <th className="px-4 py-3">Condition</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                  {filteredEquipment.slice(0, 100).map((eq) => (
                    <tr key={eq.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40">
                      <td className="px-4 py-2.5">
                        <span className="font-mono font-bold text-teal-600 dark:text-teal-400 mr-2">
                          {eq.equipment_code}
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-zinc-200">
                          {eq.name}
                        </span>
                      </td>

                      <td className="px-4 py-2.5 text-slate-600 dark:text-zinc-400">
                        {eq.category} • {eq.location}
                      </td>

                      <td className="px-4 py-2.5">
                        <span className="font-medium text-slate-700 dark:text-zinc-300">
                          {eq.condition}
                        </span>
                      </td>

                      <td className="px-4 py-2.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          eq.status === 'available' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                          eq.status === 'maintenance' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                          'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300'
                        }`}>
                          {eq.status}
                        </span>
                      </td>

                      <td className="px-4 py-2.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEqFormData(eq);
                              setEditEquipmentModal(eq);
                            }}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeactivateEquipment(eq)}
                            className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                            title="Deactivate"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 shadow-2xs">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {['All', 'Student', 'Admin'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setUserRoleFilter(r)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    userRoleFilter === r
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search user, ID, department..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-zinc-100"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-zinc-800/50 border-b border-slate-200/80 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="px-4 py-3">User & Student ID</th>
                    <th className="px-4 py-3">Email & Department</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Authority Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40">
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900 dark:text-zinc-100">
                          {u.full_name}
                        </div>
                        <div className="font-mono text-teal-600 dark:text-teal-400 text-[11px]">
                          {u.student_id}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="text-slate-800 dark:text-zinc-200">
                          {u.email}
                        </div>
                        <div className="text-slate-500 dark:text-zinc-400 text-[11px]">
                          {u.department}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.role === 'admin' 
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300' 
                            : 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-300'
                        }`}>
                          {u.role}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.account_status === 'active' 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}>
                          {u.account_status}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Role Toggle */}
                          <button
                            type="button"
                            onClick={() => handleToggleUserRole(u, u.role === 'admin' ? 'student' : 'admin')}
                            className="px-2 py-1 rounded-lg border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 text-[11px] font-medium"
                            title="Toggle between Student and Administrator"
                          >
                            Set {u.role === 'admin' ? 'Student' : 'Admin'}
                          </button>

                          {/* Status Toggle */}
                          <button
                            type="button"
                            onClick={() => handleToggleUserStatus(u, u.account_status === 'active' ? 'suspended' : 'active')}
                            className={`px-2 py-1 rounded-lg text-[11px] font-medium ${
                              u.account_status === 'active'
                                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 border border-amber-200'
                                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {u.account_status === 'active' ? 'Suspend' : 'Activate'}
                          </button>

                          {/* Reset Password */}
                          <button
                            type="button"
                            onClick={() => setResetPassUser(u)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:bg-slate-100"
                            title="Reset Password"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 shadow-2xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                placeholder="Search audit trail..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-zinc-100"
              />
            </div>
            <span className="text-xs text-slate-400">{filteredAudit.length} records</span>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 shadow-2xs divide-y divide-slate-100 dark:divide-zinc-800 max-h-[600px] overflow-y-auto">
            {filteredAudit.map((log) => (
              <div key={log.id} className="p-4 hover:bg-slate-50/50 dark:hover:bg-zinc-800/40 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-zinc-200">
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-sm bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                      {log.action}
                    </span>
                    <span>{log.user_name}</span>
                    <span className="text-[10px] text-slate-400">({log.user_role})</span>
                  </div>
                  <span className="text-slate-400 text-[11px] font-mono">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-slate-600 dark:text-zinc-400">
                    {log.description}
                  </p>
                  {log.ip_address && (
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-sm">
                      IP: {log.ip_address}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: SITE NOTICES & CONTENT */}
      {activeTab === 'content' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {siteContents.map((content) => (
              <div key={content.key} className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                    {content.title}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setContentFormData({ title: content.title, content: content.content });
                      setEditingContentKey(content.key);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-teal-600 text-white font-bold text-xs flex items-center gap-1"
                  >
                    <Edit className="w-3 h-3" />
                    <span>Edit Notice</span>
                  </button>
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-400 whitespace-pre-line bg-slate-50 dark:bg-zinc-800/40 p-3 rounded-xl border border-slate-100 dark:border-zinc-800 font-sans">
                  {content.content}
                </p>
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Last updated by: {content.updated_by}</span>
                  <span>{new Date(content.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: Reject Reason */}
      {rejectModalRes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-zinc-800 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
              Decline Reservation Request
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Provide a clear reason for declining the reservation request for {rejectModalRes.user_name}. This explanation will be displayed to the student.
            </p>

            <form onSubmit={handleRejectReservation} className="space-y-4">
              <textarea
                required
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Apparatus scheduled for scheduled maintenance / Required prerequisite training not verified."
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-900 dark:text-zinc-100 resize-none"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejectModalRes(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: View Reservation Details */}
      {viewResModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-zinc-800 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
              <div>
                <span className="text-[10px] font-mono text-teal-600 font-bold">#{viewResModal.id}</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                  {viewResModal.equipment_name}
                </h3>
              </div>
              <ReservationBadge status={viewResModal.status} />
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student:</span>
                  <span className="font-bold text-slate-800 dark:text-zinc-200">{viewResModal.user_name} ({viewResModal.student_id})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Department:</span>
                  <span className="font-medium text-slate-700 dark:text-zinc-300">{viewResModal.user_department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email:</span>
                  <span className="font-medium text-slate-700 dark:text-zinc-300">{viewResModal.user_email}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Scheduled Date:</span>
                  <span className="font-bold text-slate-800 dark:text-zinc-200">{viewResModal.reservation_date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Time Slot:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-zinc-200">{viewResModal.start_time} - {viewResModal.end_time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Equipment Code:</span>
                  <span className="font-mono text-teal-600 font-bold">{viewResModal.equipment_code}</span>
                </div>
              </div>

              <div>
                <strong className="block text-slate-700 dark:text-zinc-300 mb-0.5">Project:</strong>
                <p className="text-slate-600 dark:text-zinc-400 bg-slate-50 dark:bg-zinc-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-zinc-800">{viewResModal.project_name}</p>
              </div>

              <div>
                <strong className="block text-slate-700 dark:text-zinc-300 mb-0.5">Purpose / Methodology:</strong>
                <p className="text-slate-600 dark:text-zinc-400 bg-slate-50 dark:bg-zinc-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-zinc-800">{viewResModal.purpose}</p>
              </div>

              {viewResModal.notes && (
                <div>
                  <strong className="block text-slate-700 dark:text-zinc-300 mb-0.5">Special Notes:</strong>
                  <p className="text-slate-600 dark:text-zinc-400 bg-slate-50 dark:bg-zinc-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-zinc-800">{viewResModal.notes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setViewResModal(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 font-bold text-xs"
              >
                Close
              </button>
              {viewResModal.status === 'pending' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleApproveReservation(viewResModal.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
                  >
                    Approve Request
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRejectModalRes(viewResModal);
                      setViewResModal(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Add / Edit Equipment */}
      {(isAddingNewEquipment || editEquipmentModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-zinc-800 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
              {isAddingNewEquipment ? 'Add New Laboratory Equipment' : 'Edit Equipment Specifications'}
            </h3>

            <form onSubmit={handleSaveEquipment} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-zinc-300 mb-1">Equipment Name *</label>
                <input
                  type="text"
                  required
                  value={eqFormData.name || ''}
                  onChange={(e) => setEqFormData({ ...eqFormData, name: e.target.value })}
                  placeholder="e.g. UV-Vis Spectrophotometer"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-zinc-300 mb-1">Category *</label>
                  <select
                    value={eqFormData.category || 'Equipment'}
                    onChange={(e) => setEqFormData({ ...eqFormData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
                  >
                    <option value="Equipment">Equipment</option>
                    <option value="Chemical">Chemical</option>
                    <option value="Glassware">Glassware</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-zinc-300 mb-1">Location / Storage Block *</label>
                  <input
                    type="text"
                    required
                    value={eqFormData.location || ''}
                    onChange={(e) => setEqFormData({ ...eqFormData, location: e.target.value, block: e.target.value })}
                    placeholder="e.g. Block 4 / Cupboard 67"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-zinc-300 mb-1">Status</label>
                  <select
                    value={eqFormData.status || 'available'}
                    onChange={(e) => setEqFormData({ ...eqFormData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
                  >
                    <option value="available">Available</option>
                    <option value="partially_available">Partially Available</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-zinc-300 mb-1">Condition</label>
                  <select
                    value={eqFormData.condition || 'Good'}
                    onChange={(e) => setEqFormData({ ...eqFormData, condition: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Maintenance Required">Maintenance Required</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-zinc-300 mb-1">Safety Guidelines & Hazard Info</label>
                <textarea
                  rows={2}
                  value={eqFormData.safety_information || ''}
                  onChange={(e) => setEqFormData({ ...eqFormData, safety_information: e.target.value })}
                  placeholder="e.g. Wear UV-protective eyewear..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-zinc-300 mb-1">Operating Instructions (SOP)</label>
                <textarea
                  rows={2}
                  value={eqFormData.operating_instructions || ''}
                  onChange={(e) => setEqFormData({ ...eqFormData, operating_instructions: e.target.value })}
                  placeholder="Standard operating procedure steps..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="eq_is_reservable"
                  checked={eqFormData.is_reservable ?? true}
                  onChange={(e) => setEqFormData({ ...eqFormData, is_reservable: e.target.checked })}
                  className="rounded-sm border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="eq_is_reservable" className="font-bold text-slate-700 dark:text-zinc-300 cursor-pointer">
                  Allow students to reserve this item online
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => { setIsAddingNewEquipment(false); setEditEquipmentModal(null); }}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md"
                >
                  Save Equipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Admin Password Reset */}
      {resetPassUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-zinc-800 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
              Reset Password for {resetPassUser.full_name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Enter a new temporary or permanent password for student account <strong>{resetPassUser.student_id}</strong>.
            </p>

            <form onSubmit={handleAdminResetPassword} className="space-y-4">
              <input
                type="text"
                required
                value={adminNewPassword}
                onChange={(e) => setAdminNewPassword(e.target.value)}
                placeholder="Min. 8 characters (e.g. Student@ARIF2026!)"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-mono text-slate-900 dark:text-zinc-100"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setResetPassUser(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Edit Site Notice */}
      {editingContentKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-zinc-800 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
              Edit Site Notice / Guidelines
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-zinc-300 mb-1">Notice Title</label>
                <input
                  type="text"
                  value={contentFormData.title}
                  onChange={(e) => setContentFormData({ ...contentFormData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-zinc-300 mb-1">Content Body (Multi-line supported)</label>
                <textarea
                  rows={6}
                  value={contentFormData.content}
                  onChange={(e) => setContentFormData({ ...contentFormData, content: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 font-sans"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingContentKey(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveContent(editingContentKey)}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md"
                >
                  Save Notice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
