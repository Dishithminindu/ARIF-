/**
 * ARIF-LAB INVENTORY - Laboratory Inventory Search System
 * Pure Vanilla JavaScript Client-Side Engine (Zero Dependencies)
 */

(function () {
  'use strict';

  // State
  const state = {
    items: [],
    query: '',
    category: 'All', // 'All', 'Chemical', 'Glassware', 'Equipment', 'Other'
    block: '',
    grade: '',
    hasQuantityOnly: false,
    sortBy: 'itemNo', // 'itemNo', 'name', 'formula', 'location'
    sortOrder: 'asc', // 'asc', 'desc'
    viewMode: 'grid', // 'grid', 'table'
    page: 1,
    itemsPerPage: 24,
    selectedItem: null,
    isExportOpen: false,
    darkMode: false,
  };

  // SVG Icons Helper for zero dependency inline icons
  const ICONS = {
    flask: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/></svg>`,
    search: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
    pin: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
    scale: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>`,
    copy: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
    check: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    extLink: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>`,
    grid: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>`,
    table: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/></svg>`,
    download: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>`,
    reset: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`,
    sun: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
    moon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
    x: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
    boxes: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l6 3.43a2 2 0 0 0 2.06 0l6-3.43a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L12 9.5l-9.03 3.42Z"/><path d="m12 9.5 9.03-3.42A2 2 0 0 0 22 4.37V1.13a2 2 0 0 0-.97-1.71l-6-3.43a2 2 0 0 0-2.06 0l-6 3.43A2 2 0 0 0 6 1.13v3.24a2 2 0 0 0 .97 1.71L12 9.5Z"/><path d="M12 22.5V9.5"/></svg>`,
    award: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`,
    checkCircle: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    layers: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.9a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>`,
    shieldAlert: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>`,
    tag: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><circle cx="7" cy="7" r=".5"/></svg>`,
    printer: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>`,
  };

  /**
   * Initialize Application
   */
  function init() {
    initTheme();
    loadInventoryData();
  }

  /**
   * Theme handling (Dark / Light Mode)
   */
  function initTheme() {
    let savedTheme = null;
    try {
      savedTheme = localStorage.getItem('labchem_dark_mode');
    } catch (e) {
      console.warn('localStorage disabled', e);
    }

    if (savedTheme !== null) {
      state.darkMode = savedTheme === 'true';
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      state.darkMode = true;
    }

    applyTheme();
  }

  function toggleTheme() {
    state.darkMode = !state.darkMode;
    try {
      localStorage.setItem('labchem_dark_mode', String(state.darkMode));
    } catch (e) {}
    applyTheme();
  }

  function applyTheme() {
    const root = document.documentElement;
    const btn = document.getElementById('theme-toggle-btn');
    if (state.darkMode) {
      root.classList.add('dark');
      document.body.classList.add('dark');
      root.style.colorScheme = 'dark';
      if (btn) btn.innerHTML = ICONS.sun;
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
      root.style.colorScheme = 'light';
      if (btn) btn.innerHTML = ICONS.moon;
    }
  }

  /**
   * Load Inventory (window.LAB_INVENTORY first, then fetch fallback)
   */
  function loadInventoryData() {
    if (window.LAB_INVENTORY && Array.isArray(window.LAB_INVENTORY) && window.LAB_INVENTORY.length > 0) {
      state.items = window.LAB_INVENTORY;
      finishInit();
      return;
    }

    // Async Fetch Fallback for http servers
    fetch('data/inventory.json')
      .then(function (res) {
        if (!res.ok) throw new Error('Network error loading inventory.json');
        return res.json();
      })
      .then(function (data) {
        state.items = data;
        finishInit();
      })
      .catch(function (err) {
        console.error('Failed to load inventory dataset:', err);
        state.items = [];
        finishInit();
      });
  }

  function finishInit() {
    bindEvents();
    populateBlockAndGradeSelects();
    renderStatsDashboard();
    renderAll();
  }

  /**
   * Event Listeners Binding
   */
  function bindEvents() {
    // Theme toggle
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', toggleTheme);
    }

    // Search Input
    const searchInput = document.getElementById('main-chemical-search-input');
    const clearBtn = document.getElementById('btn-clear-search');
    if (searchInput) {
      searchInput.addEventListener('input', function (e) {
        state.query = e.target.value;
        state.page = 1;
        if (clearBtn) {
          clearBtn.style.display = state.query ? 'flex' : 'none';
        }
        renderAll();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        if (searchInput) {
          searchInput.value = '';
          searchInput.focus();
        }
        state.query = '';
        state.page = 1;
        clearBtn.style.display = 'none';
        renderAll();
      });
    }

    // Keyboard shortcut '/'
    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && document.activeElement !== searchInput) {
        e.preventDefault();
        if (searchInput) searchInput.focus();
      } else if (e.key === 'Escape') {
        closeModals();
      }
    });

    // View Switcher
    const btnGrid = document.getElementById('btn-view-grid');
    const btnTable = document.getElementById('btn-view-table');
    if (btnGrid && btnTable) {
      btnGrid.addEventListener('click', function () {
        state.viewMode = 'grid';
        btnGrid.classList.add('active');
        btnTable.classList.remove('active');
        renderItems();
      });
      btnTable.addEventListener('click', function () {
        state.viewMode = 'table';
        btnTable.classList.add('active');
        btnGrid.classList.remove('active');
        renderItems();
      });
    }

    // Filter selectors
    const blockSelect = document.getElementById('filter-block-select');
    if (blockSelect) {
      blockSelect.addEventListener('change', function (e) {
        state.block = e.target.value;
        state.page = 1;
        renderAll();
      });
    }

    const gradeSelect = document.getElementById('filter-grade-select');
    if (gradeSelect) {
      gradeSelect.addEventListener('change', function (e) {
        state.grade = e.target.value;
        state.page = 1;
        renderAll();
      });
    }

    const sortSelect = document.getElementById('filter-sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', function (e) {
        const parts = e.target.value.split('-');
        state.sortBy = parts[0];
        state.sortOrder = parts[1];
        renderAll();
      });
    }

    const pageSizeSelect = document.getElementById('filter-pagesize-select');
    if (pageSizeSelect) {
      pageSizeSelect.addEventListener('change', function (e) {
        state.itemsPerPage = parseInt(e.target.value, 10);
        state.page = 1;
        renderAll();
      });
    }

    const quantityBtn = document.getElementById('btn-toggle-quantity');
    if (quantityBtn) {
      quantityBtn.addEventListener('click', function () {
        state.hasQuantityOnly = !state.hasQuantityOnly;
        state.page = 1;
        if (state.hasQuantityOnly) {
          quantityBtn.classList.add('active');
        } else {
          quantityBtn.classList.remove('active');
        }
        renderAll();
      });
    }

    // Reset Filters
    const resetBtns = document.querySelectorAll('.btn-reset-filters');
    resetBtns.forEach(function (btn) {
      btn.addEventListener('click', resetAllFilters);
    });

    // Export Modal Open
    const exportBtn = document.getElementById('btn-open-export');
    if (exportBtn) {
      exportBtn.addEventListener('click', openExportModal);
    }

    // Modal Close buttons
    const closeItemModalBtn = document.getElementById('btn-close-item-modal');
    if (closeItemModalBtn) {
      closeItemModalBtn.addEventListener('click', closeModals);
    }
    const closeExportModalBtn = document.getElementById('btn-close-export-modal');
    if (closeExportModalBtn) {
      closeExportModalBtn.addEventListener('click', closeModals);
    }

    // Modal Backdrop clicks
    const modalItemOverlay = document.getElementById('item-modal-overlay');
    if (modalItemOverlay) {
      modalItemOverlay.addEventListener('click', function (e) {
        if (e.target === modalItemOverlay) closeModals();
      });
    }
    const modalExportOverlay = document.getElementById('export-modal-overlay');
    if (modalExportOverlay) {
      modalExportOverlay.addEventListener('click', function (e) {
        if (e.target === modalExportOverlay) closeModals();
      });
    }

    // Export Actions
    const btnExportCsv = document.getElementById('btn-export-csv');
    if (btnExportCsv) {
      btnExportCsv.addEventListener('click', function () {
        const scope = document.querySelector('input[name="export-scope"]:checked')?.value || 'filtered';
        const targetItems = scope === 'all' ? state.items : getFilteredItems();
        exportToCsv(targetItems, `labchem_inventory_${scope}_${new Date().toISOString().slice(0, 10)}.csv`);
      });
    }

    const btnExportJson = document.getElementById('btn-export-json');
    if (btnExportJson) {
      btnExportJson.addEventListener('click', function () {
        const scope = document.querySelector('input[name="export-scope"]:checked')?.value || 'filtered';
        const targetItems = scope === 'all' ? state.items : getFilteredItems();
        exportToJson(targetItems, `labchem_inventory_${scope}_${new Date().toISOString().slice(0, 10)}.json`);
      });
    }

    const btnPrintReport = document.getElementById('btn-print-report');
    if (btnPrintReport) {
      btnPrintReport.addEventListener('click', function () {
        window.print();
      });
    }
  }

  function resetAllFilters() {
    state.query = '';
    state.category = 'All';
    state.block = '';
    state.grade = '';
    state.hasQuantityOnly = false;
    state.sortBy = 'itemNo';
    state.sortOrder = 'asc';
    state.page = 1;

    const searchInput = document.getElementById('main-chemical-search-input');
    if (searchInput) searchInput.value = '';
    const clearBtn = document.getElementById('btn-clear-search');
    if (clearBtn) clearBtn.style.display = 'none';

    const blockSelect = document.getElementById('filter-block-select');
    if (blockSelect) blockSelect.value = '';

    const gradeSelect = document.getElementById('filter-grade-select');
    if (gradeSelect) gradeSelect.value = '';

    const sortSelect = document.getElementById('filter-sort-select');
    if (sortSelect) sortSelect.value = 'itemNo-asc';

    const quantityBtn = document.getElementById('btn-toggle-quantity');
    if (quantityBtn) quantityBtn.classList.remove('active');

    renderAll();
  }

  /**
   * Filter & Sort Logic
   */
  function getFilteredItems() {
    const q = state.query.trim().toLowerCase();
    const cat = state.category;
    const blk = state.block;
    const grd = state.grade.toLowerCase();
    const qtyOnly = state.hasQuantityOnly;

    return state.items.filter(function (item) {
      // Category filter
      if (cat !== 'All') {
        if (cat === 'Other') {
          if (item.category === 'Chemical' || item.category === 'Glassware' || item.category === 'Equipment') {
            return false;
          }
        } else if (item.category !== cat) {
          return false;
        }
      }

      // Block filter
      if (blk) {
        const itemBlk = (item.block || '').toLowerCase();
        const itemLoc = (item.location || '').toLowerCase();
        if (itemBlk !== blk.toLowerCase() && !itemLoc.includes(blk.toLowerCase())) {
          return false;
        }
      }

      // Grade filter
      if (grd) {
        const itemGrade = (item.grade || '').toLowerCase();
        const itemName = (item.name || '').toLowerCase();
        if (!itemGrade.includes(grd) && !itemName.includes(grd)) {
          return false;
        }
      }

      // Quantity only filter
      if (qtyOnly && (!item.quantity || !item.quantity.trim())) {
        return false;
      }

      // Multi-term Search
      if (q) {
        const words = q.split(/\s+/);
        const name = (item.name || '').toLowerCase();
        const formula = (item.formula || '').toLowerCase();
        const formulaPlain = (item.formulaPlain || '').toLowerCase();
        const loc = (item.location || item.block || '').toLowerCase();
        const notes = (item.notes || '').toLowerCase();
        const grade = (item.grade || '').toLowerCase();
        const itemNo = String(item.itemNo || '');
        const searchText = (item.searchText || '').toLowerCase();

        const combined = `${itemNo} ${name} ${formula} ${formulaPlain} ${loc} ${notes} ${grade} ${searchText}`;

        // Every search word must match
        const matchesAll = words.every(function (w) {
          return combined.includes(w);
        });

        if (!matchesAll) return false;
      }

      return true;
    });
  }

  function getSortedAndPaginatedItems(filteredItems) {
    const sorted = filteredItems.slice().sort(function (a, b) {
      let valA = a[state.sortBy];
      let valB = b[state.sortBy];

      if (state.sortBy === 'itemNo') {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
        return state.sortOrder === 'asc' ? valA - valB : valB - valA;
      }

      valA = String(valA || '').toLowerCase();
      valB = String(valB || '').toLowerCase();

      if (valA < valB) return state.sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return state.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    const total = sorted.length;
    const maxPage = Math.max(1, Math.ceil(total / state.itemsPerPage));
    if (state.page > maxPage) state.page = maxPage;

    const startIdx = (state.page - 1) * state.itemsPerPage;
    const paginated = sorted.slice(startIdx, startIdx + state.itemsPerPage);

    return {
      items: paginated,
      totalCount: total,
      totalPages: maxPage,
      startIndex: total === 0 ? 0 : startIdx + 1,
      endIndex: Math.min(startIdx + state.itemsPerPage, total),
    };
  }

  /**
   * Rendering Functions
   */
  function renderAll() {
    renderCategoryPills();
    renderBlockStrip();
    renderItems();
  }

  function renderCategoryPills() {
    const container = document.getElementById('category-pills-container');
    if (!container) return;

    const counts = {
      All: state.items.length,
      Chemical: 0,
      Glassware: 0,
      Equipment: 0,
      Other: 0,
    };

    state.items.forEach(function (i) {
      if (counts[i.category] !== undefined) {
        counts[i.category]++;
      } else {
        counts.Other++;
      }
    });

    const categories = [
      { id: 'All', label: 'All Items', icon: ICONS.flask },
      { id: 'Chemical', label: 'Chemicals', icon: ICONS.flask },
      { id: 'Glassware', label: 'Glassware', icon: ICONS.boxes },
      { id: 'Equipment', label: 'Equipment', icon: ICONS.scale },
      { id: 'Other', label: 'Samples / Misc', icon: ICONS.layers },
    ];

    container.innerHTML = categories
      .map(function (cat) {
        const isSelected = state.category === cat.id;
        return `
        <button
          type="button"
          class="category-pill ${isSelected ? 'active' : ''}"
          data-category="${cat.id}"
        >
          <span>${cat.icon}</span>
          <span>${cat.label}</span>
          <span class="pill-count">${counts[cat.id] || 0}</span>
        </button>
      `;
      })
      .join('');

    container.querySelectorAll('.category-pill').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.category = btn.getAttribute('data-category');
        state.page = 1;
        renderAll();
      });
    });
  }

  function renderStatsDashboard() {
    const totalCount = state.items.length;
    const blocksSet = new Set();
    let arGradeCount = 0;
    let withQuantityCount = 0;

    state.items.forEach(function (i) {
      if (i.block) blocksSet.add(i.block);
      if (
        (i.name && (i.name.includes('AR') || i.name.includes('GR') || i.name.includes('Extra Pure'))) ||
        (i.grade && (i.grade.includes('AR') || i.grade.includes('GR') || i.grade.includes('Extra Pure')))
      ) {
        arGradeCount++;
      }
      if (i.quantity && i.quantity.trim()) {
        withQuantityCount++;
      }
    });

    const elTotal = document.getElementById('stat-total-count');
    const elBlocks = document.getElementById('stat-blocks-count');
    const elAr = document.getElementById('stat-ar-count');
    const elQty = document.getElementById('stat-qty-count');

    if (elTotal) elTotal.textContent = totalCount;
    if (elBlocks) elBlocks.textContent = blocksSet.size;
    if (elAr) elAr.textContent = arGradeCount;
    if (elQty) elQty.textContent = withQuantityCount;
  }

  function renderBlockStrip() {
    const strip = document.getElementById('block-strip-container');
    if (!strip) return;

    const blockCounts = {};
    state.items.forEach(function (i) {
      const b = i.block || 'Other';
      blockCounts[b] = (blockCounts[b] || 0) + 1;
    });

    const blocks = Object.keys(blockCounts).sort(function (a, b) {
      return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
    });

    let html = `
      <span class="block-strip-label">
        ${ICONS.layers}
        <span>Storage Block:</span>
      </span>
      <button type="button" class="block-chip ${!state.block ? 'active' : ''}" data-block="">
        <span>All (${state.items.length})</span>
      </button>
    `;

    blocks.forEach(function (b) {
      const isSelected = state.block === b;
      html += `
        <button type="button" class="block-chip ${isSelected ? 'active' : ''}" data-block="${b}">
          <span>${b}</span>
          <span class="chip-subcount">${blockCounts[b]}</span>
        </button>
      `;
    });

    strip.innerHTML = html;

    strip.querySelectorAll('.block-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        const b = chip.getAttribute('data-block');
        state.block = b;
        state.page = 1;
        const blockSelect = document.getElementById('filter-block-select');
        if (blockSelect) blockSelect.value = b;
        renderAll();
      });
    });
  }

  function populateBlockAndGradeSelects() {
    const blockSelect = document.getElementById('filter-block-select');
    if (blockSelect) {
      const blocksSet = new Set();
      state.items.forEach(function (i) {
        if (i.block) blocksSet.add(i.block);
      });
      const sortedBlocks = Array.from(blocksSet).sort(function (a, b) {
        return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
      });

      blockSelect.innerHTML =
        `<option value="">All Storage Blocks</option>` +
        sortedBlocks
          .map(function (b) {
            return `<option value="${b}">${b}</option>`;
          })
          .join('');
    }

    // Bind Quick Popular Search Chips
    const popularContainer = document.getElementById('popular-chips-container');
    if (popularContainer) {
      const quickSearches = ['Acetic Acid', 'Acetone', 'DMSO', 'DMF', 'Ethanol', 'Sulphuric Acid', 'TiCl4', 'Beaker', 'Pipette', 'pH Meter', 'NaCl', 'Block 1'];
      popularContainer.innerHTML =
        `<span class="quick-chips-label">Popular:</span>` +
        quickSearches
          .map(function (term) {
            return `<button type="button" class="chip-btn" data-query="${term}">${term}</button>`;
          })
          .join('');

      popularContainer.querySelectorAll('.chip-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          const term = btn.getAttribute('data-query');
          const searchInput = document.getElementById('main-chemical-search-input');
          if (searchInput) {
            searchInput.value = term;
          }
          state.query = term;
          state.page = 1;
          const clearBtn = document.getElementById('btn-clear-search');
          if (clearBtn) clearBtn.style.display = 'flex';
          renderAll();
        });
      });
    }
  }

  function renderItems() {
    const filtered = getFilteredItems();
    const result = getSortedAndPaginatedItems(filtered);

    // Update results counter text
    const countText = document.getElementById('results-count-display');
    if (countText) {
      if (filtered.length === state.items.length) {
        countText.innerHTML = `Showing <strong>${result.startIndex}–${result.endIndex}</strong> of <strong>${result.totalCount}</strong> items`;
      } else {
        countText.innerHTML = `Showing <strong>${result.startIndex}–${result.endIndex}</strong> of <strong>${result.totalCount}</strong> matching items (filtered from ${state.items.length})`;
      }
    }

    // Toggle Reset Button in header
    const headerResetBtn = document.getElementById('header-reset-btn');
    if (headerResetBtn) {
      headerResetBtn.style.display = filtered.length !== state.items.length ? 'inline-flex' : 'none';
    }

    const container = document.getElementById('items-view-container');
    if (!container) return;

    if (result.totalCount === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">${ICONS.flask}</div>
          <h3 class="empty-title">No Inventory Items Found</h3>
          <p class="empty-desc">No laboratory chemicals, glassware, or equipment matched your search "${state.query}" or filter criteria.</p>
          <button type="button" class="btn-header btn-reset btn-reset-filters" style="padding: 0.5rem 1rem; font-size: 0.8125rem;">
            ${ICONS.reset}
            <span>Clear Search & Filters</span>
          </button>
        </div>
      `;
      container.querySelector('.btn-reset-filters')?.addEventListener('click', resetAllFilters);
      renderPagination(0, 1);
      return;
    }

    if (state.viewMode === 'grid') {
      renderGridView(container, result.items);
    } else {
      renderTableView(container, result.items);
    }

    renderPagination(result.totalCount, result.totalPages);
  }

  function renderGridView(container, items) {
    container.innerHTML = `
      <div class="item-grid">
        ${items
          .map(function (item) {
            const highlightedName = highlightQuery(item.name, state.query);
            const highlightedFormula = item.formula ? highlightQuery(item.formula, state.query) : '';
            return `
            <div class="item-card" data-id="${item.id}">
              <div>
                <div class="card-header">
                  <div class="card-header-left">
                    <span class="item-no-badge">#${item.itemNo}</span>
                    <span class="category-tag">${item.category}</span>
                  </div>
                  <span class="block-badge">
                    ${ICONS.pin}
                    <span>${item.block || item.location}</span>
                  </span>
                </div>

                <h3 class="chemical-name" title="${escapeHtml(item.name)}">${highlightedName}</h3>

                <div class="formula-box">
                  <div class="formula-inner">
                    <span style="color: var(--teal-accent); display: flex;">${ICONS.flask}</span>
                    <span class="formula-text">
                      ${highlightedFormula || '<span style="color: var(--text-subtle); font-style: italic; font-weight: normal; font-size: 0.75rem;">No formula specified</span>'}
                    </span>
                  </div>
                  ${
                    item.formula
                      ? `
                    <button type="button" class="btn-copy-formula" data-formula="${escapeHtml(item.formula || item.formulaPlain)}" title="Copy Formula">
                      ${ICONS.copy}
                    </button>
                  `
                      : ''
                  }
                </div>

                ${
                  item.grade
                    ? `
                  <div class="card-meta-row">
                    <span class="grade-tag">
                      ${ICONS.tag}
                      <span>${escapeHtml(item.grade)}</span>
                    </span>
                  </div>
                `
                    : ''
                }

                ${
                  item.notes
                    ? `
                  <p class="card-notes">${escapeHtml(item.notes)}</p>
                `
                    : ''
                }
              </div>

              <div class="card-footer">
                <div class="quantity-info">
                  ${ICONS.scale}
                  ${
                    item.quantity
                      ? `<span><strong>${escapeHtml(item.quantity)}</strong> ${escapeHtml(item.unit || 'g')}</span>`
                      : `<span style="color: var(--text-subtle); font-weight: normal; font-style: italic;">Standard unit</span>`
                  }
                </div>

                <button type="button" class="btn-details" data-id="${item.id}">
                  <span>Details</span>
                  ${ICONS.extLink}
                </button>
              </div>
            </div>
          `;
          })
          .join('')}
      </div>
    `;

    attachItemCardEvents(container);
  }

  function renderTableView(container, items) {
    container.innerHTML = `
      <div class="table-wrapper">
        <table class="dense-table">
          <thead>
            <tr>
              <th style="width: 70px;">Item #</th>
              <th>Name</th>
              <th>Category</th>
              <th>Formula</th>
              <th>Location</th>
              <th>Grade</th>
              <th>Quantity</th>
              <th style="text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${items
              .map(function (item) {
                return `
                <tr data-id="${item.id}">
                  <td style="font-family: var(--font-mono); font-weight: 700;">#${item.itemNo}</td>
                  <td>
                    <div style="font-weight: 700; color: var(--text-main);">${highlightQuery(item.name, state.query)}</div>
                    ${item.notes ? `<div style="font-size: 0.6875rem; color: var(--text-muted); font-style: italic;">${escapeHtml(item.notes)}</div>` : ''}
                  </td>
                  <td><span class="category-tag">${item.category}</span></td>
                  <td style="font-family: var(--font-mono); font-weight: 600; color: var(--teal-accent);">${item.formula ? highlightQuery(item.formula, state.query) : '—'}</td>
                  <td><span class="block-badge">${ICONS.pin} ${item.block || item.location}</span></td>
                  <td>${item.grade ? `<span class="grade-tag">${escapeHtml(item.grade)}</span>` : '—'}</td>
                  <td><strong>${item.quantity ? `${item.quantity} ${item.unit || 'g'}` : '—'}</strong></td>
                  <td style="text-align: right;">
                    <button type="button" class="btn-details" data-id="${item.id}">
                      <span>Details</span>
                      ${ICONS.extLink}
                    </button>
                  </td>
                </tr>
              `;
              })
              .join('')}
          </tbody>
        </table>
      </div>
    `;

    attachItemCardEvents(container);
  }

  function attachItemCardEvents(container) {
    // Click on item to open details
    container.querySelectorAll('[data-id]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        if (e.target.closest('.btn-copy-formula')) return;
        const id = el.getAttribute('data-id');
        const item = state.items.find(function (i) {
          return i.id === id;
        });
        if (item) openItemModal(item);
      });
    });

    // Copy formula
    container.querySelectorAll('.btn-copy-formula').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const formula = btn.getAttribute('data-formula');
        navigator.clipboard.writeText(formula);
        btn.innerHTML = ICONS.check;
        btn.style.color = '#10b981';
        setTimeout(function () {
          btn.innerHTML = ICONS.copy;
          btn.style.color = '';
        }, 1800);
      });
    });
  }

  function renderPagination(totalCount, totalPages) {
    const container = document.getElementById('pagination-container');
    if (!container) return;

    if (totalCount <= state.itemsPerPage) {
      container.innerHTML = '';
      return;
    }

    let pagesHtml = '';
    const current = state.page;

    // Previous Button
    pagesHtml += `
      <button type="button" class="page-btn" data-page="${current - 1}" ${current === 1 ? 'disabled' : ''}>
        ‹ Prev
      </button>
    `;

    // Page numbers
    for (let p = 1; p <= totalPages; p++) {
      if (p === 1 || p === totalPages || (p >= current - 2 && p <= current + 2)) {
        pagesHtml += `
          <button type="button" class="page-btn ${p === current ? 'active' : ''}" data-page="${p}">
            ${p}
          </button>
        `;
      } else if (p === current - 3 || p === current + 3) {
        pagesHtml += `<span style="padding: 0 0.25rem; color: var(--text-muted);">…</span>`;
      }
    }

    // Next Button
    pagesHtml += `
      <button type="button" class="page-btn" data-page="${current + 1}" ${current === totalPages ? 'disabled' : ''}>
        Next ›
      </button>
    `;

    container.innerHTML = `
      <div class="pagination-pages">
        ${pagesHtml}
      </div>
    `;

    container.querySelectorAll('.page-btn:not(:disabled)').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const page = parseInt(btn.getAttribute('data-page'), 10);
        if (!isNaN(page) && page >= 1 && page <= totalPages) {
          state.page = page;
          renderItems();
          window.scrollTo({ top: 180, behavior: 'smooth' });
        }
      });
    });
  }

  /**
   * Item Details Modal
   */
  function openItemModal(item) {
    state.selectedItem = item;
    const overlay = document.getElementById('item-modal-overlay');
    if (!overlay) return;

    const safety = getSafetyInfo(item);
    const pubchemUrl = `https://pubchem.ncbi.nlm.nih.gov/#query=${encodeURIComponent(item.name.replace(/\(.*?\)/g, '').trim())}`;

    overlay.innerHTML = `
      <div class="modal-card">
        <div class="modal-header">
          <div class="modal-header-text">
            <div class="modal-badges">
              <span class="modal-badge-itemno">Item #${item.itemNo}</span>
              <span class="category-tag" style="background: rgba(255,255,255,0.2); color: #ffffff; border-color: rgba(255,255,255,0.3);">${item.category}</span>
              ${item.grade ? `<span class="grade-tag" style="background: rgba(255,255,255,0.2); color: #ffffff; border-color: rgba(255,255,255,0.3);">${escapeHtml(item.grade)}</span>` : ''}
            </div>
            <h2 class="modal-title">${escapeHtml(item.name)}</h2>
          </div>
          <button type="button" class="btn-close-modal" id="btn-modal-close-icon" title="Close">${ICONS.x}</button>
        </div>

        <div class="modal-body">
          <!-- Formula Box -->
          <div class="modal-formula-banner">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div style="padding: 0.5rem; border-radius: 8px; background: var(--teal-accent); color: #fff; display: flex;">
                ${ICONS.flask}
              </div>
              <div>
                <span style="font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; color: var(--teal-accent);">Chemical Formula</span>
                <div style="font-family: var(--font-mono); font-size: 1.25rem; font-weight: 800; color: var(--text-main);">
                  ${item.formula || '<span style="font-size: 0.875rem; color: var(--text-subtle); font-style: italic;">Not specified</span>'}
                </div>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <button type="button" class="btn-header" id="btn-copy-modal-info" style="font-size: 0.75rem;">
                ${ICONS.copy}
                <span id="copy-modal-text">Copy Info</span>
              </button>
              <a href="${pubchemUrl}" target="_blank" rel="noopener noreferrer" class="btn-header" style="background: var(--teal-accent); color: #fff; border-color: var(--teal-accent);" title="Search PubChem">
                <span>PubChem</span>
                ${ICONS.extLink}
              </a>
            </div>
          </div>

          <!-- Attributes Grid -->
          <div class="modal-attributes-grid">
            <div class="modal-attr-box">
              <span class="attr-label">${ICONS.pin} Storage Location</span>
              <span class="attr-val">${escapeHtml(item.location || item.block || 'General Storage')}</span>
            </div>
            <div class="modal-attr-box">
              <span class="attr-label">${ICONS.scale} Container Quantity</span>
              <span class="attr-val">${item.quantity ? `${escapeHtml(item.quantity)} ${escapeHtml(item.unit || 'g')}` : 'Standard container'}</span>
            </div>
          </div>

          ${
            item.notes
              ? `
            <div class="modal-attr-box" style="background: var(--bg-card); border-color: var(--border-subtle);">
              <span class="attr-label">Laboratory Notes & Details</span>
              <p style="font-size: 0.8125rem; color: var(--text-main); line-height: 1.5; margin-top: 0.25rem;">${escapeHtml(item.notes)}</p>
            </div>
          `
              : ''
          }

          <!-- Chemical Safety Guidance -->
          <div class="modal-safety-card">
            <div class="safety-header">
              ${ICONS.shieldAlert}
              <span>Safety & Storage Guidance</span>
            </div>
            <div class="safety-item"><strong>Classification:</strong> ${safety.hazard}</div>
            <div class="safety-item"><strong>Storage:</strong> ${safety.storage}</div>
            <div class="safety-item"><strong>Incompatibilities:</strong> ${safety.incompatibilities}</div>
            <div class="safety-item"><strong>Handling:</strong> ${safety.handling}</div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-header" id="btn-modal-print">
            ${ICONS.printer}
            <span>Print Slip</span>
          </button>
          <button type="button" class="btn-header" id="btn-modal-close-footer" style="background: var(--teal-accent); color: #fff; border-color: var(--teal-accent);">
            Close
          </button>
        </div>
      </div>
    `;

    overlay.style.display = 'flex';

    document.getElementById('btn-modal-close-icon')?.addEventListener('click', closeModals);
    document.getElementById('btn-modal-close-footer')?.addEventListener('click', closeModals);
    document.getElementById('btn-modal-print')?.addEventListener('click', function () {
      window.print();
    });

    document.getElementById('btn-copy-modal-info')?.addEventListener('click', function () {
      const text = `Item #${item.itemNo}: ${item.name}\nFormula: ${item.formula || 'N/A'}\nLocation: ${item.location || item.block}\nQuantity: ${item.quantity || 'Standard'} ${item.unit || ''}\nGrade: ${item.grade || 'Standard'}\nNotes: ${item.notes || 'None'}`;
      navigator.clipboard.writeText(text);
      const textSpan = document.getElementById('copy-modal-text');
      if (textSpan) textSpan.textContent = 'Copied!';
      setTimeout(function () {
        if (textSpan) textSpan.textContent = 'Copy Info';
      }, 1800);
    });
  }

  function openExportModal() {
    const overlay = document.getElementById('export-modal-overlay');
    if (!overlay) return;
    const filteredCount = getFilteredItems().length;
    const totalCount = state.items.length;

    const countFilteredEl = document.getElementById('export-count-filtered');
    const countAllEl = document.getElementById('export-count-all');
    if (countFilteredEl) countFilteredEl.textContent = `${filteredCount} records`;
    if (countAllEl) countAllEl.textContent = `${totalCount} records`;

    overlay.style.display = 'flex';
  }

  function closeModals() {
    const itemOverlay = document.getElementById('item-modal-overlay');
    if (itemOverlay) itemOverlay.style.display = 'none';
    const exportOverlay = document.getElementById('export-modal-overlay');
    if (exportOverlay) exportOverlay.style.display = 'none';
  }

  /**
   * Export Utilities (CSV / JSON)
   */
  function exportToCsv(items, filename) {
    const headers = ['Item No', 'Item Name', 'Category', 'Formula', 'Plain Formula', 'Quantity', 'Unit', 'Location / Block', 'Grade', 'Notes'];
    const rows = items.map(function (i) {
      return [
        i.itemNo,
        `"${(i.name || '').replace(/"/g, '""')}"`,
        i.category,
        `"${(i.formula || '').replace(/"/g, '""')}"`,
        `"${(i.formulaPlain || '').replace(/"/g, '""')}"`,
        `"${(i.quantity || '').replace(/"/g, '""')}"`,
        i.unit || '',
        `"${(i.location || i.block || '').replace(/"/g, '""')}"`,
        `"${(i.grade || '').replace(/"/g, '""')}"`,
        `"${(i.notes || '').replace(/"/g, '""')}"`,
      ];
    });

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    downloadBlob(csv, filename, 'text/csv;charset=utf-8;');
  }

  function exportToJson(items, filename) {
    const json = JSON.stringify(items, null, 2);
    downloadBlob(json, filename, 'application/json;charset=utf-8;');
  }

  function downloadBlob(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Safety Generator Helper
   */
  function getSafetyInfo(item) {
    const name = (item.name || '').toLowerCase();
    if (name.includes('sodium metal')) {
      return {
        hazard: 'Water-Reactive / Pyrophoric (Category 1)',
        storage: 'Keep immersed in dry mineral oil in airtight container away from water & moisture.',
        incompatibilities: 'Water, alcohols, strong acids, halogenated hydrocarbons.',
        handling: 'Wear flame-resistant coat and nitrile gloves. Use tongs/spatula under dry conditions.',
      };
    }
    if (name.includes('nitrate') || name.includes('permanganate')) {
      return {
        hazard: 'Strong Oxidizer (Category 2/3)',
        storage: 'Store in dedicated oxidizer cabinet away from organic solvents and reducing agents.',
        incompatibilities: 'Reducing agents, organic matter, sulfur, powdered metals.',
        handling: 'Avoid friction or mixing with combustibles. Keep container dry.',
      };
    }
    if (name.includes('hydroxide')) {
      return {
        hazard: 'Corrosive Base (Category 1A)',
        storage: 'Store in dedicated corrosive base cabinet in polypropylene containers.',
        incompatibilities: 'Strong acids, aluminum, zinc, ammonium salts.',
        handling: 'Dissolution is exothermic. Always add slowly to water with stirring.',
      };
    }
    if (name.includes('acid')) {
      return {
        hazard: 'Corrosive / Acid Reagent',
        storage: 'Store in dedicated acid cabinet away from bases and cyanides.',
        incompatibilities: 'Strong bases, oxidizing agents, carbonates.',
        handling: 'Wear chemical resistant gloves and goggles. Rinse immediately on skin contact.',
      };
    }
    return {
      hazard: 'Standard General Chemical Reagent',
      storage: 'Store in a cool, dry, well-ventilated location in sealed container according to Block number.',
      incompatibilities: 'Strong oxidizing agents, excessive heat, moisture.',
      handling: 'Wear standard laboratory PPE: safety glasses, lab coat, and nitrile gloves.',
    };
  }

  /**
   * Highlighting Helper
   */
  function highlightQuery(text, query) {
    if (!query || !query.trim() || !text) return escapeHtml(text);
    const trimmed = query.trim();
    const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    return escapeHtml(text).replace(regex, '<mark class="search-highlight">$1</mark>');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Start on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
