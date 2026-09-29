# Plav Hotel — website

Marketing and direct-booking website for **Plav Hotel**, a lakeside hotel and spa on Lake Plav in Plav, eastern Montenegro, beneath the Prokletije ("Accursed") mountains. Eight main pages plus a photo credits page; the home page opens onto a live 3D model of the valley with a booking bar, followed by a rate search with a "best rate direct" comparison against booking sites. There is also a virtual tour (an interactive 3D map, 360° spaces with in-tour booking, and a narrated guided tour), and enquiry forms for tables, treatments, events and reservations.

**Look — "Lakeside modern":** deep lake teal `#0F3B3F`, glacier `#CFE3E6`, stone `#F2EFE9` and brass `#B8894A`; Fraunces for headlines and Manrope for text; rounded, frosted-glass surfaces and pill buttons.

Built with **Next.js 16** (App Router, Turbopack), **React 19**, **TypeScript**, **CSS Modules** and **three.js**. An earlier design handoff for a different property is kept in [`design/`](design/README.md) for reference only; none of its names or copy are used on the site.

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

## Live preview (GitHub Pages)

Every push to `main` publishes a preview to **https://ariongj.github.io/hotelplav/** through `.github/workflows/pages.yml`.

GitHub Pages only serves static files, so the preview is a static export: the booking engine runs in the browser with the mock inventory, and forms show a "preview site — this request wasn't sent" note instead of reaching the hotel. To make the preview's forms deliver, create a form endpoint that accepts JSON (e.g. Formspree) and add it as the repository variable `NEXT_PUBLIC_ENQUIRY_ENDPOINT` (Settings → Secrets and variables → Actions → Variables). The preview is marked `noindex` so search engines skip it.

To build the same export locally: remove `src/app/api` from a copy of the project, then run `npm run build` with `NEXT_PUBLIC_STATIC_EXPORT=true` and `NEXT_PUBLIC_BASE_PATH=/hotelplav`; the site is written to `out/`. Internal links must use `next/link` so they pick up the `/hotelplav` base path.

## Deploy

- **Vercel** (recommended for the live site): import the GitHub repository, keep the detected Next.js settings, add the environment variables below, deploy.
- **Netlify** supports Next.js the same way.
- **Any Node.js host**: `npm ci && npm run build && npm start` (port 3000, or set `PORT`).

The pages are prerendered as static HTML; only `/api/availability` and `/api/enquiry` run on the server.

## Environment variables

Copy `.env.example` to `.env.local` for local work, or set these in the hosting dashboard.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public origin, e.g. `https://plavhotel.com` (placeholder — use the hotel's real domain) — canonical URLs, sitemap, structured data. |
| `ENQUIRY_WEBHOOK_URL` | Where form submissions are delivered (JSON POST). **Without it they are only written to the server log — set it before launch.** A Zapier or Make webhook can email reservations, post to Slack or feed a CRM. |

## Pages

| Route | Highlights |
| --- | --- |
| `/` | Live 3D valley hero with a glass booking bar, priced results with booking-site comparison and rate hold, rooms carousel, summer/winter switcher, 360° teaser, gallery, reviews, illustrated map |
| `/rooms` | Availability search, rate panel, filterable and sortable room grid (eight room types, 42 rooms) |
| `/dining` | A restaurant, a lounge and a bar: **The Lake Room** (breakfast, lunch, dinner, the chef's menu, and the lake terrace May–Oct — the only bookable venue), **The Fireside Lounge** (all-day lounge and wine bar, walk-in) and **The Boathouse Bar** (late bar with billiards, walk-in); table requests and an interactive chef's tasting menu |
| `/spa` | **The Lake Spa** — glass-walled indoor pools, an outdoor pool in summer, Finnish sauna, steam room and cold plunge, open to every hotel guest; treatment requests, filterable treatment menu, bathing ritual |
| `/tour` | 3D resort map (three.js), WebGL 360° viewer with hotspots and in-tour booking, guided tour with optional voice; deep links `/tour#room`, `/tour#hall`, `/tour#chapel`, `/tour#guided-tour` |
| `/events` | Events & weddings: the chapel, the ballroom and the lake terrace, corporate retreats, planning |
| `/experiences` | Summer and winter on and around the lake |
| `/contact` | Enquiry form (pre-filled from held rates via the URL), details, location |
| `/credits` | Every Wikimedia Commons photo on the site with its author, licence and the pages it appears on — collected from the content data, so it stays in sync |

## Project structure

```
src/
  app/                 routes, API routes, sitemap/robots, favicon, global styles and design tokens
  components/
    layout/            nav + mobile menu, footer, sticky reserve bar
    ui/                PageHero, Photo (next/image wrapper), PhotoCredit, scroll-reveal observer
    pano/              360° panorama viewer (WebGL) and lazy loader
    resort3d/          illustrated 3D resort map (three.js, loaded on demand) and its places
    home/ rooms/ dining/ spa/ tour/ events/ experiences/ contact/   page sections and their content.ts
  config/site.ts       hotel name, description, address, phone, emails, navigation, social and legal links
  lib/booking/         room catalogue, pricing rules, availability provider, search
  lib/enquiry*.ts      form validation and delivery
  styles/ui.module.css shared type and button primitives
design/                earlier design handoff for a different property (reference only)
```

Conventions: colours, fonts and spacing are CSS variables in `src/app/globals.css`; each component has a CSS Module next to it. Add `data-reveal="up|left|right"` (and optionally `data-delay="80"`) to any element below the fold to fade it in on scroll — keep it off above-the-fold headings and buttons, which must show before JavaScript loads. Copy and photos for each page live in its `content.ts`; values that exist in data (prices, venue names, tour scene names) are read from there rather than typed twice.

## Photography

- **Wikimedia Commons** — the lake and mountain views, the room photos and the 360° panoramas are Commons files used under their free licences (CC BY, CC BY-SA, CC0). Each carries a `credit` (author, licence, file page) in its content data; `<PhotoCredit>` prints it next to the image and `/credits` lists them all. Keep the credit for as long as a photo is used.
- **Placeholders** — hotel interiors (dining, spa, events, some rooms) are hot-linked from `static.wixstatic.com` until the hotel's own photography arrives.

## Booking engine

- **Rules** — seasons (peak ×1.15 in Jul, Aug, Dec, Jan; quiet ×0.86 in Apr, Nov), promo `DIRECT5` (−5%), stays of 1–21 nights, and the booking-site comparison (`nightly ÷ 0.82 + €28 breakfast per guest per night`) live in `src/lib/booking/pricing.ts`. Every "from €X" label uses `fromRate()` (the quiet-season rate), so a real quote never undercuts it.
- **Rooms** — the single source of truth is `src/lib/booking/rooms.ts` (rates, capacity, views, copy, photos and their credits).
- **Availability** — currently a deterministic mock. To go live, implement `AvailabilityProvider` in `src/lib/booking/availability.ts` for the hotel's PMS or channel manager (Cloudbeds, SiteMinder, HotelRunner, Opera, Mews) and return it from `getAvailabilityProvider()`. Keep API credentials in server-side environment variables.
- **Checkout** — "Hold this rate" notifies the reservations team (`stay-hold` enquiry) and "Complete reservation" opens the contact form pre-filled with the stay. Replace with the PMS checkout once connected.

## Virtual tour

- **3D map** (`src/components/resort3d/`) — a stylised, procedurally generated model of the valley: Lake Plav, the hotel, spa, terrace, chapel, a footpath climbing through the pines to a timber viewpoint shelter, forest and snowfall. The model has no lift: guests ski at Paljevi, half an hour's drive away. It is illustrative, not a survey of the real site. The same engine drives the home-page hero (`<ResortMap variant="hero" />`: no controls, a slow drift, page scroll untouched). Places and their copy live in `pois.ts`; building positions and camera angles in `resortEngine.ts`. three.js is code-split and downloaded only on the home and tour pages; phones get a lighter scene (no shadows, fewer trees), and motion respects `prefers-reduced-motion`.
- **360° spaces** — scenes, hotspots and the booking drawer are in `src/components/tour/content.ts`. Other pages link to scenes by their id and name, read from there.
- **Guided tour** — the stops and narration are in `src/components/tour/guide.ts`; each stop either flies the 3D camera to a place or opens a 360° space. It plays automatically (Back / Pause / Next, ← → keys) and can read the narration aloud with the browser's built-in speech.

## Forms

Every form posts to `/api/enquiry` with a type (`newsletter`, `contact`, `event`, `table`, `spa`, `stay-hold`, `viewing`), which is validated and delivered by `src/lib/enquiry.ts`. Forms include a honeypot field against bots; add rate limiting or a CAPTCHA if spam becomes a problem.

## Before launch

Placeholders still on the site:

- [ ] Phone number (`+382 00 000 000`), the `@plavhotel.com` emails and the `plavhotel.com` domain — in `src/config/site.ts` and `.env.example`.
- [ ] The favicon (`src/app/icon.svg`, a "P" over a wave) and the nav's lake-and-peak mark — replace with the hotel's logo.
- [ ] Interior photography hot-linked from `static.wixstatic.com`, and the Wikimedia Commons photos and 360° panoramas you'd rather replace with the hotel's own (≥ 8K equirectangular, 2:1, for the panoramas). When a Commons photo goes, drop its `credit` too — `/credits` updates itself. Then remove unused hosts from `images.remotePatterns` in `next.config.ts`.
- [ ] Social links and the Privacy, Terms, Cancellation and FAQ pages — set their `href` in `src/config/site.ts`; the footer hides any link still at `#`.
- [ ] The sample reviews, rating and review count on the home page (`src/components/home/content.ts`) — replace with real, verifiable ones.

To confirm with the hotel:

- [ ] Room facts: sizes, capacities, views, rates and the inventory per room type (it adds up to 42 rooms).
- [ ] Dining: the venue names (The Lake Room, The Fireside Lounge, The Boathouse Bar), opening hours, the lake terrace season, the chef's menu and prices.
- [ ] Spa: the name (The Lake Spa), facilities, treatments and prices.
- [ ] Events and experiences: venue capacities, the wedding offer and the activities offered.
- [ ] The 3D map's layout (building positions and the lake shape are illustrative).

Wiring:

- [ ] Set `ENQUIRY_WEBHOOK_URL` and send a test from each form.
- [ ] Connect availability to the PMS (see above).

## Facts used

Local facts are kept to what could be checked ([Wikipedia: Lake Plav](https://en.wikipedia.org/wiki/Lake_Plav)): Lake Plav lies at about 906 m in the Upper Lim valley in eastern Montenegro, near the Albanian and Kosovo borders. It is about 2.2 km long, north to south, glacial (about 10,000 years old) and the largest glacial lake in Montenegro; it freezes in winter. The Ljuča flows in from the south (from Gusinje) and the Lim flows out to the north; the Prokletije rise to the south and the Visitor range to the west. The site places the hotel on the eastern shore, looking west across the water to Visitor. The Paljevi ski slope is about half an hour's drive away, and Podgorica, the nearest international airport, about 2½ hours by car.

Claims that can't be backed are left out: no hot-spring or spa-water claims (Plav has no hot springs), no lift or pistes at the hotel, and no heritage dates — the hotel is presented as modern. Everything about the hotel itself (rooms, prices, dining venues, spa, events, reviews) is sample content.
