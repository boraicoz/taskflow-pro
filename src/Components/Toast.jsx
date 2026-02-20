/**
 * Toast — Animasyonlu bildirim sistemi
 * Birden fazla bildirimi aynı anda gösterebilir.
 */
import { useState, useCallback, useRef } from 'react';

export function useToast() {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const show = useCallback((msg, { icon = '✓', type = 'default', duration = 2800 } = {}) => {
    const id = ++idRef.current;
    setToasts(prev => [...prev, { id, msg, icon, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  return { toasts, show };
}

const TYPE_COLORS = {
  default: '#f5a623',
  success: '#2ed8a8',
  danger:  '#f0476d',
  info:    '#7c70f0',
};

export function ToastContainer({ toasts }) {
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 10, zIndex: 9997, maxWidth: 320 }}>
      {toasts.map((t) => (
        <div key={t.id} className="anim-toast" style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'rgba(19,19,24,0.95)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${TYPE_COLORS[t.type] || TYPE_COLORS.default}30`,
          borderLeft: `3px solid ${TYPE_COLORS[t.type] || TYPE_COLORS.default}`,
          borderRadius: 14,
          padding: '14px 18px',
          boxShadow: `0 8px 40px rgba(0,0,0,0.5), 0 0 20px ${TYPE_COLORS[t.type] || TYPE_COLORS.default}15`,
          color: '#f0f0ee',
          fontSize: 14,
          fontWeight: 500,
          fontFamily: '"Plus Jakarta Sans", sans-serif',
        }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>{t.icon}</span>
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}
