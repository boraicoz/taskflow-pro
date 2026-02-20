/**
 * Confetti — Görev tamamlandığında patlayan konfeti efekti
 */
import { useEffect, useRef } from 'react';

const COLORS = ['#f5a623','#fdd68a','#7c70f0','#2ed8a8','#f0476d','#38bdf8','#f472b6'];

export function triggerConfetti(x, y) {
  const count = 22;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-particle';
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const angle = (Math.random() * 360);
    const dist  = 30 + Math.random() * 80;
    const dx    = Math.cos(angle * Math.PI / 180) * dist;
    const dy    = Math.sin(angle * Math.PI / 180) * dist;
    const size  = 5 + Math.random() * 6;
    const delay = Math.random() * 0.1;
    el.style.cssText = `
      left: ${x}px; top: ${y}px;
      width: ${size}px; height: ${size}px;
      background: ${color};
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      animation-delay: ${delay}s;
      transform-origin: center;
    `;
    el.style.setProperty('--dx', `${dx}px`);
    el.style.setProperty('--dy', `${dy}px`);
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1200);
  }
}

export default function Confetti() { return null; }
