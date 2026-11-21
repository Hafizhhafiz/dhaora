---
name: DHAORA Design System
description: Editorial Research Institution Design System for Marine AI & WebGIS
colors:
  bg-base: "#FFFFFF"
  bg-warm: "#F6F6F3"
  bg-muted: "#EFEFEA"
  ink-primary: "#0B1220"
  ink-secondary: "#334155"
  ink-muted: "#64748B"
  dark-block: "#0A1A2F"
  ocean: "#0E6E7E"
  ocean-hover: "#085461"
  ocean-subtle: "#EBF4F6"
  border-hairline: "#E5E7EB"
  mod-forecast: "#5B5FC7"
  mod-guard: "#0D9488"
  mod-bycatch: "#0284C7"
typography:
  display:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  serif-italic:
    fontFamily: "Newsreader, Instrument Serif, Georgia, serif"
    fontWeight: 500
    fontStyle: "italic"
    letterSpacing: "-0.01em"
  mono:
    fontFamily: "JetBrains Mono, monospace"
    fontWeight: 500
rounded:
  pill: "9999px"
  card: "24px"
  sm: "12px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  section: "96px"
---

## Overview

DHAORA menerapkan estetika institusi riset kelautan formal dan editorial: latar belakang bersih off-white hangat (`#F6F6F3` / `#FFFFFF`), tipografi tinta navy pekat (`#0B1220`), satu blok kontras gelap (`#0A1A2F`), dan aksen tunggal deep ocean teal (`#0E6E7E`). Menghilangkan seluruh unsur "AI slop" (gradien neon, bayangan berwarna, badge berlebihan).

## Colors

- **Latar Belakang**: Putih (`#FFFFFF`) dan Warm Off-White (`#F6F6F3`).
- **Teks / Ink**: Tinta pekat (`#0B1220`) untuk judul utama, `#334155` untuk deskripsi, dan `#64748B` untuk keterangan pelengkap.
- **Aksen Tunggal**: Deep Ocean Teal (`#0E6E7E`), hover (`#085461`), dan background lembut (`#EBF4F6`).
- **Blok Kontras**: Deep Navy (`#0A1A2F`) untuk hero, login sidebar, dan kartu ringkasan eksekutif.
- **Semantic Status**: Hijau emerald (`#059669`) untuk status aktif/terverifikasi, amber (`#D97706`) untuk perhatian, dan rose (`#DC2626`) untuk peringatan/bahaya.
- **Modul**: Penanda berupa dot kecil 8px: CatchForecast (Indigo `#5B5FC7`), FishGuard (Teal `#0D9488`), ByCatch (Sky Blue `#0284C7`).

## Typography

- **Heading**: Plus Jakarta Sans bold dengan pengetatan spasi (`tracking-tight`).
- **Frasa Kunci Editorial**: Newsreader italic (`font-serif-italic`) disematkan pada satu kata/frasa kunci judul.
- **Body Text**: 14–16px dengan `line-height: 1.6`.
- **Angka Metrik & Kode**: JetBrains Mono dengan `tabular-nums` untuk keselarasan vertikal tabel dan data statistik.

## Layout

- Grid 12 kolom dengan lebar maksimum kontainer `max-w-7xl` (1280px).
- Spasi seksi lega 64–96px pada tampilan desktop.
- Desain responsif adaptif untuk desktop (1440px), tablet (768px), dan mobile (375px/420px).

## Elevation & Depth

- Tidak menggunakan bayangan neon atau glow berwarna.
- Kartu mengandalkan hairline border 1px (`#E5E7EB` / `border-slate-200`) dan bayangan sangat halus (`shadow-sm`).

## Shapes

- Radius kartu pemasaran & hero: 24–32px (`rounded-3xl` / `rounded-2xl`).
- Radius tombol navigasi dan aksi utama: berbentuk pill bulat (`rounded-full`).
- Radius kartu data teknis dan input formulir: 12–16px (`rounded-xl` / `rounded-2xl`).

## Components

- **Tombol Utama**: Pill dengan latar `#0E6E7E`, teks putih, padding `px-5 py-2.5`.
- **Tombol Sekunder**: Pill outline dengan latar putih / `#F6F6F3`, border `#E5E7EB`, teks `#0B1220`.
- **Kartu Data / Metrik**: Latar putih, border tipis, angka display besar dengan label uppercase tracking-wider.
- **Status Chip**: Pill lembut dengan padding `px-2.5 py-0.5` dan border tipis senada.

## Do's and Don'ts

- **DO**: Gunakan format angka Indonesia `id-ID` (ribuan titik, desimal koma).
- **DO**: Gunakan foto riil lapangan atau screenshot asli modul ilmiah.
- **DO**: Berikan alt text dan lazy-loading pada semua citra.
- **DON'T**: Jangan gunakan teks bergradien warna atau glow bayangan neon.
- **DON'T**: Jangan gunakan emoji pada judul atau label tombol formal.
- **DON'T**: Jangan gunakan lebih dari satu label chip/badge dekoratif per seksi.
