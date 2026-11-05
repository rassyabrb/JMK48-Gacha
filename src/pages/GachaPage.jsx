import React, { useState, useEffect, useRef, useCallback } from 'react';
import CardItem from '../components/CardItem';
import { batchPull } from '../utils/gachaEngine';
import MEMBERS from '../members';
import { RARITY_REWARD } from '../hooks/useGameStore';

const COST_X1 = 100;
const COST_X10 = 900;

// Komponen animasi kartu balik sebelum reveal
function CardBack({ onFlipDone, delay = 0 }) {
  useEffect(() => {
    const t = setTimeout(onFlipDone, delay + 600);
    return () => clearTimeout(t);
  }, [onFlipDone, delay]);

  return (
    <div
      className="relative rounded-xl border-2 border-red-500 overflow-hidden flex items-center justify-center"
      style={{ width: '9rem', aspectRatio: '3/4', animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-red-800 to-red-950" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-yellow-400/60 rounded-full animate-spin" style={{ borderTopColor: 'transparent' }} />
      </div>
      <span className="relative text-white font-black text-2xl z-10 drop-shadow">?</span>
    </div>
  );
}

function RewardSummary({ results }) {
  const total = results.reduce((sum, m) => sum + (RARITY_REWARD[m.rarity] ?? 0), 0);
  const freeSpins = results.filter((m) => m.rarity === 'FREE_SPIN').length;
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <div className="flex items-center gap-2 bg-black/40 rounded-full px-4 py-1.5">
        <span className="text-yellow-400">🪙</span>
        <span className="text-yellow-300 font-bold">+{total.toLocaleString()} koin</span>
        <span className="text-yellow-200/60 text-xs">didapat</span>
      </div>
      {freeSpins > 0 && (
        <div className="flex items-center gap-2 bg-black/40 rounded-full px-4 py-1.5">
          <span>🎟</span>
          <span className="font-bold text-pink-300">+{freeSpins} Free Spin x10</span>
        </div>
      )}
    </div>
  );
}

/**
 * Overlay animasi x10 — mendukung multi-ronde (free spin berantai).
 * Props:
 *   rounds  : Array<Member[]> — setiap elemen adalah 1 ronde x10
 *   onClose : () => void
 */
function X10Reveal({ rounds, onClose, autoSpin, onToggleAutoSpin, onAutoSpin, outOfCoins }) {
  // `session` naik setiap kali rounds baru masuk → paksa reset revealed
  const [session, setSession] = useState(0);
  const [roundIdx, setRoundIdx] = useState(0);
  const [revealed, setRevealed] = useState(0);
  const timerRef = useRef(null);
  const prevRoundsRef = useRef(rounds);

  // Deteksi rounds baru → reset semua state ke awal
  if (prevRoundsRef.current !== rounds) {
    prevRoundsRef.current = rounds;
    // Gunakan setState langsung di render (sebelum commit) agar tidak ada frame
    // dengan state stale — React akan re-render sekali lagi secara sinkron
  }

  // Guard: pastikan index valid sebelum akses array
  const safeIdx = Math.min(roundIdx, rounds.length - 1);
  const results = rounds[safeIdx] ?? [];
  const isLastRound = safeIdx === rounds.length - 1;

  // Reset revealed tiap ganti ronde ATAU sesi baru
  useEffect(() => {
    setRevealed(0);
  }, [safeIdx, session]);

  // Reset sesi saat rounds berubah (auto spin mengirim rounds baru)
  useEffect(() => {
    setSession((s) => s + 1);
    setRoundIdx(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rounds]);

  const revealNext = useCallback(() => {
    setRevealed((prev) => Math.min(prev + 1, results.length));
  }, [results.length]);

  // Timer animasi reveal — satu kartu per interval
  useEffect(() => {
    if (revealed < results.length) {
      timerRef.current = setTimeout(revealNext, revealed === 0 ? 150 : 200);
    }
    return () => clearTimeout(timerRef.current);
  }, [revealed, results.length, revealNext]);

  const allDone = results.length > 0 && revealed === results.length;
  const isFreeRound = safeIdx > 0;

  // Auto-lanjut ronde free spin berikutnya (bukan ronde terakhir)
  useEffect(() => {
    if (!allDone || isLastRound) return;
    const t = setTimeout(() => setRoundIdx((prev) => prev + 1), 500);
    return () => clearTimeout(t);
  }, [allDone, isLastRound]);

  // Auto spin: saat ronde terakhir selesai & auto spin ON → spin baru otomatis
  useEffect(() => {
    if (!allDone || !isLastRound || !autoSpin) return;
    const t = setTimeout(onAutoSpin, 600);
    return () => clearTimeout(t);
  }, [allDone, isLastRound, autoSpin, onAutoSpin]);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex flex-col overflow-y-auto">
      {/* Efek cahaya latar */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-700/20 rounded-full blur-3xl" />
      </div>

      <div className="flex flex-col items-center px-4 pt-6 pb-4 flex-1">
        {/* Header */}
        {rounds.length > 1 ? (
          <div className="z-10 mb-1 flex flex-col items-center gap-1">
            <h2
              className="font-black text-2xl drop-shadow"
              style={{
                color: isFreeRound ? 'transparent' : '#fde047',
                backgroundImage: isFreeRound ? 'linear-gradient(90deg,#ff0,#f0f,#0ff,#0f0)' : undefined,
                WebkitBackgroundClip: isFreeRound ? 'text' : undefined,
                backgroundClip: isFreeRound ? 'text' : undefined,
              }}
            >
              {isFreeRound ? '🎟 Free Spin x10!' : 'Hasil Gacha x10'}
            </h2>
            <span className="text-gray-400 text-xs">
              Ronde {safeIdx + 1} / {rounds.length}
              {!isLastRound && ` · ${rounds.length - safeIdx - 1} ronde free spin tersisa`}
            </span>
          </div>
        ) : (
          <h2 className="text-yellow-300 font-black text-2xl mb-2 drop-shadow z-10">Hasil Gacha x10</h2>
        )}

        <div className="mb-4 z-10">
          <RewardSummary results={results} />
        </div>

        {/* Grid 5 kolom — kartu kecil agar semua 10 muat tanpa scroll */}
        <div className="grid grid-cols-5 gap-2 w-full max-w-lg z-10">
          {results.map((member, i) => (
            <div key={i} className="flex flex-col items-center gap-0.5">
              {i < revealed ? (
                <>
                  {/* Override lebar kartu agar muat 5 per baris */}
                  <div style={{ width: '100%' }}>
                    <CardItem member={member} animating small />
                  </div>
                  <span className="text-yellow-400 leading-tight text-center"
                    style={{ fontSize: '0.55rem', fontWeight: 700 }}
                  >
                    {member.rarity === 'FREE_SPIN'
                      ? '🎟'
                      : `+${(RARITY_REWARD[member.rarity] ?? 0).toLocaleString()}🪙`}
                  </span>
                </>
              ) : (
                <div
                  className="rounded-lg border-2 border-gray-700 bg-gray-900 flex items-center justify-center w-full"
                  style={{ aspectRatio: '3/4' }}
                >
                  <span className="text-gray-600 font-black text-lg">?</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tombol selalu terlihat di bawah */}
      <div className="sticky bottom-0 flex flex-col gap-2 py-3 px-4 bg-black/70 z-10">
        {/* Notif koin kurang */}
        {outOfCoins && (
          <div className="flex items-center justify-center gap-2 bg-red-900/80 border border-red-500 rounded-lg px-4 py-2">
            <span className="text-red-300 text-sm font-bold">🪙 Koin tidak cukup untuk Auto Spin!</span>
          </div>
        )}

        {/* Toggle Auto Spin */}
        <div className="flex justify-center">
          <button
            onClick={onToggleAutoSpin}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition border ${
              autoSpin
                ? 'bg-green-600 border-green-400 text-white'
                : 'bg-white/10 border-white/20 text-gray-300 hover:bg-white/20'
            }`}
          >
            🔁 Auto Spin {autoSpin ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Tombol aksi — hanya tampil saat ronde terakhir selesai & auto spin OFF */}
        {allDone && isLastRound && !autoSpin && (
          <div className="flex justify-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold transition shadow-lg"
            >
              Tutup ✕
            </button>
            <button
              onClick={onAutoSpin}
              className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold transition shadow-lg"
            >
              Spin Lagi
            </button>
          </div>
        )}
        {/* Indikator saat auto spin sedang menunggu spin berikutnya */}
        {allDone && isLastRound && autoSpin && !outOfCoins && (
          <p className="text-center text-green-400 text-xs animate-pulse">⏳ Spinning otomatis...</p>
        )}
      </div>
    </div>
  );
}

// Overlay animasi x1
function X1Reveal({ result, onClose }) {
  const [phase, setPhase] = useState('spinning'); // spinning → revealed

  useEffect(() => {
    const t = setTimeout(() => setPhase('revealed'), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex flex-col items-center justify-center gap-6">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-700/20 rounded-full blur-3xl" />
      </div>

      {phase === 'spinning' ? (
        <CardBack onFlipDone={() => setPhase('revealed')} />
      ) : (
        <>
          <p className="text-yellow-300 font-black text-xl drop-shadow z-10">Kamu mendapat...</p>
          <div className="z-10">
            <CardItem member={result} animating />
          </div>
          <div className="z-10">
            <RewardSummary results={[result]} />
          </div>
          <button
            onClick={onClose}
            className="z-10 px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold transition shadow-lg"
          >
            Lanjut ✓
          </button>
        </>
      )}
    </div>
  );
}

export default function GachaPage({ state, onGacha, isDailyAvailable, onClaimDaily, dailyCooldownSeconds }) {
  const [showX1, setShowX1] = useState(null);
  const [showX10, setShowX10] = useState(null);
  const [cooldown, setCooldown] = useState(dailyCooldownSeconds());
  const [muted, setMuted] = useState(false);
  const [autoSpin, setAutoSpin] = useState(false);
  const [outOfCoins, setOutOfCoins] = useState(false);
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  // Update countdown setiap detik
  useEffect(() => {
    if (isDailyAvailable()) return;
    const interval = setInterval(() => {
      const secs = dailyCooldownSeconds();
      setCooldown(secs);
      if (secs <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [isDailyAvailable, dailyCooldownSeconds]);

  const formatCountdown = (secs) => {
    const h = Math.floor(secs / 3600).toString().padStart(2, '0');
    const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const buildX10Rounds = useCallback((pityInit, pitySRInit) => {
    const cost = COST_X10;
    let pity = pityInit;
    let pitySR = pitySRInit;
    const rounds = [];

    const pullRound = (free) => {
      const { results, finalPityCount, finalPityCountSR } = batchPull(10, pity, pitySR);
      pity = finalPityCount;
      pitySR = finalPityCountSR;
      onGacha(results, free ? 0 : cost);
      return results;
    };

    const firstRound = pullRound(false);
    rounds.push(firstRound);

    let pending = firstRound.filter((m) => m.rarity === 'FREE_SPIN').length;
    while (pending > 0) {
      const freeRound = pullRound(true);
      rounds.push(freeRound);
      pending = pending - 1 + freeRound.filter((m) => m.rarity === 'FREE_SPIN').length;
    }

    return rounds;
  }, [onGacha]);

  const handleGacha = useCallback((count) => {
    const cost = count === 1 ? COST_X1 : COST_X10;
    const s = stateRef.current;
    if (s.koin < cost) return;

    if (count === 1) {
      const { results } = batchPull(1, s.pityCount, s.pityCountSR);
      onGacha(results, cost);
      setShowX1(results[0]);
      return;
    }

    const rounds = buildX10Rounds(s.pityCount, s.pityCountSR);
    setShowX10(rounds);
  }, [buildX10Rounds, onGacha]);

  // Dipanggil dari overlay saat auto spin: ganti rounds dengan pull baru
  const handleAutoSpin = useCallback(() => {
    const s = stateRef.current;
    if (s.koin < COST_X10) {
      // Koin kurang — matikan auto spin, tampilkan notif
      setAutoSpin(false);
      setOutOfCoins(true);
      return;
    }
    setOutOfCoins(false);
    const rounds = buildX10Rounds(s.pityCount, s.pityCountSR);
    setShowX10(rounds);
  }, [buildX10Rounds]);

  const totalMembers = MEMBERS.filter((m) => m.rarity !== 'FREE_SPIN').length;
  const ownedCount = Object.keys(state.koleksi).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Overlay Gacha */}
      {showX1 && <X1Reveal result={showX1} onClose={() => setShowX1(null)} />}
      {showX10 && (
        <X10Reveal
          rounds={showX10}
          onClose={() => { setShowX10(null); setOutOfCoins(false); }}
          autoSpin={autoSpin}
          onToggleAutoSpin={() => { setAutoSpin((v) => !v); setOutOfCoins(false); }}
          onAutoSpin={handleAutoSpin}
          outOfCoins={outOfCoins}
        />
      )}

      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-red-800 via-red-700 to-pink-900 p-6 sm:p-8 text-center shadow-2xl border border-red-600">
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, white 1px, transparent 1px), radial-gradient(circle at 70% 80%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <h1 className="text-3xl sm:text-4xl font-black text-white drop-shadow-lg tracking-wide">
          JMK48 <span className="text-yellow-300">Gacha</span>
        </h1>
        <p className="text-red-200 text-sm mt-1">Ngesor Yuk!</p>

        {/* Koin */}
        <div className="mt-4 inline-flex items-center gap-2 bg-black/40 rounded-full px-5 py-2">
          <span className="text-yellow-400 text-xl">🪙</span>
          <span className="text-yellow-300 font-extrabold text-xl">{state.koin.toLocaleString()}</span>
          <span className="text-yellow-200/70 text-sm">koin</span>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-900 rounded-xl p-3 text-center border border-gray-800">
          <p className="text-xs text-gray-400">Koleksi</p>
          <p className="text-white font-bold text-lg">{ownedCount}<span className="text-gray-500 text-sm">/{totalMembers}</span></p>
        </div>
        <div className="bg-gray-900 rounded-xl p-3 text-center border border-gray-800">
          <p className="text-xs text-gray-400">Pity SSR</p>
          <p className={`font-bold text-lg ${state.pityCount >= 70 ? 'text-yellow-400 animate-pulse' : 'text-white'}`}>
            {state.pityCount}<span className="text-gray-500 text-sm">/80</span>
          </p>
        </div>
        <div className="bg-gray-900 rounded-xl p-3 text-center border border-gray-800">
          <p className="text-xs text-gray-400">Pity SR</p>
          <p className={`font-bold text-lg ${state.pityCountSR >= 8 ? 'text-purple-400 animate-pulse' : 'text-white'}`}>
            {state.pityCountSR}<span className="text-gray-500 text-sm">/10</span>
          </p>
        </div>
      </div>

      {/* Tombol Gacha */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => handleGacha(1)}
            disabled={state.koin < COST_X1}
            className={`
              relative overflow-hidden rounded-xl py-4 px-6 font-bold text-lg transition-all duration-200 shadow-lg
              ${state.koin >= COST_X1
                ? 'bg-gradient-to-br from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white active:scale-95 hover:shadow-red-700/40 hover:shadow-xl'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            <span className="relative z-10 flex flex-col items-center gap-1">
              <span>Gacha x1</span>
              <span className="text-sm font-normal opacity-80">🪙 {COST_X1} koin</span>
            </span>
          </button>

          <button
            onClick={() => handleGacha(10)}
            disabled={state.koin < COST_X10}
            className={`
              relative overflow-hidden rounded-xl py-4 px-6 font-bold text-lg transition-all duration-200 shadow-lg
              ${state.koin >= COST_X10
                ? 'bg-gradient-to-br from-yellow-500 to-yellow-700 hover:from-yellow-400 hover:to-yellow-600 text-yellow-950 active:scale-95 hover:shadow-yellow-600/40 hover:shadow-xl'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            <span className="relative z-10 flex flex-col items-center gap-1">
              <span>Gacha x10</span>
              <span className="text-sm font-normal opacity-80">🪙 {COST_X10} koin · Hemat 100!</span>
            </span>
          </button>
      </div>

      {/* Klaim Harian */}
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <p className="text-white font-semibold">Koin Harian</p>
          <p className="text-gray-400 text-sm">Klaim +300 koin gratis setiap 24 jam</p>
        </div>
        {isDailyAvailable() ? (
          <button
            onClick={() => { onClaimDaily(); setCooldown(86400); }}
            className="px-5 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition shadow"
          >
            Klaim Sekarang
          </button>
        ) : (
          <div className="text-center">
            <p className="text-gray-400 text-xs">Tersedia lagi dalam</p>
            <p className="text-yellow-400 font-mono font-bold text-lg">{formatCountdown(cooldown)}</p>
          </div>
        )}
      </div>

      {/* Info Peluang */}
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
        <h3 className="text-white font-bold mb-3">Peluang Rarity</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { label: 'N Common',      pct: '55%',  cls: 'border-gray-500 text-gray-300' },
            { label: 'R Rare',        pct: '30%',  cls: 'border-blue-500 text-blue-300' },
            { label: 'SR Super Rare', pct: '10%',  cls: 'border-purple-500 text-purple-300' },
            { label: 'SSR Ultra Rare',pct: '1%',   cls: 'border-yellow-400 text-yellow-300' },
            { label: 'Legendary',   pct: '0.5%',   cls: 'border-orange-400 text-orange-300' },
            { label: 'Free Spin',  pct: '0.5%',   cls: 'border-pink-500 text-pink-300' },
            { label: 'Secret',  pct: '0.?%',   cls: 'border-red-500 text-red-300' },
          ].map((r) => (
            <div key={r.label} className={`border rounded-lg p-2 text-center ${r.cls}`}>
              <p className="font-bold text-lg">{r.pct}</p>
              <p className="text-xs opacity-80">{r.label}</p>
            </div>
          ))}
        </div>
        <p className="text-gray-500 text-xs mt-3">
          ✦ Jaminan minimal 1 SR/SSR setiap 10 tarikan &nbsp;·&nbsp; Jaminan SSR di tarikan ke-80
          &nbsp;·&nbsp; Free Spin = langsung spin x10 gratis otomatis!
        </p>
      </div>

      {/* Tombol mute (placeholder UI) */}
      <div className="flex justify-end">
        <button
          onClick={() => setMuted((m) => !m)}
          className="text-gray-500 hover:text-gray-300 text-sm transition flex items-center gap-1"
        >
          {muted ? '🔇 Suara Mati' : '🔊 Suara Nyala'}
        </button>
      </div>
    </div>
  );
}
