import React from 'react';

const NAV_ITEMS = [
  { id: 'gacha', label: 'Gacha' },
  { id: 'koleksi', label: 'Koleksi' },
  { id: 'riwayat', label: 'Riwayat' },
];

export default function Navbar({ activePage, onNavigate }) {
  return (
    <nav className="sticky top-0 z-50 bg-red-700/95 backdrop-blur border-b border-red-900 shadow-lg">
      <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
       <div className="flex items-center gap-2">
          <img
            src="https://telegra.ph/file/d62652f5f77305dee86d3.png"
            alt="Logo JMK48"
            className="w-8 h-10 object-contain"
          />
          <span className="text-white font-extrabold text-lg tracking-wide">
            JMK48 <span className="text-yellow-300">Gacha</span>
          </span>
        </div>

        {/* Menu */}
        <ul className="flex gap-1 sm:gap-2">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onNavigate(item.id)}
                className={`
                  px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200
                  ${activePage === item.id
                    ? 'bg-white text-red-700 shadow'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
