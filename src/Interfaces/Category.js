/**
 * @fileoverview Kategori veri modeli
 */

export const CATEGORIES = [
  { id: 'work',     label: 'İş',        icon: '💼', color: '#7c70f0', bg: 'rgba(124,112,240,0.15)' },
  { id: 'personal', label: 'Kişisel',   icon: '👤', color: '#f5a623', bg: 'rgba(245,166,35,0.15)'  },
  { id: 'health',   label: 'Sağlık',    icon: '💪', color: '#2ed8a8', bg: 'rgba(46,216,168,0.15)'  },
  { id: 'finance',  label: 'Finans',    icon: '💰', color: '#38bdf8', bg: 'rgba(56,189,248,0.15)'  },
  { id: 'learning', label: 'Öğrenme',   icon: '📚', color: '#f472b6', bg: 'rgba(244,114,182,0.15)' },
  { id: 'shopping', label: 'Alışveriş', icon: '🛒', color: '#a78bfa', bg: 'rgba(167,139,250,0.15)' },
];

export function getCategoryById(id) {
  return CATEGORIES.find(c => c.id === id) || CATEGORIES[1];
}
