# Brezovica Hotel & SPA — website

Marketing and direct-booking website for a five-star alpine resort in Brezovica, beneath the Sharr Mountains: eight pages, a live rate search with a "best rate direct" comparison against booking sites, a virtual tour (an interactive 3D resort map, 360° spaces with in-tour booking, and a narrated guided tour), and enquiry forms for tables, treatments, events and reservations.

Built with **Next.js 16** (App Router, Turbopack), **React 19**, **TypeScript** and **CSS Modules**, from the high-fidelity design handoff in [`design/`](design/README.md).

## Quick start

Requires Node.js 20.9 or newer (24 LTS recommended).

```bash
npm install
npm run dev
```

Open http://localhost:3000.

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build (type-checks too) |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript only |

## Deploy

- **Vercel** (recommended): import the GitHub repository, keep the detected Next.js settings, add the environment variables below, deploy.
- **Netlify** supports Next.js the same way.
- **Any Node.js host**: `npm ci && npm run build && npm start` (port 3000, or set `PORT`).

The pages are prerendered as static HTML; only `/api/availability` and `/api/enquiry` run on the server.

## Environment variables

Copy `.env.example` to `.env.local` for local work, or set these in the hosting dashboard.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public origin, e.g. `https://brezovicahotel.com` — canonical URLs, sitemap, structured data. |
| `ENQUIRY_WEBHOOK_URL` | Where form submissions are delivered (JSON POST). **Without it they are only written to the server log — set it before launch.** A Zapier or Make webhook can email reservations, post to Slack or feed a CRM. |

## Pages

| Route | Design reference | Highlights |
| --- | --- | --- |
| `/` | `design/Aurelia.dc.html` | Scroll-driven cinematic hero, booking engine with booking-site comparison and rate hold, 360° teaser, gallery, offers |
| `/rooms` | `design/Rooms.dc.html` | Availability search, rate panel, filterable and sortable room grid |
| `/dining` | `design/Dining.dc.html` | Table requests, venues, interactive chef's tasting menu |
| `/spa` | `design/Spa.dc.html` | Treatment requests, filterable treatment menu, bathing ritual |
| `/tour` | `design/Tour.dc.html` | 3D resort map (three.js), WebGL 360° viewer with hotspots and in-tour booking, guided tour with optional voice; deep links `/tour#room`, `/tour#guided-tour` |
| `/events` | `design/Events.dc.html` | Weddings, venues, corporate, planning |
| `/experiences` | `design/Experiences.dc.html` | Winter and green-season activities |
| `/contact` | `design/Contact.dc.html` | Enquiry form (pre-filled from held rates via the URL), details, location |

## Project structure

```
src/
  app/                 routes, API routes, sitemap/robots, global styles and design tokens
  components/
    layout/            nav + mobile menu, footer, sticky reserve bar
    ui/                Photo (next/image wrapper), scroll-reveal observer
    pano/              360° panorama viewer (WebGL) and lazy loader
    resort3d/          illustrated 3D resort map (three.js, loaded on demand) and its places
    home/ rooms/ dining/ spa/ tour/ events/ experiences/ contact/   page sections
  config/site.ts       hotel name, address, phone, emails, navigation, social and legal links
  lib/booking/         room catalogue, pricing rules, availability provider, search
  lib/enquiry*.ts      form validation and delivery
  styles/ui.module.css shared type and button primitives
design/                original HTML prototypes and handoff notes (reference only)
```

Conventions: colours, fonts and spacing are CSS variables in `src/app/globals.css`; each component has a CSS Module next to it. Add `data-reveal="up|left|right"` (and optionally `data-delay="80"`) to any element to fade it in on scroll.

## Booking engine

- **Rules** — seasons (peak ×1.15 in Jul, Aug, Dec, Jan; quiet ×0.86 in Apr, Nov), promo `DIRECT5` (−5%), stays of 1–21 nights, and the booking-site comparison (`nightly ÷ 0.82 + €28 breakfast per guest per night`) live in `src/lib/booking/pricing.ts`.
- **Rooms** — the single source of truth is `src/lib/booking/rooms.ts` (rates, capacity, copy, photos).
- **Availability** — currently a deterministic mock. To go live, implement `AvailabilityProvider` in `src/lib/booking/availability.ts` for the hotel's PMS or channel manager (Cloudbeds, SiteMinder, HotelRunner, Opera, Mews) and return it from `getAvailabilityProvider()`. Keep API credentials in server-side environment variables.
- **Checkout** — "Hold this rate" notifies the reservations team (`stay-hold` enquiry) and "Complete reservation" opens the contact form pre-filled with the stay. Replace with the PMS checkout once connected.

## Virtual tour

- **3D resort map** (`src/components/resort3d/`) — a stylised, procedurally generated model of the valley: terrain, lake, hotel, spa, terrace, chapel, ski lift, forest and snowfall. It is illustrative, not a survey of the real site. Places and their copy live in `pois.ts`; building positions and camera angles in `resortEngine.ts`. three.js is code-split and only downloaded on the tour page; phones get a lighter scene (no shadows, fewer trees), and motion respects `prefers-reduced-motion`.
- **360° spaces** — scenes, hotspots and the booking drawer are in `src/components/tour/content.ts`.
- **Guided tour** — the stops and narration are in `src/components/tour/guide.ts`; each stop either flies the 3D camera to a place or opens a 360° space. It plays automatically (Back / Pause / Next, ← → keys) and can read the narration aloud with the browser's built-in speech.

## Forms

Every form posts to `/api/enquiry` with a type (`newsletter`, `contact`, `event`, `table`, `spa`, `stay-hold`), which is validated and delivered by `src/lib/enquiry.ts`. Forms include a honeypot field against bots; add rate limiting or a CAPTCHA if spam becomes a problem.

## Before launch

- [ ] Replace placeholder photography (hot-linked from `static.wixstatic.com`) and the 360° panoramas (Wikimedia Commons — attribute or replace) with the hotel's licensed images; then update `images.remotePatterns` in `next.config.ts`.
- [ ] Check the 3D map's layout against the real resort (building positions, the lake and the lift are illustrative).
- [ ] Set `ENQUIRY_WEBHOOK_URL` and send a test from each form.
- [ ] Connect availability to the PMS (see above).
- [ ] Verify trust figures, awards, reviews and ratings (the design shows both "8.7" and "4.9 / 5").
- [ ] Confirm room facts — e.g. the Chalet Residence is 180 m² / 6 guests here (the prototypes disagreed), "forty-two" vs "48" rooms, event capacities.
- [ ] Add real social links and the Privacy, Terms, Cancellation and FAQ pages (placeholders in `src/config/site.ts`).
- [ ] Confirm contact emails (the design uses both `events@` and `occasions@`).
