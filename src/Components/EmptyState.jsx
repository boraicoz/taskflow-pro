/**
 * EmptyState — Bağlam duyarlı boş durum ekranı
 */
export default function EmptyState({ filter, search, category }) {
  let icon, title, sub;

  if (search) {
    icon = '🔍'; title = `"${search}" için sonuç yok`; sub = 'Farklı bir kelime dene';
  } else if (filter === 'completed') {
    icon = '🎯'; title = 'Henüz tamamlanan yok'; sub = 'Bir görevi tamamladığında buraya gelir';
  } else if (filter === 'overdue') {
    icon = '🎉'; title = 'Gecikmiş görev yok!'; sub = 'Her şey yolunda görünüyor';
  } else if (filter === 'active') {
    icon = '✨'; title = 'Tüm görevler tamamlandı!'; sub = 'Harika iş — yeni bir şey ekle';
  } else {
    icon = '✦'; title = 'Henüz görev yok'; sub = 'İlk görevini eklemek için N\'ye bas';
  }

  return (
    <div className="anim-fade-up" style={{
      textAlign: 'center', padding: '60px 20px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
    }}>
      {/* SVG illüstrasyon */}
      <div style={{ marginBottom: 8 }}>
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="38" stroke="rgba(255,255,255,0.05)" strokeWidth="2"/>
          <circle cx="40" cy="40" r="28" stroke="rgba(245,166,35,0.08)" strokeWidth="2" strokeDasharray="4 4"/>
          <text x="40" y="50" textAnchor="middle" fontSize="26" fill="rgba(245,166,35,0.4)">{icon}</text>
        </svg>
      </div>
      <h3 style={{
        fontFamily: '"Playfair Display", serif',
        fontSize: 20, fontWeight: 700,
        color: 'rgba(240,240,238,0.4)',
      }}>{title}</h3>
      <p style={{ fontSize: 13, color: '#4a4a58' }}>{sub}</p>
    </div>
  );
}
