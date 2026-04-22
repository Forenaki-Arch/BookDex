# BookDex

> **Il tuo tracker personale di libri** — una PWA moderna, mobile-first, con scanner ISBN, liste intelligenti e un'interfaccia che ami guardare.

![version](https://img.shields.io/badge/version-1.0.0-blue) ![framework](https://img.shields.io/badge/Next.js-14-black) ![pwa](https://img.shields.io/badge/PWA-ready-success) ![license](https://img.shields.io/badge/license-MIT-green)

---

## Caratteristiche principali

### Gestione della libreria
- **Tre liste intelligenti**: `Da Leggere`, `In Lettura`, `Letti`
- Aggiungi, sposta o rimuovi libri con un tap
- **Valutazione a stelle** (0–5) per i libri completati
- **Tracciamento del progresso** (0–100%) per i libri in lettura, con quick-buttons (10/25/50/75/100%) e passaggio automatico a "Letti" al completamento
- **Statistiche** mini-dashboard nella home dell'app

### Scanner ISBN
- Accesso alla fotocamera con gestione errori (permesso negato, device non trovato, camera occupata)
- Lettura continua tramite [`@zxing/library`](https://github.com/zxing-js/library)
- Preferenza automatica per la **fotocamera posteriore** su mobile
- Validazione regex ISBN-10 / ISBN-13 / EAN-13 (978/979)
- Feedback visivo: mirino animato con angoli decorativi, linea di scansione, animazione di successo

### Ricerca
- Ricerca **debounced** (400 ms) per titolo, autore o editore
- Risultati con copertina, autore, titolo e metadati
- Proxy server-side `/api/books` → [Google Books API](https://developers.google.com/books) con caching edge (1h)
- **Skeleton loaders** durante il caricamento
- Scheda di dettaglio modale con sfondo sfocato dalla cover

### Design & UX
- **Tre temi**: Chiaro, Scuro, e un raffinato **Sepia/Paper** per la sensazione di carta stampata
- Rispetto del `prefers-color-scheme` di sistema (`next-themes`)
- **Layout adattivo**:
  - **Mobile** → Bottom navigation in stile iOS/Android (con safe-area `env(safe-area-inset-bottom)`)
  - **Desktop** → Sidebar laterale con icone animate (Framer Motion `layoutId`)
- **Animazioni** fluide con [Framer Motion](https://www.framer.com/motion/):
  - Transizioni di pagina e tab
  - Hover cards con effetto 3D / lift
  - Fade-up sequenziali sui risultati di ricerca
  - Pulse sul mirino scanner, spring-rotate sull'icona di successo
- **Landing page** con hero animato, mockup mobile e FAQ

### Performance & PWA
- **Installabile** su iOS, Android, Windows, macOS (next-pwa)
- **Offline-ready** con cache Workbox auto-generata
- **Manifest dinamico** (`app/manifest.ts`) con shortcuts e icone maskable
- **Edge runtime** per le API di ricerca su Vercel
- **Ottimizzazione immagini** nativa di Next (`next/image`)
- **Font optimization** con `next/font` (Inter + Lora)
- **Privacy-first**: tutto salvato in `localStorage`, zero tracking, zero account

---

## Stack tecnologico

| Area             | Tecnologia                          |
| ---------------- | ----------------------------------- |
| Framework        | Next.js 14 (App Router, TypeScript) |
| Styling          | Tailwind CSS                        |
| Componenti UI    | Radix UI + stile Shadcn             |
| Icone            | Lucide React                        |
| Animazioni       | Framer Motion                       |
| Stato client     | Zustand + persist middleware        |
| Temi             | next-themes                         |
| Scanner          | @zxing/library                      |
| Toast            | Sonner                              |
| PWA              | next-pwa                            |
| Dati libri       | Google Books API                    |

---

## Struttura del progetto

```
BookDex/
├── public/
│   ├── icons/              # Icone PWA (192, 512, maskable, apple-touch)
│   └── favicon.ico
├── scripts/
│   └── generate-icons.mjs  # Rigenera le icone PNG da SVG (richiede sharp)
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout (fonts, ThemeProvider, Toaster)
│   │   ├── page.tsx               # Landing page (/)
│   │   ├── globals.css            # Tailwind + CSS vars dei temi
│   │   ├── manifest.ts            # Manifest PWA dinamico
│   │   ├── api/
│   │   │   └── books/route.ts     # Proxy Google Books (edge runtime)
│   │   └── (app)/
│   │       ├── layout.tsx         # Layout adattivo Sidebar/BottomNav
│   │       └── app/
│   │           ├── page.tsx           # Dashboard liste
│   │           ├── search/page.tsx    # Ricerca + Scanner
│   │           └── settings/page.tsx
│   ├── components/
│   │   ├── ui/             # Primitive shadcn (button, dialog, tabs, ...)
│   │   ├── books/          # book-cover, book-list-item, book-detail-dialog, rating-stars
│   │   ├── scanner/        # barcode-scanner
│   │   ├── navigation/     # sidebar, bottom-nav
│   │   ├── landing/        # hero, features, how-it-works, faq, cta, footer, landing-nav
│   │   ├── theme-provider.tsx
│   │   └── theme-toggle.tsx
│   ├── hooks/
│   │   └── use-media-query.ts
│   ├── lib/
│   │   ├── api/books-api.ts
│   │   ├── types.ts
│   │   └── utils.ts
│   └── store/
│       └── books-store.ts  # Zustand persisted store
├── next.config.mjs          # next-pwa + image remote patterns
├── tailwind.config.ts       # Temi + animazioni custom
├── tsconfig.json
└── package.json
```

---

## Quick start

```bash
# 1) Installa le dipendenze
npm install

# 2) (Opzionale) Rigenera le icone PWA da SVG (richiede sharp)
npm i -D sharp
node scripts/generate-icons.mjs

# 3) Dev server (http://localhost:3000)
npm run dev

# 4) Build di produzione
npm run build && npm start

# 5) Type-check
npm run type-check
```

> **Per testare lo scanner su smartphone** serve HTTPS. Puoi usare Vercel preview, un tunnel come `cloudflared tunnel` o `ngrok`.

---

## Deploy su Vercel

1. Push del repository su GitHub
2. [Importa il progetto](https://vercel.com/new) su Vercel
3. Deploy automatico — nessuna variabile d'ambiente richiesta

Vercel fornisce HTTPS out-of-the-box (requisito per fotocamera e PWA).

---

## Funzionalità dettagliate

### Navigazione
- **Landing** (`/`): hero animato, features grid, come funziona, FAQ accordion, CTA finale
- **App** (`/app`): dashboard con tabs reading/to-read/read + statistiche
- **Ricerca** (`/app/search`): input debounced + bottone scanner. Supporta `?scan=1` per aprire lo scanner tramite shortcut PWA
- **Impostazioni** (`/app/settings`): tema, export/cancella libreria, info versione

### Store (Zustand)
- `addBook(book, status)` — aggiungi o cambia lo status di un libro
- `moveBook(id, status)` — spostamento tra liste
- `removeBook(id)`
- `rateBook(id, 0–5)`
- `setProgress(id, 0–100)` — impostazione percentuale
- `setNotes(id, notes)` — note personali
- Selettori: `getByStatus`, `getById`, `has`

Lo stato è persistito in `localStorage` con chiave `bookdex-storage` e versioning (`version: 1`).

### Scanner
- Chiede il permesso alla prima apertura, mostra messaggio appropriato in caso di `NotAllowedError`, `NotFoundError`, `NotReadableError`, `SecurityError`
- Stop automatico dello stream fotocamera all'unmount o dopo una scansione riuscita
- Delay di 600 ms tra detection e callback per lasciare riprodurre l'animazione di successo

### Accessibilità
- Labels ARIA su tutti i controlli icon-only
- Focus ring visibile
- Rispetto di `prefers-reduced-motion`
- Contrasti WCAG AA su tutti e tre i temi

---

## Roadmap v1.1+

- [ ] Sincronizzazione cloud opzionale (Supabase)
- [ ] Import da Goodreads CSV
- [ ] Statistiche annuali (libri letti, pagine, generi)
- [ ] Grafico progresso mensile
- [ ] Collezioni personalizzate (oltre le 3 liste)
- [ ] Note e highlights per libro
- [ ] Dark-schedule automatico basato su ora

---

## Licenza

MIT © BookDex contributors

---

Fatto con cura per i lettori.
