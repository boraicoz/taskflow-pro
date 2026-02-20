/**
 * Header — Arama çubuğu, başlık ve kısayol ipuçları
 */
import { useRef, useEffect } from 'react';

export default function Header({ search, onSearch, totalCount, completedCount }) {
  const inputRef = useRef(null);

  // Klavye kısayolu: "/" tuşuyla arama kutusuna odaklan
  useEffect(() => {
    function onKey(e) {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') inputRef.current?.blur();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const pct = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <header style={{ marginBottom: 40 }} className="anim-fade-up">
      {/* Logo satırı */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            {/* Logo ikonu */}
            <div style={{
              width: 38, height: 38,
              background: 'linear-gradient(135deg, #f5a623, #fdd68a)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
              boxShadow: '0 4px 20px rgba(245,166,35,0.35)',
              flexShrink: 0,
            }}>
              ✦
            </div>
            <h1 style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 28,
              fontWeight: 900,
              color: '#f0f0ee',
              letterSpacing: '-0.5px',
              lineHeight: 1,
            }}>
              Task<span className="shimmer-text">Flow</span>
            </h1>
          </div>
          <p style={{ color: '#4a4a58', fontSize: 13, fontWeight: 400 }}>
            {new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>

        {/* Sağ: tamamlanma badge + kısayol */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
          <div style={{
            background: 'rgba(245,166,35,0.1)',
            border: '1px solid rgba(245,166,35,0.2)',
            borderRadius: 100,
            padding: '6px 14px',
            fontSize: 12,
            fontWeight: 600,
            color: '#f5a623',
          }}>
            {completedCount}/{totalCount} tamamlandı
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#4a4a58' }}>Arama:</span>
            <kbd>/</kbd>
            <span style={{ fontSize: 11, color: '#4a4a58' }}>Yeni:</span>
            <kbd>N</kbd>
          </div>
        </div>
      </div>

      {/* Arama kutusu */}
      <div style={{ position: 'relative' }}>
        <span style={{
          position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
          fontSize: 16, color: '#4a4a58', pointerEvents: 'none',
        }}>🔍</span>
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder="Görev ara... ( / )"
          className="tf-input"
          style={{ width: '100%', paddingLeft: 44, paddingRight: search ? 44 : 16, fontSize: 15 }}
        />
        {search && (
          <button
            onClick={() => onSearch('')}
            style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', color: '#6a6a7a', cursor: 'pointer',
              fontSize: 18, lineHeight: 1, padding: 4,
            }}
          >×</button>
        )}
      </div>
    </header>
  );
}
