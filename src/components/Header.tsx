import React, { useState } from 'react';
import { 
  FlaskConical, 
  Moon, 
  Sun, 
  Download, 
  LayoutGrid, 
  TableProperties, 
  RotateCcw,
  Calendar,
  Shield,
  ShieldAlert,
  User,
  LogOut,
  LogIn,
  UserPlus,
  SlidersHorizontal,
  GraduationCap
} from 'lucide-react';
import { ViewMode } from '../types';
import { useAuth } from '../context/AuthContext';

export type MainNavTab = 'catalog' | 'reservations' | 'admin' | 'safety';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  totalCount: number;
  filteredCount: number;
  onResetFilters: () => void;
  onOpenExport: () => void;
  activeNavTab: MainNavTab;
  onChangeNavTab: (tab: MainNavTab) => void;
  onOpenSafetyModal: () => void;
  onOpenProfileModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  viewMode,
  onChangeViewMode,
  totalCount,
  filteredCount,
  onResetFilters,
  onOpenExport,
  activeNavTab,
  onChangeNavTab,
  onOpenSafetyModal,
  onOpenProfileModal
}) => {
  const { user, isAuthenticated, isAdmin, openAuthModal, logout } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-zinc-800/80 transition-colors shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          
          {/* Top Row: Logo & Brand + Main Nav */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between lg:justify-start gap-4">
            
            {/* Logo & Lab Title */}
            <div 
              onClick={() => onChangeNavTab('catalog')} 
              className="flex items-center gap-3 cursor-pointer select-none"
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-br from-teal-500 to-emerald-600 text-white shadow-sm shadow-teal-500/25 ring-1 ring-white/20">
                <FlaskConical className="w-5 h-5 stroke-[2.2]" />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-white dark:border-zinc-900 rounded-full" />
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-zinc-50">
                    ARIF-LAB <span className="text-teal-600 dark:text-teal-400 font-extrabold">PORTAL</span>
                  </h1>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60">
                    Verified Lab System
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                  Equipment Reservation & Inventory Management
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl border border-slate-200/70 dark:border-zinc-700/70 overflow-x-auto">
              <button
                type="button"
                onClick={() => onChangeNavTab('catalog')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeNavTab === 'catalog'
                    ? 'bg-white dark:bg-zinc-700 text-teal-700 dark:text-teal-300 shadow-xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100'
                }`}
              >
                <FlaskConical className="w-3.5 h-3.5" />
                <span>Inventory Catalog</span>
              </button>

              <button
                type="button"
                onClick={() => onChangeNavTab('reservations')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeNavTab === 'reservations'
                    ? 'bg-white dark:bg-zinc-700 text-teal-700 dark:text-teal-300 shadow-xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Reservations</span>
              </button>

              <button
                type="button"
                onClick={() => onChangeNavTab('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeNavTab === 'admin'
                    ? 'bg-white dark:bg-zinc-700 text-teal-700 dark:text-teal-300 shadow-xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-amber-500" />
                <span>Admin Center</span>
              </button>

              <button
                type="button"
                onClick={onOpenSafetyModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-white/50 dark:hover:bg-zinc-700/50 transition-all shrink-0 cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                <span>Safety Rules</span>
              </button>
            </nav>

          </div>

          {/* Right Column: View Controls + User Menu */}
          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2">
            
            {/* View Mode Switcher (only relevant on catalog) */}
            {activeNavTab === 'catalog' && (
              <div className="flex items-center bg-slate-100 dark:bg-zinc-800 p-0.5 rounded-lg border border-slate-200/70 dark:border-zinc-700/70">
                <button
                  type="button"
                  onClick={() => onChangeViewMode('grid')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-zinc-700 text-teal-700 dark:text-teal-300 shadow-2xs'
                      : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100'
                  }`}
                  title="Card Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Cards</span>
                </button>
                <button
                  type="button"
                  onClick={() => onChangeViewMode('table')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                    viewMode === 'table'
                      ? 'bg-white dark:bg-zinc-700 text-teal-700 dark:text-teal-300 shadow-2xs'
                      : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100'
                  }`}
                  title="Dense Table View"
                >
                  <TableProperties className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Table</span>
                </button>
              </div>
            )}

            {/* Export Button */}
            {activeNavTab === 'catalog' && (
              <button
                type="button"
                onClick={onOpenExport}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-slate-700 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700 transition-all shadow-2xs active:scale-98 cursor-pointer"
                title="Export Inventory (CSV/JSON/Print)"
              >
                <Download className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Export</span>
              </button>
            )}

            {/* Reset Filters Button */}
            {activeNavTab === 'catalog' && filteredCount !== totalCount && (
              <button
                type="button"
                onClick={onResetFilters}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 border border-amber-200/80 dark:border-amber-800/80 transition-colors"
                title="Reset All Filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}

            {/* Dark Mode Toggle */}
            <button
              id="theme-toggle-btn"
              type="button"
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg bg-white hover:bg-slate-50 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 transition-all shadow-2xs active:scale-95 cursor-pointer"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* User Account / Auth Section */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-750 border border-slate-200 dark:border-zinc-700 text-xs font-bold transition-all cursor-pointer"
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-white ${
                    user.role === 'admin' ? 'bg-amber-600' : 'bg-teal-600'
                  }`}>
                    {user.role === 'admin' ? <Shield className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold text-slate-900 dark:text-zinc-100 truncate max-w-[120px]">
                      {user.full_name.split(' ')[0]}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-zinc-400 uppercase font-mono">
                      {user.role}
                    </p>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-800 py-1.5 z-50 animate-in fade-in"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-zinc-800">
                      <p className="font-bold text-xs text-slate-900 dark:text-zinc-100">{user.full_name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono truncate">{user.email}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        user.role === 'admin' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                      }`}>
                        {user.role} • {user.student_id}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={onOpenProfileModal}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-teal-600" />
                      <span>My Profile & Settings</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onChangeNavTab('reservations')}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 flex items-center gap-2 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5 text-teal-600" />
                      <span>My Reservations</span>
                    </button>

                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => onChangeNavTab('admin')}
                        className="w-full px-4 py-2 text-left text-xs font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 flex items-center gap-2 cursor-pointer"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        <span>Admin Management Portal</span>
                      </button>
                    )}

                    <div className="border-t border-slate-100 dark:border-zinc-800 my-1" />

                    <button
                      type="button"
                      onClick={() => logout()}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm shadow-teal-600/20 cursor-pointer transition-all active:scale-95"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={() => openAuthModal('register')}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-750 text-slate-700 dark:text-zinc-200 text-xs font-bold shadow-2xs cursor-pointer transition-all active:scale-95"
                >
                  <UserPlus className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Register</span>
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
