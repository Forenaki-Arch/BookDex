# BookDex

> **Your personal book tracker** — a modern, mobile-first PWA with an ISBN scanner, smart lists, page-level reading tracker, and an interface you'll love looking at.

![version](https://img.shields.io/badge/version-1.2.0-blue) ![framework](https://img.shields.io/badge/Next.js-14-black) ![pwa](https://img.shields.io/badge/PWA-ready-success) ![license](https://img.shields.io/badge/license-MIT-green)

---

## Features

### Library management
- **Three smart lists**: `To Read`, `Reading`, `Read`
- Add, move, or remove books with a single tap
- **Star rating** (0–5) for completed books
- **Reading progress** (0–100%) with quick-buttons (10/25/50/75/100%) and automatic promotion to "Read" at 100%
- **Page-level tracker** — enter the exact page you're on; progress % is auto-calculated from page count
- **Mini stats dashboard** on the home screen

### ISBN Scanner
- Camera access with full error handling (permission denied, device not found, camera busy)
- Continuous scanning via [`@zxing/library`](https://github.com/zxing-js/library)
- Automatic preference for the **back camera** on mobile
- ISBN-10 / ISBN-13 / EAN-13 (978/979) regex validation
- Visual feedback: animated viewfinder with corner markers, scan line, success animation

### Search
- **Debounced search** (400 ms) by title, author, or publisher
- Results with cover, authors, title, and metadata
- Server-side proxy `/api/books` → [Open Library API](https://openlibrary.org/developers/api) with edge caching (1 h)
- **Skeleton loaders** during loading
- Modal detail sheet with blurred cover background

### Collections & Notes
- Tag books into **custom collections** (e.g. `fantasy`, `gift`, `classics`)
- **Personal notes** per book — saved locally, never synced
- Dedicated Collections page with tag filtering

### Statistics
- **Total books**, **Read**, **Pages read** (from completed books)
- **Pages in progress** (sum of current pages across books being read)
- **Avg. rating**, **Unique authors**, **Collections count**
- Bar charts: books completed per year + per month (current year)
- Top authors and most-populated collections

### Design & UX
- **Three themes**: Light, Dark, and a refined **Sepia/Paper** for a printed-page feel
- Respects system `prefers-color-scheme` via `next-themes`
- **Auto theme schedule** — automatically switch between light/dark based on time of day
- **Adaptive layout**:
  - **Mobile** → iOS/Android-style bottom navigation with safe-area support
  - **Desktop** → sidebar with animated icons (Framer Motion `layoutId`)
- Smooth animations (Framer Motion): page transitions, hover lift, sequential fade-ups, scanner pulse

### Privacy & PWA
- **Installable** on iOS, Android, Windows, macOS
- **Offline-ready** — all data lives in `localStorage`, zero cloud, zero tracking
- **Dynamic manifest** (`app/manifest.ts`) with PWA shortcuts and maskable icons
- **Edge runtime** for search API on Vercel
- Native `next/image` optimisation, `next/font` for Inter + Lora

---

## Tech stack

| Area           | Technology                          |
| -------------- | ----------------------------------- |
| Framework      | Next.js 14 (App Router, TypeScript) |
| Styling        | Tailwind CSS                        |
| UI components  | Radix UI + Shadcn style             |
| Icons          | Lucide React                        |
| Animations     | Framer Motion                       |
| Client state   | Zustand + persist middleware        |
| Themes         | next-themes                         |
| Scanner        | @zxing/library                      |
| Toasts         | Sonner                              |
| Book data      | Open Library API                    |

---

## Project structure

```
BookDex/
├── public/
│   ├── icons/              # PWA icons (192, 512, maskable, apple-touch)
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout (fonts, ThemeProvider, Toaster)
│   │   ├── page.tsx               # Redirects / → /app
│   │   ├── about/page.tsx         # Landing / About page (/about)
│   │   ├── globals.css            # Tailwind + theme CSS vars
│   │   ├── manifest.ts            # Dynamic PWA manifest
│   │   ├── api/
│   │   │   └── books/route.ts     # Open Library proxy (edge runtime)
│   │   └── (app)/
│   │       ├── layout.tsx         # Adaptive Sidebar/BottomNav layout
│   │       └── app/
│   │           ├── page.tsx           # Library dashboard
│   │           ├── search/page.tsx    # Search + Scanner
│   │           ├── collections/page.tsx
│   │           ├── stats/page.tsx
│   │           └── settings/page.tsx
│   ├── components/
│   │   ├── ui/             # Shadcn primitives (button, dialog, tabs, …)
│   │   ├── books/          # book-cover, book-list-item, book-detail-dialog, rating-stars
│   │   ├── scanner/        # barcode-scanner
│   │   ├── navigation/     # sidebar, bottom-nav
│   │   ├── landing/        # hero, features, how-it-works, faq, cta, footer, landing-nav
│   │   ├── stats/          # bar-chart
│   │   ├── theme-provider.tsx
│   │   └── theme-toggle.tsx
│   ├── hooks/
│   │   └── use-auto-theme.ts
│   ├── lib/
│   │   ├── api/books-api.ts   # Open Library client
│   │   ├── import/goodreads.ts
│   │   ├── types.ts
│   │   └── utils.ts
│   └── store/
│       └── books-store.ts  # Zustand persisted store (v3)
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Quick start

```bash
# 1) Install dependencies
npm install

# 2) Dev server (http://localhost:3000)
npm run dev

# 3) Production build
npm run build && npm start

# 4) Type-check
npm run type-check
```

> **To test the scanner on a smartphone** you need HTTPS. Use a Vercel preview deploy, `cloudflared tunnel`, or `ngrok`.

---

## Deploy on Vercel

1. Push the repository to GitHub
2. [Import the project](https://vercel.com/new) on Vercel
3. Automatic deploy — no environment variables required

Vercel provides HTTPS out of the box (required for camera access and PWA install).

---

## Store API (Zustand)

| Action | Description |
|--------|-------------|
| `addBook(book, status)` | Add or change a book's status |
| `moveBook(id, status)` | Move between lists |
| `removeBook(id)` | Remove permanently |
| `rateBook(id, 0–5)` | Set star rating |
| `setProgress(id, 0–100)` | Set reading % |
| `setCurrentPage(id, n)` | Set current page — auto-calculates % from pageCount |
| `setNotes(id, text)` | Save personal notes |
| `setTags(id, tags[])` | Update collections |
| `importBooks(items[])` | Batch import (Goodreads CSV / JSON backup) |

State is persisted in `localStorage` under the key `bookdex-storage` (schema version 3).

---

## Roadmap

- [ ] Optional cloud sync (Supabase)
- [ ] Reading goal (books/year target)
- [ ] Reading streaks and heatmap
- [ ] Book highlights / quotes
- [ ] Share reading progress

---

## License

MIT © Forenaki

---

Made with care for readers.
