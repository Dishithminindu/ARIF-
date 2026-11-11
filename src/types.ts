export interface InventoryItem {
  id: string;
  itemNo: number;
  name: string;
  category: 'Chemical' | 'Glassware' | 'Equipment' | 'Other';
  formula: string;
  formulaPlain: string;
  quantity: string;
  unit: string;
  location: string;
  block: string;
  notes?: string;
  purityNotes?: string;
  purity?: string;
  grade?: string;
  casNumber?: string;
  hazardClass?: string;
  searchText: string;
}

export type CategoryType = 'All' | 'Chemical' | 'Glassware' | 'Equipment' | 'Other';

export type ViewMode = 'grid' | 'table';

export type SortField = 'itemNo' | 'name' | 'formula' | 'location' | 'quantity';
export type SortOrder = 'asc' | 'desc';

export interface FilterState {
  query: string;
  category: CategoryType;
  block: string;
  grade: string;
  hasQuantityOnly: boolean;
  sortBy: SortField;
  sortOrder: SortOrder;
  page: number;
  itemsPerPage: number;
}
