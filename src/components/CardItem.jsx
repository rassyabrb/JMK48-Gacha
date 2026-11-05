import React from 'react';

const RARITY_STYLES = {
  N: {
    border: 'border-gray-400',
    glow: 'glow-n',
    badge: 'bg-gray-600 text-gray-100',
    label: 'N',
    shimmer: false,
  },
  R: {
    border: 'border-blue-500',
    glow: 'glow-r',
    badge: 'bg-blue-700 text-blue-100',
    label: 'R',
    shimmer: false,
  },
  SR: {
    border: 'border-purple-500',
    glow: 'glow-sr',
    badge: 'bg-purple-700 text-purple-100',
    label: 'SR',
    shimmer: false,
  },
  SSR: {
    border: 'border-yellow-400',
    glow: 'glow-ssr animate-pulse-gold',
    badge: 'bg-yellow-500 text-yellow-950',
    label: 'SSR',
    shimmer: true,
  },
  LEGENDARY: {
    border: 'border-pink-400',
    glow: 'glow-legendary',
    badge: 'bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white',
    label: '✦L',
    shimmer: 'legendary',
  },
  SECRET: {
    border: 'border-red-900',
    glow: 'glow-secret',
    badge: 'bg-gradient-to-r from-red-900 to-red-800 text-white',
    label: 'SCRT',
    shimmer: 'secret',
  },
  FREE_SPIN: {
    border: 'animate-rainbow-border border-red-500',
    glow: 'glow-free-spin',
    badge: 'bg-gradient-to-r from-pink-500 to-purple-600 text-white',
    label: 'Free Spin',
    shimmer: 'rainbow',
  },
};

/**
 * CardItem — trading card bergaya 3:4.
 *
 * Props:
 *   member    : objek member
 *   count     : jumlah duplikat (opsional, tampil jika > 1)
 *   silhouette: boolean — tampilkan mode gelap/siluet (belum punya)
 *   small     : boolean — ukuran kecil untuk grid koleksi
 *   animating : boolean — aktifkan animasi reveal
 *   delay     : number ms — delay animasi reveal (untuk x10 berurutan)
 */
export default function CardItem({ member, count = 1, silhouette = false, small = false, animating = false, delay = 0 }) {
  const style = RARITY_STYLES[member?.rarity] || RARITY_STYLES['N'];
  const initials = member?.nama
    ? member.nama.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  const cardStyle = {
    animationDelay: animating ? `${delay}ms` : undefined,
  };

  // FREE_SPIN: background pelangi animasi
  const isFreeSpin = member?.rarity === 'FREE_SPIN';
  const isLegendary = member?.rarity === 'LEGENDARY';

  const gradientStyle = (() => {
    if (isFreeSpin) return {
      background: 'linear-gradient(135deg, #ff0000, #ff7700, #ffff00, #00ff00, #0077ff, #8b00ff)',
      backgroundSize: '300% 300%',
      animation: 'rainbow-bg 3s linear infinite',
    };
    if (member?.warna)
      return { background: `linear-gradient(135deg, ${member.warna[0]}, ${member.warna[1]})` };
    return { background: 'linear-gradient(135deg, #ef4444, #f5f5f5)' };
  })();

  return (
    <div
      className={`
        relative rounded-xl border-2 overflow-hidden flex flex-col
        ${style.border} ${style.glow}
        ${small ? 'w-full' : 'w-36 sm:w-40'}
        ${animating ? 'animate-reveal' : ''}
        ${silhouette ? 'opacity-40 grayscale' : ''}
        transition-transform duration-200 hover:scale-105 cursor-default
      `}
      style={{ aspectRatio: '3/4', ...cardStyle }}
    >
      {/* Foto / Avatar */}
      <div className="flex-1 relative overflow-hidden">
        {member?.foto ? (
          <img
            src={member.foto}
            alt={member.nama}
            className="w-full h-full object-cover"
            style={silhouette ? { filter: 'brightness(0.1)' } : {}}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-white font-bold text-2xl"
            style={silhouette ? { background: '#111' } : gradientStyle}
          >
            {!silhouette && (
              <span className="select-none drop-shadow text-center px-1 leading-tight">
                {isFreeSpin ? '🎟' : isLegendary ? '✦' : initials}
              </span>
            )}
          </div>
        )}

        {/* Shimmer overlay */}
        {style.shimmer === true && !silhouette && (
          <div className="absolute inset-0 shimmer-ssr pointer-events-none" />
        )}
        {style.shimmer === 'legendary' && !silhouette && (
          <div className="absolute inset-0 shimmer-legendary pointer-events-none" />
        )}
        {style.shimmer === 'secret' && !silhouette && (
          <div className="absolute inset-0 shimmer-secret pointer-events-none" />
        )}
        {style.shimmer === 'rainbow' && !silhouette && (
          <div className="absolute inset-0 shimmer-rainbow pointer-events-none" />
        )}

        {/* Badge rarity */}
        <span
          className={`absolute top-1 left-1 text-xs font-extrabold px-1.5 py-0.5 rounded ${style.badge}`}
        >
          {style.label}
        </span>

        {/* Counter duplikat */}
        {count > 1 && !silhouette && (
          <span className="absolute top-1 right-1 text-xs font-bold bg-black/70 text-white px-1.5 py-0.5 rounded">
            x{count}
          </span>
        )}
      </div>

      {/* Info bawah */}
      <div className="bg-black/80 px-2 py-1.5 text-center">
        {silhouette ? (
          <p className="text-gray-500 text-xs font-medium truncate">???</p>
        ) : (
          <>
            <p className="text-white text-xs font-semibold truncate leading-tight">{member?.nama}</p>
            <p className="text-gray-400 text-[10px] truncate">{member?.generasi}</p>
          </>
        )}
      </div>
    </div>
  );
}
