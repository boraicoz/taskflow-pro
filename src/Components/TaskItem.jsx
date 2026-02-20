/**
 * TaskItem — Zengin görev kartı
 * Tamamlama, düzenleme, silme, not görüntüleme, öncelik/kategori badge, due date
 */
import { useState, useRef } from 'react';
import { PRIORITY_CONFIG, getDueStatus, DUE_STATUS_CONFIG } from '../Interfaces/Task';
import { getCategoryById } from '../Interfaces/Category';
import { triggerConfetti } from './Confetti';

function highlightText(text, query) {
  if (!query) return <span>{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{text}</span>;
  return (
    <span>
      {text.slice(0, idx)}
      <mark className="highlight">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </span>
  );
}

export default function TaskItem({
  task, searchQuery, onToggle, onDelete, onUpdate,
  onDragStart, onDragOver, onDrop, isDragging, isDragOver,
  selected, onSelect,
}) {
  const [editing,   setEditing]   = useState(false);
  const [editText,  setEditText]  = useState(task.text);
  const [showNotes, setShowNotes] = useState(false);
  const [editNotes, setEditNotes] = useState(task.notes || '');
  const checkRef = useRef(null);

  const priorityCfg = PRIORITY_CONFIG[task.priority];
  const category    = getCategoryById(task.categoryId);
  const dueStatus   = getDueStatus(task.dueDate);
  const dueCfg      = dueStatus ? DUE_STATUS_CONFIG[dueStatus] : null;

  function handleToggle(e) {
    if (!task.completed) {
      // Konfeti tetikle
      const rect = checkRef.current?.getBoundingClientRect();
      if (rect) triggerConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
    onToggle(task.id);
  }

  function saveEdit() {
    if (editText.trim() && editText !== task.text) {
      onUpdate(task.id, { text: editText.trim(), notes: editNotes });
    } else {
      onUpdate(task.id, { notes: editNotes });
    }
    setEditing(false);
  }

  function formatDueDate(d) {
    return new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
  }

  return (
    <div
      draggable
      onDragStart={() => onDragStart(task.id)}
      onDragOver={e => { e.preventDefault(); onDragOver(task.id); }}
      onDrop={() => onDrop(task.id)}
      className={`task-card anim-fade-up
        ${task.priority === 'high'   ? 'pri-high'   : ''}
        ${task.priority === 'medium' ? 'pri-medium' : ''}
        ${task.priority === 'low'    ? 'pri-low'    : ''}
        ${task.completed ? 'completed-card' : ''}
        ${isDragging   ? 'dragging'   : ''}
        ${isDragOver   ? 'drag-over'  : ''}
      `}
      style={{ outline: selected ? '2px solid rgba(124,112,240,0.5)' : 'none' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 18px' }}>
        {/* Drag handle */}
        <div className="drag-handle" style={{ marginTop: 1 }}>
          <svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor">
            <circle cx="4" cy="3" r="1.5"/><circle cx="8" cy="3" r="1.5"/>
            <circle cx="4" cy="8" r="1.5"/><circle cx="8" cy="8" r="1.5"/>
            <circle cx="4" cy="13" r="1.5"/><circle cx="8" cy="13" r="1.5"/>
          </svg>
        </div>

        {/* Checkbox */}
        <div style={{ position: 'relative', flexShrink: 0, marginTop: 2 }}>
          <input
            ref={checkRef}
            type="checkbox"
            checked={task.completed}
            onChange={handleToggle}
            className="custom-check"
          />
        </div>

        {/* İçerik */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {editing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input
                autoFocus
                value={editText}
                maxLength={200}
                onChange={e => setEditText(e.target.value)}
                onBlur={saveEdit}
                onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') { setEditing(false); setEditText(task.text); } }}
                className="tf-input"
                style={{ fontSize: 14, padding: '8px 12px' }}
              />
              <textarea
                value={editNotes}
                onChange={e => setEditNotes(e.target.value)}
                placeholder="Not ekle..."
                rows={2}
                className="notes-area"
                style={{ fontSize: 12 }}
              />
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn-amber" onClick={saveEdit} style={{ padding: '6px 14px', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>Kaydet</button>
                <button className="icon-btn" onClick={() => { setEditing(false); setEditText(task.text); }} style={{ padding: '6px 12px', borderRadius: 8, fontSize: 12 }}>İptal</button>
              </div>
            </div>
          ) : (
            <>
              {/* Görev metni */}
              <p style={{
                fontSize: 14,
                fontWeight: 500,
                color: task.completed ? '#4a4a58' : '#f0f0ee',
                textDecoration: task.completed ? 'line-through' : 'none',
                marginBottom: 8,
                lineHeight: 1.5,
                wordBreak: 'break-word',
              }}>
                {highlightText(task.text, searchQuery)}
              </p>

              {/* Meta satırı: kategori, öncelik, due date */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6 }}>
                {/* Kategori */}
                <span className="cat-pill" style={{
                  color: category.color,
                  background: category.bg,
                  borderColor: `${category.color}30`,
                  fontSize: 10, padding: '3px 8px',
                  cursor: 'default',
                }}>
                  {category.icon} {category.label}
                </span>

                {/* Öncelik */}
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '3px 8px',
                  borderRadius: 100, fontFamily: '"Plus Jakarta Sans", sans-serif',
                  color: priorityCfg.color, background: priorityCfg.bg,
                  letterSpacing: 0.3,
                }}>
                  {priorityCfg.icon} {priorityCfg.label}
                </span>

                {/* Due date */}
                {task.dueDate && dueCfg && (
                  <span className={`${dueCfg.cls}`} style={{
                    fontSize: 11, fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: 3,
                  }}>
                    {dueCfg.icon} {dueStatus === 'future' ? formatDueDate(task.dueDate) : dueCfg.label}
                  </span>
                )}

                {/* Not ikonu */}
                {task.notes && (
                  <button
                    onClick={() => setShowNotes(!showNotes)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#4a4a58', fontFamily: 'inherit' }}
                    title="Notu göster"
                  >
                    {showNotes ? '📄 Gizle' : '📝 Not'}
                  </button>
                )}
              </div>

              {/* Not görüntüleme */}
              {showNotes && task.notes && (
                <div className="anim-slide-down" style={{
                  marginTop: 10, padding: '10px 12px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border)',
                  borderRadius: 10, fontSize: 12,
                  color: '#6a6a7a', lineHeight: 1.6,
                }}>
                  {task.notes}
                </div>
              )}
            </>
          )}
        </div>

        {/* Aksiyon butonları */}
        {!editing && (
          <div style={{ display: 'flex', gap: 6, flexShrink: 0, opacity: 0, transition: 'opacity 0.18s' }} className="task-actions">
            <button onClick={() => { setEditing(true); setShowNotes(false); }} className="icon-btn accent" style={{ width: 30, height: 30, fontSize: 13, borderRadius: 8 }} title="Düzenle">✏️</button>
            <button onClick={() => onDelete(task.id)} className="icon-btn danger" style={{ width: 30, height: 30, fontSize: 13, borderRadius: 8 }} title="Sil">🗑</button>
          </div>
        )}
      </div>
    </div>
  );
}
