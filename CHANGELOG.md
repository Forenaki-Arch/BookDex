# Changelog

Tutti i cambiamenti significativi di BookDex sono documentati qui.
Il formato segue [Keep a Changelog](https://keepachangelog.com/it/1.1.0/) e il progetto aderisce al [Semantic Versioning](https://semver.org/lang/it/).

---

## [1.0.1] — 2026-04-23

### Fix — Build & deploy
- **Rimosso `next-pwa@5.6.0`**: il pacchetto non è più manutenuto ed è incompatibile con Next.js 14 App Router + `app/manifest.ts` (entrambi tentavano di generare un manifest causando build break su Vercel). L'app resta installabile grazie a `app/manifest.ts`; il supporto offline con service worker tornerà in 1.1 con un'alternativa moderna.
- **Upgrade `next-themes`** da `^0.3.0` a `^0.4.3`: `ThemeProviderProps` non era esportato in modo stabile dalla 0.3, causando errori TypeScript durante il build su Vercel. Ora i prop sono derivati direttamente dal componente con `React.ComponentProps<typeof NextThemesProvider>`.
- **Sonner**: aggiunto `import * as React from "react"` mancante in `components/ui/sonner.tsx` (usava `React.ComponentProps` senza importare il namespace).
- **Layouts**: sostituito `React.ReactNode` con `import type { ReactNode } from "react"` in `app/layout.tsx` e `(app)/layout.tsx` per evitare dipendenza dal namespace globale.
- Aggiunto `.nvmrc` (Node 20) per coerenza con Vercel.

### Aggiunto — Sicurezza
- **CSS injection defense**: nuova utility `safeImageUrl(url)` in `lib/utils.ts` che valida protocollo e caratteri pericolosi prima di iniettare URL in `background-image: url(...)`. Applicata nel `BookDetailDialog`.
- **Security headers** via `next.config.mjs` `headers()`:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(self), microphone=(), geolocation=()`

---

## [1.0.0] — 2026-04-22

Prima release pubblica di **BookDex**. Un tracker di libri completo, installabile, offline-first.

### Aggiunto — Core applicativo
- **Dashboard** con tre liste: `Da Leggere`, `In Lettura`, `Letti` tramite `Tabs` Radix.
- **Mini-statistiche** in dashboard con contatori animati per ogni lista.
- **Store Zustand** persistente in `localStorage` (`bookdex-storage`, `version: 1`) con API:
  - `addBook(book, status)`, `moveBook(id, status)`, `removeBook(id)`
  - `rateBook(id, 0–5)`, `setProgress(id, 0–100)`, `setNotes(id, notes)`
  - Selettori: `getByStatus`, `getById`, `has`
- **Hydration flag** per evitare flash di contenuti non persistiti.

### Aggiunto — Ricerca & dati
- **Ricerca testuale debounced** (400 ms) per titolo/autore/editore con `AbortController`.
- **Route API edge** `/api/books` che fa da proxy a Google Books, con cache edge (`s-maxage=3600`, `stale-while-revalidate=86400`).
- Normalizzazione payload Google Books: autori, ISBN-10/13, descrizione ripulita da HTML, prezzo (listPrice o retailPrice), categorie, lingua, pageCount, publisher, averageRating.
- **Skeleton loaders** a griglia durante il caricamento.
- Suggerimenti quando il campo di ricerca è vuoto.

### Aggiunto — Scanner ISBN
- Componente `BarcodeScanner` basato su `@zxing/library` con decoder continuo.
- Preferenza automatica per la fotocamera posteriore (`facingMode: environment`).
- Validazione ISBN-10 / ISBN-13 / EAN-13 (978/979) via regex.
- Gestione errori fotocamera: `NotAllowedError`, `NotFoundError`, `NotReadableError`, `SecurityError`.
- Cleanup automatico dello stream alla chiusura del dialog e all'unmount.
- **Animazioni**: mirino con angoli decorativi sequenziali, linea di scansione in loop, animazione di successo a molla.
- **Shortcut PWA**: apertura diretta dello scanner tramite `/app/search?scan=1`.

### Aggiunto — Gestione libri
- `BookDetailDialog`: scheda modale con copertina in alto su sfondo sfocato (background-image + blur + scale), metadata (anno, pagine, lingua, prezzo), descrizione scorribile, categorie.
- Azioni rapide per l'aggiunta a una delle tre liste (stato corrente evidenziato come `default`).
- Rimozione dalla libreria con conferma toast.
- `BookListItem` in dashboard con:
  - Cover cliccabile che apre il dettaglio
  - Progress bar interattiva con quick-buttons 10/25/50/75/100% (100% → sposta auto in "Letti" + toast 🎉)
  - Stelle di valutazione con hover-preview
  - Dropdown menu per spostare tra liste, impostare 5★, rimuovere
- `RatingStars`: componente accessibile con `role="radiogroup"`, preview al hover, size `sm|md|lg`.
- `BookCover`: componente riusabile con fallback e lift-on-hover.

### Aggiunto — Design system & temi
- **Tre temi** via `next-themes`:
  - `light` (default)
  - `dark` (blu notte, saturazioni ridotte)
  - `sepia` (palette carta/seppia con primary ambrato)
  - `system` (segue `prefers-color-scheme`)
- Variabili CSS in `globals.css` con HSL tokens standard Shadcn.
- Typography: **Inter** (sans) + **Lora** (serif) via `next/font` con `display: swap` e CSS variables.
- Animazioni custom Tailwind: `fade-up`, `scan-pulse`, `shimmer`, `gradient-shift`, `float`.
- Utility classes: `animated-gradient`, `glow-on-hover`, `text-balance`, `safe-top`, `safe-bottom`.
- Scrollbar stilizzata per Webkit.

### Aggiunto — Navigazione adattiva
- **Mobile**: `BottomNav` flottante stile iOS (pill animata con `layoutId`, safe-area per notch/gesture bar).
- **Desktop**: `Sidebar` con logo animato al hover (scale + rotate), pill animata, footer con tema switcher e versione.
- Rotte:
  - `/` — Landing page pubblica
  - `/app` — Dashboard liste
  - `/app/search` — Ricerca + scanner
  - `/app/settings` — Impostazioni

### Aggiunto — Landing page
- `Hero`: gradient mesh animato + 6 blob fluttuanti + badge versione + titolo con text-gradient animato e sparkles + mockup mobile animato (phone con 3 righe libro che progressivamente popolano).
- `Features`: 8 card (Scanner, Liste, Valutazioni, Temi, Installabile, Offline, Veloce, Privacy) con icone a gradiente e hover lift + glow.
- `HowItWorks`: 3 step numerati con linea di connessione orizzontale su desktop.
- `FAQ` con 5 domande, accordion animato (height auto + fade).
- `CTA` finale con gradient primary e pattern radiale.
- `LandingNav` sticky con blur-on-scroll, menu mobile toggleable, theme toggle integrato.
- `Footer` minimale con link app e repository.

### Aggiunto — PWA & performance
- `next-pwa` configurato con cache Workbox, auto-registrazione service worker (disabilitato in dev).
- `app/manifest.ts` dinamico con:
  - `display: standalone`
  - `theme_color`: `#2563eb`
  - Icone 192/512 + maskable 512 + apple-touch 180
  - **Shortcuts** PWA: "Scansiona ISBN" → `/app/search?scan=1`, "Libreria" → `/app`
- Ottimizzazione immagini Next per `books.google.com` (http/https) e `covers.openlibrary.org`.
- Script `scripts/generate-icons.mjs` per rigenerare le PNG dall'SVG sorgente (richiede `sharp`).
- Route API con `runtime = "edge"` per latenza minima.

### Aggiunto — Impostazioni
- Selettore tema (Light, Dark, Sepia, System).
- **Export JSON** della libreria con timestamp e version marker.
- Cancellazione totale con conferma nativa.
- Info versione e link repo.

### Aggiunto — Toast & feedback
- Integrazione `sonner` tramite `components/ui/sonner.tsx` con classNames on-brand.
- Toast per ogni azione utente: aggiunta, spostamento, rimozione, completamento libro (🎉), valutazione, errori API, errori fotocamera.

### Aggiunto — Accessibilità
- `aria-label` sui bottoni icon-only.
- `role="radiogroup"` sul rating stars.
- `aria-expanded` sull'accordion FAQ.
- Focus ring sui controlli.
- Contrasti WCAG AA verificati su tutti e tre i temi.
- `suppressHydrationWarning` su `<html>` per compatibilità `next-themes`.

### Tecnico
- TypeScript strict.
- ESLint (next/core-web-vitals).
- App Router di Next 14.
- `src/` layout con path alias `@/*`.
- Route group `(app)` per isolare il layout con sidebar/bottom-nav dalla landing pubblica.

---

[1.0.0]: https://github.com/Forenaki-Arch/BookDex/releases/tag/v1.0.0
