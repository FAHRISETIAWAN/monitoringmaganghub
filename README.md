# Magang Hub ATR/BPN

Aplikasi monitoring peserta magang di lingkungan Kementerian ATR/BPN — login berbasis email, dashboard ringkasan, logbook kegiatan harian, dan verifikasi mentor.

## Menjalankan proyek

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000). Login cukup dengan email (mode demo, tanpa password):

- **Peserta Magang** — pilih nama dari daftar peserta aktif, lalu tambahkan logbook harian.
- **Mentor** — isi nama & email bebas, lalu tinjau/verifikasi logbook seluruh peserta.

## Fitur

- **Login** berbasis email dengan dua peran: Peserta Magang & Mentor.
- **Dashboard** — statistik peserta aktif, logbook hari ini, menunggu verifikasi, terverifikasi bulan ini, serta daftar aktivitas terbaru.
- **Logbook** — peserta mencatat hari, jam mulai/selesai, aktivitas, dan output; mentor meninjau lalu memverifikasi atau meminta revisi.
- **Peserta Magang** (khusus mentor) — daftar peserta beserta divisi, instansi asal, dan periode magang.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com) (Radix UI) untuk komponen (Dialog, Table, Tabs, Select, dll.)
- [Iconify](https://iconify.design) (`@iconify/react`) untuk ikon
- [gooey-toast](https://github.com/janusfil/gooey-toast) untuk notifikasi toast

## Data

Proyek ini masih menggunakan data dummy (`src/lib/mock-data.ts`) yang disinkronkan ke `localStorage` melalui `useSyncExternalStore` (`src/lib/use-local-storage.ts`), sehingga perubahan logbook & sesi login tetap tersimpan antar reload di browser yang sama. Belum terhubung ke database/backend sungguhan.
