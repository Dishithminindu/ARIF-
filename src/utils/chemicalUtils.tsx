import React from 'react';
import { InventoryItem } from '../types';

/**
 * Format chemical formula nicely with subscript numbers
 */
export function formatChemicalFormula(formula: string): string {
  if (!formula) return '—';
  return formula;
}

/**
 * Split text and highlight search matches
 */
export function highlightText(text: string, query: string): React.ReactNode {
  if (!query || !query.trim() || !text) {
    return text;
  }

  const trimmed = query.trim();
  // Escape regex special chars
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (part.toLowerCase() === trimmed.toLowerCase()) {
      return (
        <mark
          key={i}
          className="bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-100 font-semibold px-0.5 rounded"
        >
          {part}
        </mark>
      );
    }
    return part;
  });
}

/**
 * Return specific distinct color schemes for different Blocks
 */
export function getBlockBadge(block: string): { bg: string; text: string; border: string } {
  switch (block) {
    case 'Block 1':
      return {
        bg: 'bg-blue-50 dark:bg-blue-950/50',
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-200 dark:border-blue-800'
      };
    case 'Block 2':
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/50',
        text: 'text-emerald-700 dark:text-emerald-300',
        border: 'border-emerald-200 dark:border-emerald-800'
      };
    case 'Block 3':
      return {
        bg: 'bg-purple-50 dark:bg-purple-950/50',
        text: 'text-purple-700 dark:text-purple-300',
        border: 'border-purple-200 dark:border-purple-800'
      };
    case 'Block 4':
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/50',
        text: 'text-amber-700 dark:text-amber-300',
        border: 'border-amber-200 dark:border-amber-800'
      };
    case 'Block 5':
      return {
        bg: 'bg-cyan-50 dark:bg-cyan-950/50',
        text: 'text-cyan-700 dark:text-cyan-300',
        border: 'border-cyan-200 dark:border-cyan-800'
      };
    case 'Block 6':
      return {
        bg: 'bg-rose-50 dark:bg-rose-950/50',
        text: 'text-rose-700 dark:text-rose-300',
        border: 'border-rose-200 dark:border-rose-800'
      };
    case 'Block 7':
      return {
        bg: 'bg-indigo-50 dark:bg-indigo-950/50',
        text: 'text-indigo-700 dark:text-indigo-300',
        border: 'border-indigo-200 dark:border-indigo-800'
      };
    case 'Block 8':
      return {
        bg: 'bg-teal-50 dark:bg-teal-950/50',
        text: 'text-teal-700 dark:text-teal-300',
        border: 'border-teal-200 dark:border-teal-800'
      };
    case 'Cupboard 1 (56)':
    case 'Cupboard No 1 (56)':
    case 'Cupboard 56':
      return {
        bg: 'bg-violet-50 dark:bg-violet-950/50',
        text: 'text-violet-700 dark:text-violet-300',
        border: 'border-violet-200 dark:border-violet-800'
      };
    case 'Cupboard 1 (54)':
    case 'Cupboard No 1 (54)':
    case 'Cupboard 54':
      return {
        bg: 'bg-sky-50 dark:bg-sky-950/50',
        text: 'text-sky-700 dark:text-sky-300',
        border: 'border-sky-200 dark:border-sky-800'
      };
    case 'Cupboard 1 (55)':
    case 'Cupboard No 1 (55)':
    case 'Cupboard 55':
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/50',
        text: 'text-emerald-700 dark:text-emerald-300',
        border: 'border-emerald-200 dark:border-emerald-800'
      };
    case 'Cupboard 1 (40)':
    case 'Cupboard No 1 (40)':
    case 'Cupboard 40':
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/50',
        text: 'text-amber-700 dark:text-amber-300',
        border: 'border-amber-200 dark:border-amber-800'
      };
    case 'Cupboard 1 (67)':
    case 'Cupboard No 1 (67)':
    case 'Cupboard 67':
      return {
        bg: 'bg-rose-50 dark:bg-rose-950/50',
        text: 'text-rose-700 dark:text-rose-300',
        border: 'border-rose-200 dark:border-rose-800'
      };
    default:
      if (block.toLowerCase().includes('cupboard')) {
        return {
          bg: 'bg-orange-50 dark:bg-orange-950/50',
          text: 'text-orange-700 dark:text-orange-300',
          border: 'border-orange-200 dark:border-orange-800'
        };
      }
      return {
        bg: 'bg-slate-100 dark:bg-slate-800',
        text: 'text-slate-700 dark:text-slate-300',
        border: 'border-slate-200 dark:border-slate-700'
      };
  }
}

/**
 * Helper to export inventory records to CSV
 */
export function exportToCsv(items: InventoryItem[], filename = 'labchem_inventory.csv'): void {
  const headers = ['Item No', 'Item Name', 'Category', 'Formula', 'Plain Formula', 'Quantity', 'Unit', 'Location / Block', 'Grade', 'Notes'];
  
  const rows = items.map(item => [
    item.itemNo,
    `"${(item.name || '').replace(/"/g, '""')}"`,
    item.category,
    `"${(item.formula || '').replace(/"/g, '""')}"`,
    `"${(item.formulaPlain || '').replace(/"/g, '""')}"`,
    `"${(item.quantity || '').replace(/"/g, '""')}"`,
    item.unit || '',
    `"${(item.location || item.block || '').replace(/"/g, '""')}"`,
    `"${(item.grade || '').replace(/"/g, '""')}"`,
    `"${(item.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Helper to export inventory records to JSON
 */
export function exportToJson(items: InventoryItem[], filename = 'labchem_inventory.json'): void {
  const jsonContent = JSON.stringify(items, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate safety notes and chemical profile based on item name and formula
 */
export function getChemicalSafetyInfo(item: InventoryItem): {
  hazard: string;
  storage: string;
  incompatibilities: string;
  handling: string;
} {
  const name = item.name.toLowerCase();
  const formula = (item.formulaPlain || '').toLowerCase();

  if (name.includes('sodium metal')) {
    return {
      hazard: 'Water-Reactive / Pyrophoric (Category 1)',
      storage: 'Keep immersed in dry mineral oil / paraffin in sealed airtight container. Store away from water, moisture, and oxidizers.',
      incompatibilities: 'Water, alcohols, strong acids, halogenated hydrocarbons, oxidizers.',
      handling: 'Wear safety goggles, flame-resistant lab coat, and dry nitrile gloves. Use tweezers or spatula under anhydrous atmosphere.'
    };
  }

  if (name.includes('nitrate') || name.includes('permanganate')) {
    return {
      hazard: 'Strong Oxidizer (Category 2/3)',
      storage: 'Store in a dedicated oxidizer cabinet away from combustible materials, organic solvents, flammables, and reducing agents.',
      incompatibilities: 'Reducing agents, organic matter, cyanides, sulfur, powdered metals.',
      handling: 'Avoid friction, grinding, or mixing with combustible substances. Keep tightly closed in dry location.'
    };
  }

  if (name.includes('hydroxide') || name.includes('potassium hydroxide') || name.includes('sodium hydroxide')) {
    return {
      hazard: 'Corrosive Base (Category 1A)',
      storage: 'Store in dedicated corrosive base cabinet in original polypropylene containers. Highly hygroscopic.',
      incompatibilities: 'Strong acids, aluminum, zinc, tin, ammonium salts.',
      handling: 'Exothermic when dissolved in water! Always add slowly to water with stirring, never water to base. Wear eye protection and gloves.'
    };
  }

  if (name.includes('acid')) {
    return {
      hazard: 'Organic / Corrosive Acid',
      storage: 'Store in dedicated acid cabinet away from bases, cyanides, and sulfides.',
      incompatibilities: 'Strong bases, oxidizing agents, carbonates.',
      handling: 'Wear chemical resistant gloves and eye protection. Rinse thoroughly in case of contact.'
    };
  }

  if (name.includes('iodide') || name.includes('iodine') || name.includes('silver')) {
    return {
      hazard: 'Light Sensitive / Oxidizer / Environmental Hazard',
      storage: 'Store in tightly capped amber glass bottles protected from direct light in cool, ventilated area.',
      incompatibilities: 'Ammonia, strong oxidizing or reducing agents.',
      handling: 'Prevent skin contact to avoid staining. Collect heavy metal rinse wastes in dedicated collection bottles.'
    };
  }

  if (name.includes('cobalt') || name.includes('nickel') || name.includes('lead') || name.includes('bismuth') || name.includes('tin') || name.includes('selenium')) {
    return {
      hazard: 'Heavy Metal Compound / Toxic',
      storage: 'Store in tightly sealed containers in designated toxic chemical storage with secondary containment.',
      incompatibilities: 'Strong acids, active metals, strong oxidizers.',
      handling: 'Work under a fume hood. Avoid inhalation of dust. Dispose of all residues in dedicated heavy metal hazardous waste stream.'
    };
  }

  return {
    hazard: 'Standard General Chemical Reagent',
    storage: 'Store in a cool, dry, well-ventilated location in sealed container according to Block number.',
    incompatibilities: 'Strong oxidizing agents, excessive heat, moisture.',
    handling: 'Wear standard laboratory PPE: safety glasses, lab coat, and nitrile gloves. Wash hands after handling.'
  };
}
