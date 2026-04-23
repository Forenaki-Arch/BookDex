# Changelog

All notable changes to BookDex are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.2.0] — 2026-04-23

### Added
- **Page-level reading tracker** — input your exact current page on every "Reading" card; progress % is auto-calculated from the book's page count and synced instantly
- **"Pages in progress" stat** on the Statistics page — sums the current page across all books currently being read
- **About page** at `/about` — the landing page is now a dedicated About screen; `/` redirects directly to the app
- **About button** in Settings → About card, linking to `/about`

### Changed
- Full UI translated from Italian to English (all labels, toasts, placeholders, error messages, aria-labels, month abbreviations, PWA manifest, `lang` attribute)
- `STATUS_LABELS`: `"Da Leggere"` → `"To Read"`, `"In Lettura"` → `"Reading"`, `"Letti"` → `"Read"`
- Book search backend switched from Google Books API to **Open Library** — free, no API key, no rate limits
- ISBN scanner refactored to use `BrowserMultiFormatReader.decodeFromVideoDevice` — the library manages camera setup internally, fixing reliability issues on some browsers and devices
- Price formatting locale changed from `it-IT` to `en-US`
- Bottom navigation labels translated: `Libreria` → `Library`, `Scopri` → `Discover`, `Profilo` → `Settings`
- Sidebar and footer version bumped to v1.2
- `package.json` version bumped to 1.2.0
- Store schema bumped to version 3 (non-breaking — `currentPage` is optional)
- README fully rewritten in English

### Fixed
- TypeScript build error on Vercel: `decodeFromVideoElement` in `@zxing/library` v0.21 accepts only 1 argument (Promise-based); replaced with `decodeFromVideoElementContinuously` (callback-based) — build now passes cleanly

---

## [1.1.0] — 2025-12

### Added
- **Collections** — tag books into custom named collections; dedicated Collections page with tag filtering
- **Statistics** page — bar charts for books completed per year and per month, top authors, most-populated collections
- **Personal notes** per book — free-form text, saved locally
- **Auto dark/light schedule** — automatically switch theme by time of day (configurable in Settings)
- **Goodreads CSV import** — import your library via My Books → Export
- **JSON backup / restore** — export and re-import your full library
- `startedAt` / `finishedAt` timestamps for reading lifecycle tracking
- Store schema v2

### Changed
- Settings page redesigned with card layout
- Scanner: improved error messages per `DOMException` type

---

## [1.0.1] — 2026-04-23

### Fixed
- Removed `next-pwa` (incompatible with Next.js 14 App Router + `app/manifest.ts`) — app remains installable via `manifest.ts`; service worker will return in a future release
- Upgraded `next-themes` to `^0.4.3` to fix `ThemeProviderProps` TypeScript errors on Vercel build
- Added missing `import * as React from "react"` in `components/ui/sonner.tsx`
- Fixed `ReactNode` imports in layout files
- Added `vercel.json` to force Next.js framework detection

### Added
- `safeImageUrl()` utility in `lib/utils.ts` — validates URL protocol and dangerous characters before injecting into CSS `background-image: url(...)`
- Security headers via `next.config.mjs`: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`

---

## [1.0.0] — 2026-04-22

### Added
- Initial release
- ISBN barcode scanner via `@zxing/library`
- Three reading lists: To Read, Reading, Read
- Star rating (0–5) for completed books
- Reading progress (0–100%) with quick-select buttons
- Google Books API proxy (server-side, edge runtime)
- Three themes: Light, Dark, Sepia/Paper
- PWA manifest with shortcuts and maskable icons
- Zustand persisted store (localStorage, schema v1)
- Landing page with hero, features, how-it-works, FAQ, CTA
- Vercel deploy with HTTPS (required for camera + PWA)

---

[1.2.0]: https://github.com/Forenaki-Arch/BookDex/releases/tag/v1.2.0
[1.1.0]: https://github.com/Forenaki-Arch/BookDex/releases/tag/v1.1.0
[1.0.1]: https://github.com/Forenaki-Arch/BookDex/releases/tag/v1.0.1
[1.0.0]: https://github.com/Forenaki-Arch/BookDex/releases/tag/v1.0.0
