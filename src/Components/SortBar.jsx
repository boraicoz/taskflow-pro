/**
 * SortBar — Sıralama, filtre ve toplu işlem araç çubuğu
 */
import { SORT_OPTIONS } from '../Interfaces/Task';

export default function SortBar({
  sortBy, onSortChange,
  filterStatus, onFilterStatusChange,
  resultCount, totalVisible,
  selectedCount, onBulkComplete, onBulkDelete, onSelectAll, onClearSelection,
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
      {/* Üst satır: durum filtresi + sıralama */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {/* Durum filtreleri */}
        {[
          { v: 'all',       l: 'Tümü' },
          { v: 'active',    l: 'Aktif' },
          { v: 'completed', l: 'Tamamlanan' },
          { v: 'overdue',   l: '⚠️ Gecikmiş' },
        ].map(f => (
          <button
            key={f.v}
            onClick={() => onFilterStatusChange(f.v)}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              border: `1px solid ${filterStatus === f.v ? 'rgba(245,166,35,0.4)' : 'var(--border)'}`,
              background: filterStatus === f.v ? 'rgba(245,166,35,0.1)' : 'transparent',
              color: filterStatus === f.v ? '#f5a623' : '#4a4a58',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              transition: 'all 0.18s',
              whiteSpace: 'nowrap',
            }}
          >{f.l}</button>
        ))}

        {/* Ayraç */}
        <div style={{ flex: 1 }} />

        {/* Sıralama */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: '#4a4a58', whiteSpace: 'nowrap' }}>Sırala:</span>
          <select
            value={sortBy}
            onChange={e => onSortChange(e.target.value)}
            className="tf-input tf-select"
            style={{ padding: '6px 28px 6px 10px', fontSize: 12, borderRadius: 8, minWidth: 100 }}
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* Alt satır: sonuç sayısı + toplu işlem */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 11, color: '#4a4a58', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>
          {resultCount} görev
        </span>

        <div style={{ flex: 1 }} />

        {selectedCount > 0 ? (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#7c70f0', fontWeight: 600 }}>{selectedCount} seçili</span>
            <button onClick={onBulkComplete} className="icon-btn accent" style={{ padding: '4px 10px', fontSize: 11, borderRadius: 7 }}>✓ Tamamla</button>
            <button onClick={onBulkDelete}   className="icon-btn danger"  style={{ padding: '4px 10px', fontSize: 11, borderRadius: 7 }}>🗑 Sil</button>
            <button onClick={onClearSelection} className="icon-btn" style={{ padding: '4px 10px', fontSize: 11, borderRadius: 7 }}>Seçimi temizle</button>
          </div>
        ) : totalVisible > 0 ? (
          <button onClick={onSelectAll} style={{
            background: 'none', border: 'none', color: '#4a4a58', cursor: 'pointer',
            fontSize: 12, fontFamily: 'inherit', fontWeight: 500,
          }}>Tümünü seç</button>
        ) : null}
      </div>
    </div>
  );
}
