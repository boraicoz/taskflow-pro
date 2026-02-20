# TaskFlow Pro ✦

React 18 + Vite + Tailwind CSS ile geliştirilmiş premium görev yönetim uygulaması.

## 📁 Yapı
```
src/
├── main.jsx
├── App.jsx
├── index.css              ← Tüm custom CSS, animasyonlar, design system
├── Components/
│   ├── AddForm.jsx        ← Zengin görev ekleme (kategori/öncelik/tarih/not)
│   ├── CategoryBar.jsx    ← Kategori filtresi pills
│   ├── Confetti.jsx       ← Konfeti efekti
│   ├── EmptyState.jsx     ← Bağlam-duyarlı boş ekran
│   ├── Header.jsx         ← Arama + logo + kısayollar
│   ├── ProgressRing.jsx   ← SVG ilerleme halkası
│   ├── SortBar.jsx        ← Sıralama + filtre + toplu işlem
│   ├── StatsPanel.jsx     ← İstatistik panosu
│   ├── TaskItem.jsx       ← Görev kartı
│   └── Toast.jsx          ← Bildirim sistemi
├── Interfaces/
│   ├── Task.js            ← Task modeli, CRUD yardımcıları
│   └── Category.js        ← Kategori tanımları
└── Pages/
    └── Dashboard.jsx      ← Ana sayfa, state yönetimi
```

## 🚀 Kurulum
```bash
npm install && npm run dev
```

## ☁️ Netlify
Build: `npm run build` | Publish: `dist`
