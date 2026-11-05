import React, { useState, useMemo } from 'react';
import CardItem from '../components/CardItem';
import MEMBERS from '../members';

const ALL_GENS = [...new Set(MEMBERS.map((m) => m.generasi))].sort();
const ALL_RARITIES = ['N', 'R', 'SR', 'SSR'];

export default function CollectionPage({ state }) {
  const [filterRarity, setFilterRarity] = useState('Semua');
  const [filterGen, setFilterGen] = useState('Semua');
  const [search, setSearch] = useState('');

  const ownedCount = Object.keys(state.koleksi).length;
  const totalCount = MEMBERS.length;

  const filtered = useMemo(() => {
    return MEMBERS.filter((m) => {
      const matchRarity = filterRarity === 'Semua' || m.rarity === filterRarity;
      const matchGen = filterGen === 'Semua' || m.generasi === filterGen;
      const matchSearch = m.nama.toLowerCase().includes(search.toLowerCase());
      return matchRarity && matchGen && matchSearch;
    });
  }, [filterRarity, filterGen, search]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-white font-black text-2xl">📚 Koleksi</h2>
          <p className="text-gray-400 text-sm mt-0.5">
            Progres: <span className="text-white font-bold">{ownedCount}</span>
            <span className="text-gray-500">/{totalCount}</span> member
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full sm:w-48">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Dimiliki</span>
            <span>{Math.round((ownedCount / totalCount) * 100)}%</span>
          </div>
          <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full transition-all duration-500"
              style={{ width: `${(ownedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <input
          type="text"
          placeholder="🔍 Cari nama member..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-red-500"
        />

        {/* Filter Rarity */}
        <select
          value={filterRarity}
          onChange={(e) => setFilterRarity(e.target.value)}
          className="bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
        >
          <option>Semua</option>
          {ALL_RARITIES.map((r) => <option key={r}>{r}</option>)}
        </select>

        {/* Filter Generasi */}
        <select
          value={filterGen}
          onChange={(e) => setFilterGen(e.target.value)}
          className="bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
        >
          <option>Semua</option>
          {ALL_GENS.map((g) => <option key={g}>{g}</option>)}
        </select>
      </div>

      {/* Legend Rarity */}
      <div className="flex flex-wrap gap-2">
        {[
          { r: 'N', cls: 'border-gray-500 text-gray-400' },
          { r: 'R', cls: 'border-blue-500 text-blue-400' },
          { r: 'SR', cls: 'border-purple-500 text-purple-400' },
          { r: 'SSR', cls: 'border-yellow-400 text-yellow-400' },
        ].map(({ r, cls }) => {
          const owned = MEMBERS.filter((m) => m.rarity === r && state.koleksi[m.id]).length;
          const total = MEMBERS.filter((m) => m.rarity === r).length;
          return (
            <span key={r} className={`border rounded px-2 py-0.5 text-xs font-bold ${cls}`}>
              {r} {owned}/{total}
            </span>
          );
        })}
      </div>

      {/* Grid Kartu */}
      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center py-12">Tidak ada member yang cocok.</p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {filtered.map((member) => {
            const owned = state.koleksi[member.id];
            return (
              <CardItem
                key={member.id}
                member={member}
                count={owned ? owned.count : 1}
                silhouette={!owned}
                small
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
