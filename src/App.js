import React, { useState, useCallback } from 'react';
import Navbar from './components/Navbar';
import GachaPage from './pages/GachaPage';
import CollectionPage from './pages/CollectionPage';
import HistoryPage from './pages/HistoryPage';
import { useGameStore } from './hooks/useGameStore';

function Footer() {
  return (
    <footer className="mt-12 border-t border-gray-800 py-6 px-4 text-center">
      <p className="text-gray-600 text-xs leading-relaxed max-w-xl mx-auto">
        Ini adalah <strong className="text-gray-500">fan project tidak resmi</strong> dan tidak berafiliasi dengan JKT48 atau manajemennya.
        Hanya untuk hiburan, tanpa transaksi uang sungguhan. Semua koin hanya bersifat virtual.
      </p>
      <p className="text-gray-700 text-xs mt-2">JMK48 Gacha · Fan Project</p>
    </footer>
  );
}

function ResetModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <h3 className="text-white font-bold text-lg mb-2">⚠️ Reset Data?</h3>
        <p className="text-gray-400 text-sm mb-6">
          Semua data (koin, koleksi, pity, riwayat) akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg font-bold transition"
          >
            Ya, Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState('gacha');
  const [showResetModal, setShowResetModal] = useState(false);
  const { state, claimDaily, isDailyAvailable, dailyCooldownSeconds, addGachaResults, resetData } = useGameStore();

  const handleGacha = useCallback((results, cost) => {
    addGachaResults(results, cost);
  }, [addGachaResults]);

  const handleReset = () => {
    resetData();
    setShowResetModal(false);
    setPage('gacha');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {showResetModal && (
        <ResetModal onConfirm={handleReset} onCancel={() => setShowResetModal(false)} />
      )}

      <Navbar activePage={page} onNavigate={setPage} />

      <main className="flex-1">
        {page === 'gacha' && (
          <GachaPage
            state={state}
            onGacha={handleGacha}
            isDailyAvailable={isDailyAvailable}
            onClaimDaily={claimDaily}
            dailyCooldownSeconds={dailyCooldownSeconds}
          />
        )}
        {page === 'koleksi' && <CollectionPage state={state} />}
        {page === 'riwayat' && <HistoryPage state={state} />}
      </main>

      <Footer />

      {/* Tombol Reset di pojok kiri bawah */}
      <button
        onClick={() => setShowResetModal(true)}
        className="fixed bottom-4 right-4 text-xs text-gray-600 hover:text-red-500 transition bg-gray-900 border border-gray-800 rounded-lg px-3 py-1.5 shadow"
      >
        🗑 Reset Data
      </button>
    </div>
  );
}
