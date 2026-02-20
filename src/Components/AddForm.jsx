/**
 * AddForm — Zengin görev ekleme formu
 * Kategori, öncelik, son tarih ve not alanlarını içerir.
 * N kısayoluyla açılır.
 */
import { useState, useEffect, useRef } from 'react';
import { PRIORITY_CONFIG } from '../Interfaces/Task';
import { CATEGORIES } from '../Interfaces/Category';

export default function AddForm({ onAdd, onClose, isOpen, setIsOpen }) {
  const [text,       setText]       = useState('');
  const [priority,   setPriority]   = useState('medium');
  const [categoryId, setCategoryId] = useState('personal');
  const [dueDate,    setDueDate]    = useState('');
  const [notes,      setNotes]      = useState('');
  const [showMore,   setShowMore]   = useState(false);
  const inputRef = useRef(null);

  // "N" kısayolu
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'n' && !isOpen && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape' && isOpen) { setIsOpen(false); reset(); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 80);
  }, [isOpen]);

  function reset() {
    setText(''); setPriority('medium'); setCategoryId('personal');
    setDueDate(''); setNotes(''); setShowMore(false);
  }

  function handleAdd() {
    if (!text.trim()) { inputRef.current?.focus(); return; }
    onAdd({ text, priority, categoryId, dueDate: dueDate || null, notes });
    reset();
    setIsOpen(false);
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      {/* Trigger butonu */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="btn-amber anim-fade-up delay-3"
          style={{
            width: '100%', padding: '14px 20px',
            borderRadius: 14, fontSize: 15, marginBottom: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}
        >
          <span style={{ fontSize: 20, fontWeight: 300 }}>＋</span>
          Yeni Görev Ekle
          <kbd style={{ marginLeft: 'auto', background: 'rgba(0,0,0,0.2)', color: '#0a0a08', borderColor: 'rgba(0,0,0,0.2)' }}>N</kbd>
        </button>
      )}

      {/* Form paneli */}
      {isOpen && (
        <div className="anim-scale-in" style={{
          background: 'var(--s1)',
          border: '1px solid rgba(245,166,35,0.25)',
          borderRadius: 20,
          padding: 24,
          marginBottom: 24,
          boxShadow: '0 0 0 1px rgba(245,166,35,0.1), 0 20px 60px rgba(0,0,0,0.5)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <span style={{ fontFamily: '"Playfair Display", serif', fontSize: 17, fontWeight: 700, color: '#f0f0ee' }}>
              Yeni Görev
            </span>
            <button
              onClick={() => { setIsOpen(false); reset(); }}
              style={{ background: 'none', border: 'none', color: '#4a4a58', cursor: 'pointer', fontSize: 20, padding: '2px 6px' }}
            >×</button>
          </div>

          {/* Görev metni */}
          <textarea
            ref={inputRef}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAdd(); } }}
            placeholder="Ne yapman gerekiyor? (Enter ile ekle)"
            maxLength={200}
            rows={2}
            className="tf-input notes-area"
            style={{ fontSize: 15, marginBottom: 14, border: '1px solid var(--border2)' }}
          />

          {/* Öncelik + Kategori */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            {/* Öncelik */}
            <div>
              <label style={{ fontSize: 11, color: '#4a4a58', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', marginBottom: 6 }}>
                Öncelik
              </label>
              <div style={{ display: 'flex', gap: 6 }}>
                {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => setPriority(key)}
                    style={{
                      flex: 1, padding: '8px 4px',
                      borderRadius: 10,
                      border: `1px solid ${priority === key ? cfg.color + '60' : 'var(--border)'}`,
                      background: priority === key ? cfg.bg : 'transparent',
                      color: priority === key ? cfg.color : '#4a4a58',
                      cursor: 'pointer', fontSize: 11, fontWeight: 700,
                      transition: 'all 0.18s',
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                    }}
                  >{cfg.icon} {cfg.label}</button>
                ))}
              </div>
            </div>

            {/* Kategori */}
            <div>
              <label style={{ fontSize: 11, color: '#4a4a58', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', marginBottom: 6 }}>
                Kategori
              </label>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryId(cat.id)}
                    title={cat.label}
                    style={{
                      width: 32, height: 32,
                      borderRadius: 8,
                      border: `1px solid ${categoryId === cat.id ? cat.color + '60' : 'var(--border)'}`,
                      background: categoryId === cat.id ? cat.bg : 'transparent',
                      cursor: 'pointer', fontSize: 15,
                      transition: 'all 0.18s',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transform: categoryId === cat.id ? 'scale(1.1)' : 'scale(1)',
                    }}
                  >{cat.icon}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Daha fazla seçenek */}
          <button
            onClick={() => setShowMore(!showMore)}
            style={{ background: 'none', border: 'none', color: '#4a4a58', cursor: 'pointer', fontSize: 12, fontWeight: 600, marginBottom: 10, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <span style={{ transition: 'transform 0.2s', display: 'inline-block', transform: showMore ? 'rotate(90deg)' : 'none' }}>›</span>
            {showMore ? 'Daha az' : 'Son tarih ve not ekle'}
          </button>

          {showMore && (
            <div className="anim-slide-down" style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
              <div>
                <label style={{ fontSize: 11, color: '#4a4a58', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', marginBottom: 6 }}>Son Tarih</label>
                <input
                  type="date"
                  value={dueDate}
                  min={today}
                  onChange={e => setDueDate(e.target.value)}
                  className="tf-input"
                  style={{ width: '100%', colorScheme: 'dark' }}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#4a4a58', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', marginBottom: 6 }}>Not</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Ek detaylar..."
                  rows={2}
                  className="notes-area"
                  style={{ fontSize: 13 }}
                />
              </div>
            </div>
          )}

          {/* Ekle butonu */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={handleAdd}
              disabled={!text.trim()}
              className="btn-amber"
              style={{
                flex: 1, padding: '12px', borderRadius: 12, fontSize: 14,
                opacity: text.trim() ? 1 : 0.4,
                cursor: text.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              ＋ Görevi Ekle
            </button>
            <button
              onClick={() => { setIsOpen(false); reset(); }}
              className="icon-btn"
              style={{ padding: '12px 16px', fontSize: 13, borderRadius: 12 }}
            >İptal</button>
          </div>
        </div>
      )}
    </>
  );
}
