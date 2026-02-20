/**
 * CategoryBar — Kategori filtresi ve görev sayıları
 */
import { CATEGORIES } from '../Interfaces/Category';

export default function CategoryBar({ selected, onChange, tasks }) {
  const counts = tasks.reduce((acc, t) => {
    acc[t.categoryId] = (acc[t.categoryId] || 0) + 1;
    return acc;
  }, {});

  const allCount = tasks.length;

  const all = { id: 'all', label: 'Tümü', icon: '✦', color: '#f5a623', bg: 'rgba(245,166,35,0.12)' };
  const items = [all, ...CATEGORIES];

  return (
    <div className="anim-fade-up delay-2" style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
        {items.map(cat => {
          const count  = cat.id === 'all' ? allCount : (counts[cat.id] || 0);
          const active = selected === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onChange(cat.id)}
              className="cat-pill"
              style={{
                color:      active ? cat.color : '#6a6a7a',
                background: active ? cat.bg    : 'transparent',
                borderColor: active ? `${cat.color}40` : 'var(--border)',
                fontWeight: active ? 700 : 500,
                transform:  active ? 'scale(1.04)' : 'scale(1)',
                boxShadow:  active ? `0 0 16px ${cat.color}20` : 'none',
              }}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              {count > 0 && (
                <span style={{
                  background: active ? `${cat.color}30` : 'rgba(255,255,255,0.06)',
                  color: active ? cat.color : '#4a4a58',
                  borderRadius: 100,
                  padding: '1px 7px',
                  fontSize: 10,
                  fontWeight: 700,
                }}>{count}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
