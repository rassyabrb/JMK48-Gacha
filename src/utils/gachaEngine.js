import MEMBERS from '../members';

// Peluang rarity
// Total: 1.00  (N=0.49, R=0.30, SR=0.10, SSR=0.03, LEGENDARY=0.01, FREE_SPIN=0.05 + sisa → N fallback = 0.02 hilang, sebenarnya 0.49+0.30+0.10+0.03+0.01+0.05 = 0.98, sisa 0.02 fallback ke N)
const RARITY_RATES = {
  N:         0.55,
  R:         0.30,
  SR:        0.10,
  SSR:       0.01,
  LEGENDARY: 0.005,
  FREE_SPIN: 0.005,
  SECRET:    0.001,
};

// Pool member per rarity
const POOL = {
  N:         MEMBERS.filter((m) => m.rarity === 'N'),
  R:         MEMBERS.filter((m) => m.rarity === 'R'),
  SR:        MEMBERS.filter((m) => m.rarity === 'SR'),
  SSR:       MEMBERS.filter((m) => m.rarity === 'SSR'),
  LEGENDARY: MEMBERS.filter((m) => m.rarity === 'LEGENDARY'),
  FREE_SPIN: MEMBERS.filter((m) => m.rarity === 'FREE_SPIN'),
  SECRET:    MEMBERS.filter((m) => m.rarity === 'SECRET'),
};

function pickRarity(forceMinSR = false, forceSSR = false) {
  if (forceSSR) return 'SSR';
  if (forceMinSR) {
    // Pastikan minimal SR, re-roll jika hasil di bawah SR
    const r = Math.random();
    if (r < RARITY_RATES.LEGENDARY) return 'LEGENDARY';
    if (r < RARITY_RATES.LEGENDARY + RARITY_RATES.SSR) return 'SSR';
    return 'SR';
  }

  const r = Math.random();
  let cumulative = 0;
  for (const [rarity, rate] of Object.entries(RARITY_RATES)) {
    cumulative += rate;
    if (r < cumulative) return rarity;
  }
  return 'N'; // fallback
}

function pickMemberByRarity(rarity) {
  const pool = POOL[rarity];
  if (!pool || pool.length === 0) {
    // Fallback ke N jika pool kosong
    const fallback = POOL['N'];
    return fallback[Math.floor(Math.random() * fallback.length)];
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Lakukan batch pull (x1 atau x10) dengan pity system.
 * @param {number} count - jumlah tarikan (1 atau 10)
 * @param {number} initialPityCount
 * @param {number} initialPityCountSR
 * @returns {{ results: Member[], finalPityCount, finalPityCountSR }}
 */
export function batchPull(count, initialPityCount, initialPityCountSR) {
  const results = [];
  let pityCount = initialPityCount;
  let pityCountSR = initialPityCountSR;
  let hasSROrAbove = false;

  for (let i = 0; i < count; i++) {
    // Untuk tarikan terakhir di x10, cek apakah sudah ada SR/SSR dalam batch ini
    const lastPull = i === count - 1;
    const forceSROnLast = count === 10 && lastPull && !hasSROrAbove;

    const newPityCount = pityCount + 1;
    const newPityCountSR = pityCountSR + 1;

    const forceSSR = newPityCount >= 80;
    const forceSR = !forceSSR && (forceSROnLast || newPityCountSR >= 10);

    const rarity = pickRarity(forceSR, forceSSR);
    const member = pickMemberByRarity(rarity);

    if (rarity === 'SSR' || rarity === 'SR' || rarity === 'LEGENDARY') {
      hasSROrAbove = true;
    }

    if (rarity === 'SSR' || rarity === 'LEGENDARY') {
      pityCount = 0;
      pityCountSR = 0;
    } else if (rarity === 'SR') {
      pityCountSR = 0;
      pityCount = newPityCount;
    } else {
      pityCount = newPityCount;
      pityCountSR = newPityCountSR;
    }

    results.push(member);
  }

  return { results, finalPityCount: pityCount, finalPityCountSR: pityCountSR };
}
