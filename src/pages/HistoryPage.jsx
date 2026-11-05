import React, { useState } from 'react';
import CardItem from '../components/CardItem';
import { RARITY_REWARD } from '../hooks/useGameStore';

function formatTime(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

const RARITY_BADGE = {
  SSR:       { cls: 'bg-yellow-500 text-yellow-950',        label: '✨ SSR' },
  LEGENDARY: { cls: 'bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white', label: '✦ Legendary' },
  SR:        { cls: 'bg-purple-700 text-purple-100',        label: 'SR' },
  FREE_SPIN: { cls: 'bg-pink-800 text-pink-200',            label: '🎟 Free Spin' },
};

function HistoryEntry({ entry }) {
  const [open, setOpen] = useState(true);

  // Hitung badge per rarity
  const badges = Object.entries(RARITY_BADGE).reduce((acc, [rarity, cfg]) => {
    const count = entry.results.filter((m) => m.rarity === rarity).length;
    if (count > 0) acc.push({ ...cfg, count, rarity });
    return acc;
  }, []);

  const totalKoin = entry.results.reduce((sum, m) => sum + (RARITY_REWARD[m.rarity] ?? 0), 0);

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      {/* Header sesi — klik untuk collapse/expand */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-800/60 border-b border-gray-700 hover:bg-gray-800/80 transition text-left"
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-white font-semibold text-sm">
            Gacha x{entry.results.length}
          </span>
          {badges.map(({ cls, label, count, rarity }) => (
            <span key={rarity} className={`text-xs font-bold px-1.5 py-0.5 rounded ${cls}`}>
              {count > 1 ? `${count}× ` : ''}{label}
            </span>
          ))}
          {totalKoin > 0 && (
            <span className="text-yellow-400 text-xs font-semibold">
              +{totalKoin.toLocaleString()} 🪙
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          <span className="text-gray-500 text-xs hidden sm:block">{formatTime(entry.timestamp)}</span>
          <span className="text-gray-400 text-xs">{open ? '▲' : '▼'}</span>
        </div>
      </button>
      <span className="text-gray-600 text-xs px-4 pb-1 block sm:hidden">{formatTime(entry.timestamp)}</span>

      {/* Grid kartu — 5 kolom, rapi */}
      {open && (
        <div className="p-3">
          <div className="grid grid-cols-5 gap-2">
            {entry.results.map((member, i) => (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <CardItem member={member} small />
                <span
                  className="text-yellow-400 leading-tight text-center w-full truncate"
                  style={{ fontSize: '0.55rem', fontWeight: 700 }}
                >
                  {member.rarity === 'FREE_SPIN'
                    ? '🎟'
                    : `+${(RARITY_REWARD[member.rarity] ?? 0).toLocaleString()}🪙`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function HistoryPage({ state }) {
  const { riwayat } = state;

  if (riwayat.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-5xl mb-4">📋</p>
        <p className="text-gray-400 text-lg">Belum ada riwayat gacha.</p>
        <p className="text-gray-600 text-sm mt-2">Lakukan gacha untuk melihat hasilnya di sini.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-black text-2xl">📋 Riwayat Gacha</h2>
        <span className="text-gray-500 text-sm">{riwayat.length} sesi (maks. 50)</span>
      </div>

      <div className="space-y-3">
        {riwayat.map((entry) => (
          <HistoryEntry key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}
