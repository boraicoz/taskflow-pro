/**
 * @fileoverview Task veri modeli ve yardımcı fonksiyonlar
 */

export const STORAGE_KEY = 'taskflow_pro_v2';

export const PRIORITY_CONFIG = {
  high:   { label: 'Kritik', color: '#f0476d', bg: 'rgba(240,71,109,0.12)',  icon: '🔴' },
  medium: { label: 'Orta',   color: '#f5a623', bg: 'rgba(245,166,35,0.12)',  icon: '🟡' },
  low:    { label: 'Düşük',  color: '#2ed8a8', bg: 'rgba(46,216,168,0.12)',  icon: '🟢' },
};

export const SORT_OPTIONS = [
  { value: 'created_desc', label: 'En Yeni' },
  { value: 'created_asc',  label: 'En Eski' },
  { value: 'priority',     label: 'Öncelik' },
  { value: 'due_date',     label: 'Son Tarih' },
  { value: 'alpha',        label: 'A → Z' },
];

export function createTask({ text, priority = 'medium', categoryId = 'personal', dueDate = null, notes = '' }) {
  return {
    id:          Date.now().toString(36) + Math.random().toString(36).slice(2),
    text:        text.trim().slice(0, 200),
    priority,
    categoryId,
    completed:   false,
    dueDate,
    notes,
    createdAt:   Date.now(),
    completedAt: null,
    order:       Date.now(),
  };
}

export function loadTasks() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}

export function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function getDueStatus(dueDate) {
  if (!dueDate) return null;
  const diff = Math.floor((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
  if (diff < 0)   return 'overdue';
  if (diff === 0) return 'today';
  if (diff === 1) return 'tomorrow';
  if (diff <= 7)  return 'soon';
  return 'future';
}

export const DUE_STATUS_CONFIG = {
  overdue:  { label: 'Gecikmiş!', cls: 'due-overdue', icon: '⚠️' },
  today:    { label: 'Bugün',     cls: 'due-today',   icon: '🔔' },
  tomorrow: { label: 'Yarın',     cls: 'due-soon',    icon: '⏰' },
  soon:     { label: 'Bu hafta',  cls: 'due-soon',    icon: '📆' },
  future:   { label: '',          cls: 'due-future',  icon: '📆' },
};

export function sortTasks(tasks, sortBy) {
  const pOrder = { high: 0, medium: 1, low: 2 };
  return [...tasks].sort((a, b) => {
    switch (sortBy) {
      case 'priority':    return pOrder[a.priority] - pOrder[b.priority];
      case 'alpha':       return a.text.localeCompare(b.text, 'tr');
      case 'created_asc': return a.createdAt - b.createdAt;
      case 'due_date': {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      default: return b.createdAt - a.createdAt;
    }
  });
}
