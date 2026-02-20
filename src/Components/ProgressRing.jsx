/**
 * ProgressRing — SVG animasyonlu ilerleme halkası
 */
export default function ProgressRing({ size = 120, strokeWidth = 8, progress = 0, label, sublabel, color = '#f5a623' }) {
  const r  = (size - strokeWidth * 2) / 2;
  const c  = 2 * Math.PI * r;
  const offset = c - (progress / 100) * c;

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          className="ring-track"
          cx={size/2} cy={size/2} r={r}
          strokeWidth={strokeWidth}
          stroke="rgba(255,255,255,0.05)"
        />
        <circle
          className="ring-progress"
          cx={size/2} cy={size/2} r={r}
          strokeWidth={strokeWidth}
          stroke={color}
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ filter: `drop-shadow(0 0 6px ${color}60)` }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 2,
      }}>
        <span style={{ fontFamily: '"Playfair Display", serif', fontSize: size * 0.22, fontWeight: 700, color: '#f0f0ee', lineHeight: 1 }}>
          {Math.round(progress)}%
        </span>
        {label && <span style={{ fontSize: 10, color: '#6a6a7a', fontWeight: 500, textAlign: 'center', maxWidth: size * 0.6 }}>{label}</span>}
      </div>
    </div>
  );
}
