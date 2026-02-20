/**
 * Dashboard — Ana sayfa
 * Tüm state yönetimi, CRUD işlemleri, drag-drop, arama, bulk ops
 */
import { useState, useCallback, useMemo } from 'react';
import { createTask, loadTasks, saveTasks, getDueStatus, sortTasks } from '../Interfaces/Task';
import Header       from '../Components/Header';
import StatsPanel   from '../Components/StatsPanel';
import CategoryBar  from '../Components/CategoryBar';
import AddForm      from '../Components/AddForm';
import SortBar      from '../Components/SortBar';
import TaskItem     from '../Components/TaskItem';
import EmptyState   from '../Components/EmptyState';
import { ToastContainer, useToast } from '../Components/Toast';

export default function Dashboard() {
  const [tasks,        setTasks]        = useState(loadTasks);
  const [search,       setSearch]       = useState('');
  const [category,     setCategory]     = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy,       setSortBy]       = useState('created_desc');
  const [formOpen,     setFormOpen]     = useState(false);
  const [selected,     setSelected]     = useState(new Set());
  const [dragId,       setDragId]       = useState(null);
  const [dragOverId,   setDragOverId]   = useState(null);

  const { toasts, show: notify } = useToast();

  // ── Persist ────────────────────────────────────────────
  function update(updated) {
    setTasks(updated);
    saveTasks(updated);
  }

  // ── CREATE ─────────────────────────────────────────────
  const handleAdd = useCallback(({ text, priority, categoryId, dueDate, notes }) => {
    const t = createTask({ text, priority, categoryId, dueDate, notes });
    const next = [t, ...tasks];
    update(next);
    notify(`Görev eklendi!`, { icon: '✦', type: 'success' });
  }, [tasks]);

  // ── UPDATE: toggle tamamlama ───────────────────────────
  const handleToggle = useCallback((id) => {
    const next = tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed, completedAt: !t.completed ? Date.now() : null } : t
    );
    update(next);
    const task = next.find(t => t.id === id);
    notify(task.completed ? 'Tamamlandı! 🎉' : 'Yeniden açıldı', {
      icon: task.completed ? '✅' : '↩',
      type: task.completed ? 'success' : 'default',
    });
  }, [tasks]);

  // ── UPDATE: metin/not ──────────────────────────────────
  const handleUpdate = useCallback((id, fields) => {
    update(tasks.map(t => t.id === id ? { ...t, ...fields } : t));
    notify('Güncellendi', { icon: '✏️' });
  }, [tasks]);

  // ── DELETE ─────────────────────────────────────────────
  const handleDelete = useCallback((id) => {
    update(tasks.filter(t => t.id !== id));
    setSelected(prev => { const n = new Set(prev); n.delete(id); return n; });
    notify('Görev silindi', { icon: '🗑', type: 'danger' });
  }, [tasks]);

  // ── BULK işlemler ──────────────────────────────────────
  function bulkComplete() {
    const ids = selected;
    update(tasks.map(t => ids.has(t.id) ? { ...t, completed: true, completedAt: Date.now() } : t));
    notify(`${ids.size} görev tamamlandı!`, { icon: '✅', type: 'success' });
    setSelected(new Set());
  }
  function bulkDelete() {
    const ids = selected;
    update(tasks.filter(t => !ids.has(t.id)));
    notify(`${ids.size} görev silindi`, { icon: '🗑', type: 'danger' });
    setSelected(new Set());
  }
  function selectAll() {
    setSelected(new Set(filtered.map(t => t.id)));
  }

  // ── DRAG & DROP ────────────────────────────────────────
  function handleDragStart(id) { setDragId(id); }
  function handleDragOver(id)  { setDragOverId(id); }
  function handleDrop(targetId) {
    if (!dragId || dragId === targetId) { setDragId(null); setDragOverId(null); return; }
    const arr  = [...tasks];
    const from = arr.findIndex(t => t.id === dragId);
    const to   = arr.findIndex(t => t.id === targetId);
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
    update(arr);
    setDragId(null);
    setDragOverId(null);
  }

  // ── Temizle ────────────────────────────────────────────
  function clearCompleted() {
    const count = tasks.filter(t => t.completed).length;
    if (!count) return;
    update(tasks.filter(t => !t.completed));
    notify(`${count} tamamlanan silindi`, { icon: '🧹' });
  }

  // ── Filtrelenmiş + sıralanmış liste ───────────────────
  const filtered = useMemo(() => {
    let list = tasks;

    // Kategori filtresi
    if (category !== 'all') list = list.filter(t => t.categoryId === category);

    // Durum filtresi
    if (filterStatus === 'active')    list = list.filter(t => !t.completed);
    if (filterStatus === 'completed') list = list.filter(t => t.completed);
    if (filterStatus === 'overdue')   list = list.filter(t => !t.completed && getDueStatus(t.dueDate) === 'overdue');

    // Arama
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t => t.text.toLowerCase().includes(q) || (t.notes || '').toLowerCase().includes(q));
    }

    return sortTasks(list, sortBy);
  }, [tasks, category, filterStatus, search, sortBy]);

  const completed  = tasks.filter(t => t.completed).length;
  const hasCompleted = tasks.some(t => t.completed);

  return (
    <>
      {/* Arka plan orb'ları */}
      <div className="orb orb-1"/>
      <div className="orb orb-2"/>
      <div className="orb orb-3"/>

      {/* Ana container */}
      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: 700,
        margin: '0 auto',
        padding: '48px 20px 120px',
      }}>
        {/* Header */}
        <Header
          search={search}
          onSearch={setSearch}
          totalCount={tasks.length}
          completedCount={completed}
        />

        {/* Stats Panel */}
        {tasks.length > 0 && (
          <StatsPanel tasks={tasks} />
        )}

        {/* Category Bar */}
        <CategoryBar
          selected={category}
          onChange={setCategory}
          tasks={tasks}
        />

        {/* Add Form */}
        <AddForm
          onAdd={handleAdd}
          isOpen={formOpen}
          setIsOpen={setFormOpen}
        />

        {/* Sort & Filter Bar */}
        {tasks.length > 0 && (
          <SortBar
            sortBy={sortBy}
            onSortChange={setSortBy}
            filterStatus={filterStatus}
            onFilterStatusChange={setFilterStatus}
            resultCount={filtered.length}
            totalVisible={filtered.length}
            selectedCount={selected.size}
            onBulkComplete={bulkComplete}
            onBulkDelete={bulkDelete}
            onSelectAll={selectAll}
            onClearSelection={() => setSelected(new Set())}
          />
        )}

        {/* Task List */}
        {filtered.length === 0 ? (
          <EmptyState filter={filterStatus} search={search} category={category} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map((task, i) => (
              <div
                key={task.id}
                className={`delay-${Math.min(i + 1, 6)}`}
                onClick={e => {
                  // Ctrl/Cmd + tıklama ile seçme
                  if (e.ctrlKey || e.metaKey) {
                    setSelected(prev => {
                      const n = new Set(prev);
                      n.has(task.id) ? n.delete(task.id) : n.add(task.id);
                      return n;
                    });
                  }
                }}
              >
                <TaskItem
                  task={task}
                  searchQuery={search}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  isDragging={dragId === task.id}
                  isDragOver={dragOverId === task.id}
                  selected={selected.has(task.id)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {hasCompleted && (
          <div className="anim-fade-up" style={{
            marginTop: 24,
            display: 'flex',
            justifyContent: 'center',
          }}>
            <button
              onClick={clearCompleted}
              style={{
                background: 'rgba(240,71,109,0.08)',
                border: '1px solid rgba(240,71,109,0.2)',
                borderRadius: 10, padding: '8px 20px',
                color: '#f0476d', fontSize: 12, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.18s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(240,71,109,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(240,71,109,0.08)'}
            >
              🧹 Tamamlananları Temizle ({completed})
            </button>
          </div>
        )}

        {/* Ctrl+Tıklama ipucu */}
        {tasks.length > 0 && selected.size === 0 && (
          <p style={{
            textAlign: 'center', marginTop: 20,
            fontSize: 11, color: '#2a2a35',
            fontWeight: 500,
          }}>
            Ctrl + tıklama ile çoklu seçim · Sürükle-bırak ile sıralama
          </p>
        )}
      </div>

      {/* Toast container */}
      <ToastContainer toasts={toasts} />
    </>
  );
}
