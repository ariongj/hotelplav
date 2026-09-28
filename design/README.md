# Handoff: Aurelia Brezovica — 5-star resort website

## Overview
Marketing + direct-booking website for a 5-star alpine resort in Brezovica (Sharr Mountains). Eight pages, experience-led (spa, dining, activities), with a working availability/rate search, OTA price comparison ("best rate direct"), and a 360° virtual tour with in-tour booking.

## About the design files
The `.dc.html` files are **design references built in HTML** — prototypes showing intended look and behaviour, not production code. Recreate them in the target stack (recommended if starting fresh: **Next.js (App Router) + TypeScript + Tailwind or CSS Modules**, deployed on Vercel/Netlify). Each file opens directly in a browser (keep `support.js` alongside) for reference. All styling is inline in the prototypes; extract it into components/tokens during the rebuild.

## Fidelity
**High-fidelity.** Final colours, type, spacing, copy and interactions. Recreate pixel-accurately. Imagery is placeholder (Wikimedia/stock URLs and `<image-slot>` drop zones) — replace with the hotel's licensed photography.

## Pages
| File | Route | Sections (top → bottom) |
|---|---|---|
| Aurelia.dc.html | `/` | Nav · Mobile menu · Cinematic hero · Booking bar + live results · Trust strip · Statement · Rooms · Dining (dark) · Spa · Virtual tour teaser · Events · Gallery · Offers · Reviews · Location · Final CTA · Footer · Sticky reserve bar |
| Rooms.dc.html | `/rooms` | Nav · Header · Availability bar · Rate results · Filter toolbar · Room grid · Concierge strip · Footer · Sticky reserve |
| Dining.dc.html | `/dining` | Nav · Hero · Table reservation bar · Statement · Venues · Chef's tasting (dark, interactive) · Hours · Sommelier strip · Footer · Sticky reserve |
| Spa.dc.html | `/spa` | Nav · Hero · Treatment booking bar · Thermal baths · Treatments (filterable) · Bathing ritual (dark) · Concierge · 360 strip · Footer · Sticky book |
| Tour.dc.html | `/tour` | Full-screen 360° viewer, scene rail, info panel, hotspots, in-tour booking drawer |
| Events.dc.html | `/events` | Weddings, meetings, venues, enquiry |
| Experiences.dc.html | `/experiences` | Seasonal activities (ski, hiking, lake, culture) |
| Contact.dc.html | `/contact` | Enquiry form (type: Reservation enquiry etc.), map, contact details |

Shared on every page: sticky top nav (transparent over hero → solid `#F3ECE0` on scroll), mobile full-screen menu, footer, sticky bottom reserve bar (appears after scrolling past hero; mobile thumb-zone CTA, min 48px targets).

## Booking engine (home + rooms) — key behaviour
Inputs: check-in, check-out (defaults: today+30, +2 nights), guests (`1 Guest`, `2 Guests`, `3 Guests`, `4+`…), room type, promo code.

**Search (`onBook`)**
- Validate nights = checkout − checkin. `≤0` → error "Choose a check-out date after your check-in…". `>21` → "Stays beyond 21 nights are arranged personally…".
- Season by check-in month: Peak (Jul, Aug, Dec, Jan) ×1.15 · Quiet (Apr, Nov) ×0.86 · Shoulder (others) ×1.00.
- Base nightly rates (EUR, incl. breakfast, thermal spa, taxes): Deluxe Alpine Room 420 · Junior Suite 560 · Presidential Suite 680 · Panorama Suite 980 · Chalet Residence 1,480.
- Promo `DIRECT5` (case-insensitive) → ×0.95.
- Direct total = nightly × nights. OTA comparison = (nightly / 0.82) × nights + €28 × guests × nights. Saving = OTA − direct.
- Capacity: Deluxe 2 · Junior 2 · Presidential 3 · Panorama 4 · Chalet 6. Rooms too small for guest count are shown disabled ("Sleeps N — too small for X guests").
- Availability in the prototype is a deterministic mock (hash of room+date → 0–4 rooms). **Replace with the PMS/channel manager API** (Cloudbeds, SiteMinder, HotelRunner, Opera or Mews). 0 → "Not available on these dates", 1 → "Last room at this rate", n → "n rooms left".

**Results list**: header "X of 5 room types available · N nights", sub "Season rate · guests · promo". Each row: name, meta (size · guests · view · bed), availability label, direct total (Bodoni 24px `#7a5c2f`), per-night, OTA price struck-through, "Save €X vs booking sites", Select button. Selected row: border `#B08E55`, bg `#F1E6CF`. Unavailable: opacity .55, outline button.

**Selection panel** (dark `#241a12`): name, meta, Direct total, Booking sites (struck), You keep. "Hold this rate" → message "Held for 30 minutes at €X…" + "Complete reservation" (→ `/contact` in prototype; in production → PMS checkout). Sticky bar label updates to "Room · €total for N nights, direct".

## 360° tour
- Custom WebGL equirectangular viewer in `pano-view.js` (attrs: `src, yaw, pitch, fov, autorotate, label`; API `setScene()`). In production either port it or use Photo Sphere Viewer / Marzipano.
- Scenes: 01 Sharr Valley (aerial) · 02 Grand Hall · 03 Alpine Room · 04 Chapel · further scenes in file. Each: kicker, description, 3 facts, CTA link, start yaw/pitch/fov.
- Hotspots inside scenes open contextual info; room scene exposes "Book this room" → in-tour drawer (nights stepper, price, confirm) without leaving the tour.
- Replace Wikimedia panoramas with commissioned 360 captures (≥ 8K equirectangular, 2:1).

## Other interactions
- Spa treatments filter by category; Rooms grid filter/sort; Dining tasting menu stepper.
- Scroll-linked hero parallax and fade-in reveals (≈600–900ms, ease-out); respect `prefers-reduced-motion`.
- Season chip in booking bar shows "Season · no booking fees".
- Forms: required-field validation, inline confirmation message on submit.

## Design tokens
**Colour**
- Ink `#2B2721` · Body `#4c463d` / `#5c5344` · Muted `#8f8272` · Faint `#a79c88`
- Paper `#F3ECE0` · Card `#F7F2E7` · Light `#FBF8F1` / `#FEFCF8` · Note `#EFE6D3`
- Lines `#E4D9C4` `#E7DBC4` `#D9CDB8` `#D3C6AE`
- Gold `#B08E55` (primary CTA) · Gold dark `#8f7040` / `#8a6b34` · Bronze text `#7a5c2f` · Gold light `#C9B48A` · Highlight `#E7C98F`
- Dark `#241a12` · Deeper `#17110B` · CTA text on gold `#231a10` · Cream on dark `#F5EEE1` / `#F7F1E7`

**Type** (Google Fonts)
- Display: **Bodoni Moda** 400 — headings 21–28px in UI, hero `clamp()` up to ~88px
- Text/UI: **Jost** 300/400/500/600 — body 15–17px/1.6; labels 10–11px, weight 500–600, letter-spacing .16–.26em, uppercase

**Spacing / shape**
- Section padding `clamp(20px,6vw,120px)` horizontal; content max-width 1180px
- Radius 2px (buttons), 3px (cards/panels)
- Buttons: min-height 48–54px, padding 14–17px × 20–28px
- Gaps: 10 / 14 / 18 / 22 / 36px

## Trust layer
Trust strip under booking: Guest rating 4.9/5 · 1,240 reviews; World Luxury Hotel Awards — Alpine Retreat 2025; Condé Nast Traveller Readers' Choice; Booking direct — price matched, no fees, free cancellation to 48h. **These are placeholders — replace with verified figures** (or pull live from TrustYou / Google reviews API).

## Assets
- Photography: placeholder URLs / `<image-slot>` drop zones — supply real images.
- 360 panoramas: Wikimedia Commons placeholders — replace.
- No icon library; minimal inline glyphs only.

## Files
Design references: `Aurelia.dc.html`, `Rooms.dc.html`, `Dining.dc.html`, `Spa.dc.html`, `Tour.dc.html`, `Events.dc.html`, `Experiences.dc.html`, `Contact.dc.html`. Runtime: `support.js` (prototype only), `pano-view.js` (360 viewer, reusable), `image-slot.js` (prototype only).

## Suggested build order
1. Tokens + layout shell (nav, footer, sticky bar)
2. Home page
3. Booking search component + API adapter (mock → PMS)
4. Rooms, Dining, Spa
5. Tour (viewer + hotspots + drawer)
6. Events, Experiences, Contact
7. SEO (Hotel schema.org), analytics on search/select/hold events, performance pass (images AVIF/WebP, lazy panoramas)
