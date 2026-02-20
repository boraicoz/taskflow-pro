/**
 * StatsPanel — İstatistik panosu: ilerleme halkası, streak, kategori dağılımı
 */
import ProgressRing from './ProgressRing';
import { getCategoryById } from '../Interfaces/Category';
import { getDueStatus } from '../Interfaces/Task';

export default function StatsPanel({ tasks }) {
  const total     = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const overdue   = tasks.filter(t => !t.completed && getDueStatus(t.dueDate) === 'overdue').length;
  const active    = total - completed;
  const pct       = total ? Math.round((completed / total) * 100) : 0;

  // Kategori sayımları
  const catCounts = tasks.reduce((acc, t) => {
    acc[t.categoryId] = (acc[t.categoryId] || 0) + 1;
    return acc;
  }, {});

  // Streak hesaplama (bugün tamamlanan varsa streak 1+)
  const todayDone = tasks.filter(t => {
    if (!t.completedAt) return false;
    const d = new Date(t.completedAt);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  const stats = [
    { label: 'Aktif',     value: active,    color: '#7c70f0', icon: '⚡' },
    { label: 'Gecikmiş',  value: overdue,   color: '#f0476d', icon: '⚠️' },
    { label: 'Bugün ✓',   value: todayDone, color: '#2ed8a8', icon: '🎯' },
    { label: 'Toplam',    value: total,     color: '#f5a623', icon: '📋' },
  ];

  return (
    <div className="anim-fade-up delay-1" style={{ marginBottom: 32 }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gap: 20,
        background: 'var(--s1)',
        border: '1px solid var(--border)',
        borderRadius: 22,
        padding: 24,
      }}>
        {/* Sol: Progress Ring */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <ProgressRing size={110} strokeWidth={9} progress={pct} color="#f5a623" />
          <span style={{ fontSize: 11, color: '#4a4a58', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
            Tamamlanma
          </span>
        </div>

        {/* Sağ: mini stat kartları */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {stats.map(s => (
            <div key={s.label} className="stat-card" style={{ padding: '14px 16px' }}>
              <div style={{ fontSize: 18, marginBottom: 6 }}>{s.icon}</div>
              <div style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: 28,
                fontWeight: 700,
                color: s.color,
                lineHeight: 1,
                marginBottom: 4,
              }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#4a4a58', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kategori barları */}
      {Object.keys(catCounts).length > 0 && (
        <div style={{
          marginTop: 12,
          background: 'var(--s1)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: '16px 20px',
        }}>
          <p style={{ fontSize: 11, color: '#4a4a58', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
            Kategori Dağılımı
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Object.entries(catCounts)
              .sort(([,a],[,b]) => b-a)
              .slice(0,4)
              .map(([catId, count]) => {
                const cat = getCategoryById(catId);
                const barPct = total ? (count / total) * 100 : 0;
                return (
                  <div key={catId}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: '#f0f0ee', fontWeight: 500 }}>
                        {cat.icon} {cat.label}
                      </span>
                      <span style={{ fontSize: 12, color: '#4a4a58' }}>{count}</span>
                    </div>
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${barPct}%`,
                        background: cat.color,
                        borderRadius: 4,
                        transition: 'width 0.6s ease',
                        boxShadow: `0 0 8px ${cat.color}60`,
                      }}/>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
