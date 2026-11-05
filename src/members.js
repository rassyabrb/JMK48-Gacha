/**
 * DATA MEMBER JMK48
 * Untuk menambah / mengubah member, edit array ini saja — tidak perlu mengubah kode lain.
 *
 * Field:
 *   id        : number unik
 *   nama      : string nama member
 *   generasi  : string generasi (mis. "Gen 1", "Gen 2", dst.)
 *   rarity    : "N" | "R" | "SR" | "SSR" | "LEGENDARY"
 *   foto      : URL foto (string). Kosongkan ("") untuk menggunakan avatar gradient default.
 *   warna     : warna gradient avatar jika foto kosong (opsional, default merah-putih)
 *   special   : "FREE_SPIN" — kartu khusus yang memberi free spin x10
 */

const MEMBERS = [
  {
    id: 1,
    nama: "Ananto Baseball Ngawi",
    generasi: "Gen 5",
    rarity: "N",
    foto: "https://telegra.ph/file/a64e260cd3f9d9f6358ce.png",
    warna: ["#ef4444", "#fca5a5"],
  },
  {
    id: 2,
    nama: "Pace Missael Topi Miring",
    generasi: "Gen 5",
    rarity: "N",
    foto: "https://telegra.ph/file/8a92c90f9ba614a4e0b1d.jpg",
    warna: ["#f97316", "#fed7aa"],
  },
  {
    id: 3,
    nama: "Yunus Cupcake",
    generasi: "Gen 2",
    rarity: "R",
    foto: "https://telegra.ph/file/a3a6bfbca12cb109fd350.png",
    warna: ["#3b82f6", "#bfdbfe"],
  },
  {
    id: 4,
    nama: "Reza Kecap Kecup",
    generasi: "Gen 2",
    rarity: "R",
    foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMA_CUGliH04TYSNTshoMO1wdtZdqxAvoEqJtALZKW6EKJDj2ceFSi3No&s=10",
    warna: ["#06b6d4", "#a5f3fc"],
  },
  {
    id: 5,
    nama: "Kevin Lontong",
    generasi: "Gen 2",
    rarity: "R",
    foto: "https://telegra.ph/file/8727d125942d8d7f5afb5.jpg",
    warna: ["#8b5cf6", "#ddd6fe"],
  },
  {
    id: 6,
    nama: "Pace Alex Ginak Ginuk",
    generasi: "Gen 3",
    rarity: "SR",
    foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaSQkmxP3jP-_uYwVApAcQF2ErBLr87LRrT-4rOdS8LFbwB3kKDAAzcJw&s=10",
    warna: ["#a855f7", "#e9d5ff"],
  },
  {
    id: 7,
    nama: "Monyet Ijo Banyumas",
    generasi: "Gen 3",
    rarity: "SR",
    foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdnu2IT8fVLjR7SpzWhVDg97ozr4oo5RcEbl_Vu81AX87sw7tLAuQUkpta&s=10",
    warna: ["#ec4899", "#fbcfe8"],
  },
  {
    id: 8,
    nama: "Rehan Wangsaf",
    generasi: "Gen 3",
    rarity: "SR",
    foto: "https://media.tenor.com/d3omTouvhfoAAAAM/rehan-rehan-wangsaff.gif",
    warna: ["#14b8a6", "#99f6e4"],
  },
  {
    id: 9,
    nama: "Rusdi Ngawi Barbershop",
    generasi: "Gen 4",
    rarity: "SSR",
    foto: "https://media.tenor.com/aX6EkpLMgE8AAAA1/rusdi.webp",
    warna: ["#f59e0b", "#fde68a"],
  },
  {
    id: 10,
    nama: "Amba The Explanation",
    generasi: "Gen 4",
    rarity: "SSR",
    foto: "https://media1.tenor.com/m/ZBtJFtWJeFYAAAAd/ga-logis-ambatukam.gif",
    warna: ["#ef4444", "#fde047"],
  },
  // ── Kartu Legendary ──────────────────────────────────────────────────────
  {
    id: 11,
    nama: "Miss Ironis Asam Manis",
    generasi: "Gen 0",
    rarity: "LEGENDARY",
    foto: "https://media1.tenor.com/m/KeWvZtKaSLYAAAAd/koree-antonio-rizz.gif",
    warna: ["#ee39bb", "#934161"],
  },
  {
    id: 12,
    nama: "Reza Popmie Sedap",
    generasi: "Rongawi Kuno",
    rarity: "SECRET",
    foto: "https://media1.tenor.com/m/MFxubIanJJoAAAAd/reza-auditore.gif",
    warna: ["#44091b", "#3c0b1e"],
  },
  // ── Kartu Special: Free Spin x10 ─────────────────────────────────────────
  {
    id: 99,
    nama: "Si Imut",
    generasi: "Special",
    rarity: "FREE_SPIN",
    special: "FREE_SPIN",
    foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0KbkEa0a0_w8DZUtcWcBeKlVFUQ5p_4v_NQgvbZbc7WM3xbEEm7aKh48&s=10",
    warna: ["#ff0000", "#ff7700", "#ffff00", "#00ff00", "#0000ff", "#8b00ff"],
  },
];

export default MEMBERS;
