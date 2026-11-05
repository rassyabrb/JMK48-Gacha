import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'jmk48_gamestate';

// Reward koin per rarity yang didapat dari gacha
export const RARITY_REWARD = {
  N:         30,
  R:         70,
  SR:        300,
  SSR:       500,
  LEGENDARY: 3000,
  SECRET:    5000,
  FREE_SPIN: 0,
};

const DEFAULT_STATE = {
  koin: 1000,
  koleksi: {},           // { [memberId]: { member, count } }
  riwayat: [],           // maks 50 item terbaru
  pityCount: 0,          // counter tarikan sejak SSR terakhir
  pityCountSR: 0,        // counter tarikan sejak SR/SSR terakhir
  lastDailyClaim: null,  // ISO timestamp klaim harian terakhir
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATE;
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
}

export function useGameStore() {
  const [state, setState] = useState(loadState);

  // Persist to localStorage on every change
  useEffect(() => {
    saveState(state);
  }, [state]);

  const updateState = useCallback((updater) => {
    setState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      return next;
    });
  }, []);

  // Klaim koin harian
  const claimDaily = useCallback(() => {
    updateState((prev) => {
      const now = Date.now();
      const last = prev.lastDailyClaim ? new Date(prev.lastDailyClaim).getTime() : 0;
      const cooldown = 24 * 60 * 60 * 1000;
      if (now - last < cooldown) return prev; // belum waktunya
      return {
        ...prev,
        koin: prev.koin + 300,
        lastDailyClaim: new Date(now).toISOString(),
      };
    });
  }, [updateState]);

  // Cek apakah klaim harian tersedia
  const isDailyAvailable = useCallback(() => {
    const now = Date.now();
    const last = state.lastDailyClaim ? new Date(state.lastDailyClaim).getTime() : 0;
    return now - last >= 24 * 60 * 60 * 1000;
  }, [state.lastDailyClaim]);

  // Hitung sisa waktu klaim harian (dalam detik)
  const dailyCooldownSeconds = useCallback(() => {
    const now = Date.now();
    const last = state.lastDailyClaim ? new Date(state.lastDailyClaim).getTime() : 0;
    const diff = 24 * 60 * 60 * 1000 - (now - last);
    return Math.max(0, Math.floor(diff / 1000));
  }, [state.lastDailyClaim]);

  // Tambah hasil gacha ke koleksi & riwayat
  const addGachaResults = useCallback((results, cost) => {
    updateState((prev) => {
      // Update koleksi
      const koleksi = { ...prev.koleksi };
      results.forEach((member) => {
        if (koleksi[member.id]) {
          koleksi[member.id] = { ...koleksi[member.id], count: koleksi[member.id].count + 1 };
        } else {
          koleksi[member.id] = { member, count: 1 };
        }
      });

      // Hitung total reward koin dari kartu yang didapat
      const rewardKoin = results.reduce((total, m) => total + (RARITY_REWARD[m.rarity] ?? 0), 0);

      // Update riwayat (tambah di depan, maks 50)
      const riwayat = [
        { id: Date.now(), results, timestamp: new Date().toISOString(), rewardKoin },
        ...prev.riwayat,
      ].slice(0, 50);

      // Update pity
      let pityCount = prev.pityCount;
      let pityCountSR = prev.pityCountSR;
      results.forEach((m) => {
        pityCount++;
        pityCountSR++;
        if (m.rarity === 'SSR' || m.rarity === 'LEGENDARY') {
          pityCount = 0;
          pityCountSR = 0;
        } else if (m.rarity === 'SR') {
          pityCountSR = 0;
        }
      });

      return {
        ...prev,
        koin: prev.koin - cost + rewardKoin,
        koleksi,
        riwayat,
        pityCount,
        pityCountSR,
      };
    });
  }, [updateState]);

  // Reset semua data
  const resetData = useCallback(() => {
    setState(DEFAULT_STATE);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    state,
    claimDaily,
    isDailyAvailable,
    dailyCooldownSeconds,
    addGachaResults,
    resetData,
  };
}
