import React, { useState, useMemo, useEffect } from 'react';
import { 
  InventoryItem, 
  CategoryType, 
  ViewMode, 
  FilterState, 
  SortField, 
  SortOrder 
} from './types';
import { INITIAL_INVENTORY } from './data/inventoryData';
import { AuthProvider, useAuth } from './context/AuthContext';
import { api } from './services/api';
import { Header, MainNavTab } from './components/Header';
import { StatsDashboard } from './components/StatsDashboard';
import { SearchBar } from './components/SearchBar';
import { FilterBar } from './components/FilterBar';
import { ItemCard } from './components/ItemCard';
import { ItemTable } from './components/ItemTable';
import { ItemModal } from './components/ItemModal';
import { ExportModal } from './components/ExportModal';
import { EmptyState } from './components/EmptyState';
import { ReservationsView } from './components/ReservationsView';
import { AdminPortal } from './components/AdminPortal';
import { AuthModal } from './components/AuthModal';
import { ReservationModal } from './components/ReservationModal';
import { ProfileModal } from './components/ProfileModal';
import { SafetyModal } from './components/SafetyModal';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  ShieldCheck,
  Calendar,
  Lock,
  Sparkles,
  AlertCircle
} from 'lucide-react';

function MainAppContent() {
  const { user, isAuthenticated, isAdmin, openAuthModal } = useAuth();

  // State
  const [items, setItems] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [reservingItem, setReservingItem] = useState<InventoryItem | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeNavTab, setActiveNavTab] = useState<MainNavTab>('catalog');

  // Load items from database API if available
  useEffect(() => {
    const fetchEquipmentFromApi = async () => {
      try {
        const res = await api.equipment.list();
        if (res.success && Array.isArray(res.equipment) && res.equipment.length > 0) {
          // Map backend equipment model to frontend InventoryItem format if needed
          const mapped: InventoryItem[] = res.equipment.map((eq: any, index: number) => {
            // Check if matching original item exists for formula preservation
            const orig = INITIAL_INVENTORY.find(i => i.id === eq.id || String(i.itemNo) === String(eq.itemNo));
            return {
              id: eq.id || `eq-${index + 1}`,
              itemNo: eq.itemNo || (orig ? orig.itemNo : index + 1),
              name: eq.name,
              formula: eq.formula || (orig ? orig.formula : undefined),
              formulaPlain: eq.formulaPlain || (orig ? orig.formulaPlain : undefined),
              location: eq.location || eq.block || (orig ? orig.location : 'Main Lab'),
              block: eq.block || (orig ? orig.block : 'Main Lab'),
              quantity: eq.quantity || (orig ? orig.quantity : '1'),
              unit: eq.unit || (orig ? orig.unit : 'units'),
              grade: eq.grade || (orig ? orig.grade : undefined),
              category: (eq.category as InventoryItem['category']) || (orig ? orig.category : 'Equipment'),
              notes: eq.notes || eq.operating_instructions || (orig ? orig.notes : undefined),
              searchText: eq.name.toLowerCase()
            };
          });
          setItems(mapped);
        }
      } catch (err) {
        console.warn('Using seeded inventory data due to API sync:', err);
      }
    };

    fetchEquipmentFromApi();
  }, []);

  // Dark mode state with persistence
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('arif_dark_mode');
      if (saved !== null) {
        return saved === 'true';
      }
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('arif_dark_mode', String(darkMode));
    } catch {
      // ignore
    }
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, [darkMode]);

  // Comprehensive Filter State
  const [filters, setFilters] = useState<FilterState>({
    query: '',
    category: 'All',
    block: '',
    grade: '',
    hasQuantityOnly: false,
    sortBy: 'itemNo',
    sortOrder: 'asc',
    page: 1,
    itemsPerPage: 24
  });

  const handleUpdateFilters = (updates: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilters({
      query: '',
      category: 'All',
      block: '',
      grade: '',
      hasQuantityOnly: false,
      sortBy: 'itemNo',
      sortOrder: 'asc',
      page: 1,
      itemsPerPage: 24
    });
  };

  // Available blocks dynamically
  const availableBlocks = useMemo(() => {
    const set = new Set<string>();
    items.forEach(i => {
      if (i.block) set.add(i.block);
    });
    return Array.from(set).sort((a, b) => 
      a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
    );
  }, [items]);

  // Category counts
  const countsByCategory = useMemo<Record<CategoryType, number>>(() => {
    const counts: Record<CategoryType, number> = {
      All: items.length,
      Chemical: items.filter(i => i.category === 'Chemical').length,
      Glassware: items.filter(i => i.category === 'Glassware').length,
      Equipment: items.filter(i => i.category === 'Equipment').length,
      Other: items.filter(i => i.category === 'Other').length
    };
    return counts;
  }, [items]);

  // Search and filter pipeline
  const filteredAndSortedItems = useMemo(() => {
    let result = [...items];

    // 1. Category Filter
    if (filters.category !== 'All') {
      result = result.filter(item => item.category === filters.category);
    }

    // 2. Storage Block Filter
    if (filters.block) {
      result = result.filter(item => 
        item.block === filters.block || (item.location && item.location.includes(filters.block))
      );
    }

    // 3. Grade / Purity Filter
    if (filters.grade) {
      const g = filters.grade.toLowerCase();
      result = result.filter(item => 
        (item.grade && item.grade.toLowerCase().includes(g)) ||
        (item.name && item.name.toLowerCase().includes(g))
      );
    }

    // 4. Has Specified Quantity Filter
    if (filters.hasQuantityOnly) {
      result = result.filter(item => Boolean(item.quantity && item.quantity.trim().length > 0));
    }

    // 5. Query Search
    if (filters.query && filters.query.trim()) {
      const rawQuery = filters.query.trim().toLowerCase();
      const normalizedQuery = rawQuery
        .replace(/₀/g, '0')
        .replace(/₁/g, '1')
        .replace(/₂/g, '2')
        .replace(/₃/g, '3')
        .replace(/₄/g, '4')
        .replace(/₅/g, '5')
        .replace(/₆/g, '6')
        .replace(/₇/g, '7')
        .replace(/₈/g, '8')
        .replace(/₉/g, '9');

      result = result.filter(item => {
        const itemNoStr = String(item.itemNo);
        const nameMatch = (item.name || '').toLowerCase().includes(rawQuery);
        const formulaMatch = (item.formula || '').toLowerCase().includes(rawQuery);
        const plainFormulaMatch = (item.formulaPlain || '').toLowerCase().includes(normalizedQuery);
        const locationMatch = (item.location || item.block || '').toLowerCase().includes(rawQuery);
        const notesMatch = (item.notes || '').toLowerCase().includes(rawQuery);
        const searchIndexMatch = (item.searchText || '').toLowerCase().includes(rawQuery) || 
                                 (item.searchText || '').toLowerCase().includes(normalizedQuery);
        const gradeMatch = (item.grade || '').toLowerCase().includes(rawQuery);

        return (
          nameMatch ||
          formulaMatch ||
          plainFormulaMatch ||
          locationMatch ||
          itemNoStr === rawQuery ||
          notesMatch ||
          searchIndexMatch ||
          gradeMatch
        );
      });
    }

    // 6. Sorting
    result.sort((a, b) => {
      let comparison = 0;
      if (filters.sortBy === 'itemNo') {
        comparison = a.itemNo - b.itemNo;
      } else if (filters.sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (filters.sortBy === 'formula') {
        comparison = (a.formula || '').localeCompare(b.formula || '');
      } else if (filters.sortBy === 'location') {
        comparison = (a.location || a.block || '').localeCompare(b.location || b.block || '');
      } else if (filters.sortBy === 'quantity') {
        comparison = (a.quantity || '').localeCompare(b.quantity || '');
      }

      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [items, filters]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredAndSortedItems.length / filters.itemsPerPage));
  const currentPage = Math.min(filters.page, totalPages);

  const paginatedItems = useMemo(() => {
    if (filters.itemsPerPage >= filteredAndSortedItems.length) {
      return filteredAndSortedItems;
    }
    const start = (currentPage - 1) * filters.itemsPerPage;
    return filteredAndSortedItems.slice(start, start + filters.itemsPerPage);
  }, [filteredAndSortedItems, currentPage, filters.itemsPerPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setFilters(prev => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 220, behavior: 'smooth' });
    }
  };

  const handleOpenReserve = (item: InventoryItem) => {
    setReservingItem(item);
  };

  return (
    <div className="min-h-screen bg-zinc-50/70 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 transition-colors duration-150 flex flex-col font-sans">
      
      {/* Top Header */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        totalCount={items.length}
        filteredCount={filteredAndSortedItems.length}
        onResetFilters={handleResetFilters}
        onOpenExport={() => setIsExportOpen(true)}
        activeNavTab={activeNavTab}
        onChangeNavTab={setActiveNavTab}
        onOpenSafetyModal={() => setIsSafetyOpen(true)}
        onOpenProfileModal={() => setIsProfileOpen(true)}
      />

      {/* Main Container */}
      <main className="grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* VIEW 1: INVENTORY & APPARATUS CATALOG */}
        {activeNavTab === 'catalog' && (
          <>
            {/* Primary Search Bar with Category Tabs */}
            <SearchBar
              query={filters.query}
              onChangeQuery={(q) => handleUpdateFilters({ query: q, page: 1 })}
              category={filters.category}
              onChangeCategory={(c) => handleUpdateFilters({ category: c, page: 1 })}
              countsByCategory={countsByCategory}
            />

            {/* Statistics Metric Cards & Quick Block Switcher */}
            <StatsDashboard
              items={items}
              currentBlock={filters.block}
              onSelectBlock={(b) => handleUpdateFilters({ block: b, page: 1 })}
            />

            {/* Advanced Filters & Sorting Bar */}
            <FilterBar
              filters={filters}
              onUpdateFilters={handleUpdateFilters}
              onResetFilters={handleResetFilters}
              totalFiltered={filteredAndSortedItems.length}
              totalAll={items.length}
              availableBlocks={availableBlocks}
            />

            {/* Results Area */}
            {filteredAndSortedItems.length === 0 ? (
              <EmptyState
                category={filters.category}
                query={filters.query}
                onReset={handleResetFilters}
              />
            ) : (
              <div className="space-y-6">
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {paginatedItems.map((item) => (
                      <ItemCard
                        key={item.id}
                        item={item}
                        searchQuery={filters.query}
                        onSelectItem={setSelectedItem}
                        onReserveItem={handleOpenReserve}
                      />
                    ))}
                  </div>
                ) : (
                  <ItemTable
                    items={paginatedItems}
                    searchQuery={filters.query}
                    sortBy={filters.sortBy}
                    sortOrder={filters.sortOrder}
                    onSortChange={(field) => {
                      if (filters.sortBy === field) {
                        handleUpdateFilters({
                          sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc'
                        });
                      } else {
                        handleUpdateFilters({ sortBy: field, sortOrder: 'asc' });
                      }
                    }}
                    onSelectItem={setSelectedItem}
                    onReserveItem={handleOpenReserve}
                  />
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 shadow-2xs text-xs">
                    <div className="text-slate-500 dark:text-zinc-400">
                      Page <strong className="text-slate-900 dark:text-zinc-50 font-bold">{currentPage}</strong> of{' '}
                      <strong className="text-slate-900 dark:text-zinc-50 font-bold">{totalPages}</strong> ({filteredAndSortedItems.length} total results)
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                        className="p-1.5 rounded-lg border border-slate-200/80 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                        title="First Page"
                      >
                        <ChevronsLeft className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200/80 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors font-medium"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Prev</span>
                      </button>

                      {/* Page number buttons */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                        .map((pageNum, idx, arr) => {
                          const prev = arr[idx - 1];
                          const isEllipsisBefore = prev && pageNum - prev > 1;

                          return (
                            <React.Fragment key={pageNum}>
                              {isEllipsisBefore && <span className="px-1 text-slate-400 dark:text-zinc-500">...</span>}
                              <button
                                type="button"
                                onClick={() => handlePageChange(pageNum)}
                                className={`min-w-[32px] h-8 rounded-lg font-bold text-xs transition-all shadow-2xs ${
                                  currentPage === pageNum
                                    ? 'bg-teal-600 dark:bg-teal-500 text-white shadow-teal-500/20'
                                    : 'bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200/80 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-750'
                                }`}
                              >
                                {pageNum}
                              </button>
                            </React.Fragment>
                          );
                        })}

                      <button
                        type="button"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200/80 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors font-medium"
                      >
                        <span>Next</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        className="p-1.5 rounded-lg border border-slate-200/80 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                        title="Last Page"
                      >
                        <ChevronsRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* VIEW 2: RESERVATIONS HUB */}
        {activeNavTab === 'reservations' && (
          <ReservationsView
            onOpenCatalog={() => setActiveNavTab('catalog')}
          />
        )}

        {/* VIEW 3: ADMIN MANAGEMENT PORTAL */}
        {activeNavTab === 'admin' && (
          isAdmin ? (
            <AdminPortal />
          ) : (
            <div className="p-8 sm:p-12 text-center max-w-lg mx-auto bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4 my-8">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-50">
                Administrator Authentication Required
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                The laboratory management center is restricted to authorized laboratory staff and department administrators. Please sign in with administrator credentials.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-500/20 cursor-pointer"
                >
                  Sign In with Admin Credentials
                </button>
              </div>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-slate-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xs text-xs text-slate-500 dark:text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-zinc-200">ARIF Lab Portal</span>
            <span>•</span>
            <span>Equipment Reservation & Chemical Inventory Database</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400 dark:text-zinc-500">
            <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>{items.length} verified laboratory items across {availableBlocks.length} storage blocks & cupboards</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ItemModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onReserveItem={handleOpenReserve}
      />

      <ReservationModal
        item={reservingItem}
        onClose={() => setReservingItem(null)}
        onSuccess={() => {
          // Success handled in modal
        }}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        filteredItems={filteredAndSortedItems}
        allItems={items}
      />

      <SafetyModal
        isOpen={isSafetyOpen}
        onClose={() => setIsSafetyOpen(false)}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
