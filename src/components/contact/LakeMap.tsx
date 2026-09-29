import styles from "./LakeMap.module.css";

/* Lake outline, drawn north–south as it lies (Lake Plav is ~2.2 km long, ~0.9 km wide). */
const LAKE =
  "M302 118 C350 116 378 158 372 210 C366 262 384 312 352 346 C326 372 272 370 250 338 C226 304 240 262 232 218 C224 170 252 120 302 118 Z";

/** Houses of the town, where the Lim leaves the lake to the north. */
const TOWN: readonly [number, number, number, number][] = [
  [338, 70, 10, 10],
  [354, 60, 12, 9],
  [350, 82, 9, 9],
  [368, 74, 11, 10],
  [384, 64, 9, 9],
  [364, 94, 10, 8],
  [380, 88, 9, 9],
  [396, 80, 8, 8],
];

/**
 * Illustrated map of Lake Plav — shapes in SVG, labels in HTML so they stay
 * readable at any size. Label positions are percentages of the 600 × 500
 * drawing. Illustrative, not to scale; no external map embed.
 */
export function LakeMap() {
  return (
    <div
      className={styles.map}
      role="img"
      aria-label="Illustrated map of Lake Plav: Plav Hotel on the lake's eastern shore near the town of Plav, the River Lim flowing out to the north, the Visitor range to the west and the Prokletije mountains to the south."
    >
      <svg className={styles.svg} viewBox="0 0 600 500" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="lakemap-water" x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0" className={styles.waterTop} />
            <stop offset="1" className={styles.waterBottom} />
          </linearGradient>
          <radialGradient id="lakemap-sun" cx="0.85" cy="0.1" r="0.8">
            <stop offset="0" className={styles.sunIn} />
            <stop offset="1" className={styles.sunOut} />
          </radialGradient>
          <path id="lakemap-lake" className={styles.lakePath} d={LAKE} />
        </defs>

        {/* Land, with a little morning light. */}
        <rect width="600" height="500" className={styles.land} />
        <rect width="600" height="500" fill="url(#lakemap-sun)" />

        {/* Contours around the basin. */}
        <g className={styles.contours}>
          <use href="#lakemap-lake" transform="translate(302 244) scale(1.22) translate(-302 -244)" />
          <use href="#lakemap-lake" transform="translate(302 244) scale(1.48) translate(-302 -244)" />
          <use href="#lakemap-lake" transform="translate(302 244) scale(1.8) translate(-302 -244)" />
        </g>

        {/* Visitor, to the west and north-west. */}
        <path
          className={styles.ridgeFar}
          d="M0 252 L0 150 L28 128 L52 142 L88 82 L118 118 L140 100 L176 158 L200 198 L182 252 Z"
        />
        <path className={styles.snow} d="M88 82 L77 97 L86 93 L92 100 L101 95 Z" />
        <path className={styles.snow} d="M140 100 L131 112 L139 109 L145 115 L151 110 Z" />

        {/* Prokletije, the "Accursed Mountains", to the south. */}
        <path
          className={styles.ridgeFar}
          d="M0 500 L0 440 L36 410 L66 424 L118 356 L156 398 L186 378 L232 440 L256 452 L290 432 L330 452 L372 392 L410 420 L452 344 L494 396 L528 372 L566 420 L600 400 L600 500 Z"
        />
        <path
          className={styles.ridgeNear}
          d="M330 500 L382 434 L414 454 L462 390 L506 442 L540 422 L600 462 L600 500 Z"
        />
        <path className={styles.snow} d="M118 356 L106 372 L114 369 L120 376 L128 368 Z" />
        <path className={styles.snow} d="M452 344 L438 362 L447 358 L454 366 L462 357 Z" />
        <path className={styles.snow} d="M372 392 L362 405 L370 402 L375 408 L381 402 Z" />

        {/* Rivers: the Ljuča flows in from the south, the Lim out to the north. */}
        <path className={styles.river} d="M248 506 C262 470 238 440 262 408 C280 384 298 380 300 366" />
        <path className={styles.river} d="M302 122 C298 92 324 70 318 40 C314 18 330 4 334 -6" />

        {/* The lake: a pale shore, the water, a deeper centre and a few ripples. */}
        <use href="#lakemap-lake" className={styles.shore} />
        <use href="#lakemap-lake" fill="url(#lakemap-water)" />
        <use
          href="#lakemap-lake"
          className={styles.deep}
          transform="translate(304 240) scale(0.62) translate(-304 -240)"
        />
        <g className={styles.ripples}>
          <path d="M268 184 q15 -6 30 0 t30 0" />
          <path d="M292 290 q12 -5 24 0 t24 0" />
          <path d="M262 320 q14 -6 28 0 t28 0" />
        </g>

        {/* Plav. */}
        <g className={styles.town}>
          {TOWN.map(([x, y, w, h]) => (
            <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} rx="2" />
          ))}
        </g>
      </svg>

      <span className={styles.lakeLabel} style={{ left: "50.3%", top: "49%" }} aria-hidden="true">
        Lake Plav
        <span className={styles.lakeHeight}>906 m</span>
      </span>
      <span className={styles.townLabel} style={{ left: "69.4%", top: "15.6%" }} aria-hidden="true">
        Plav
      </span>
      <span className={styles.riverLabel} style={{ left: "55%", top: "6.4%" }} aria-hidden="true">
        Lim
      </span>
      <span className={styles.riverLabelEnd} style={{ left: "39.5%", top: "90%" }} aria-hidden="true">
        Ljuča
      </span>
      <span className={styles.rangeLabel} style={{ left: "15.5%", top: "46%" }} aria-hidden="true">
        Visitor
      </span>
      <span className={styles.rangeLabel} style={{ left: "77%", top: "93%" }} aria-hidden="true">
        Prokletije
      </span>

      <span className={styles.marker} style={{ left: "64%", top: "39.2%" }} aria-hidden="true">
        <span className={styles.pulse} />
        <span className={styles.pin} />
        <span className={styles.pinLabel}>Plav Hotel</span>
      </span>

      <span className={styles.compass} aria-hidden="true">
        N
      </span>
      <span className={styles.note} aria-hidden="true">
        Illustrative &middot; not to scale
      </span>
    </div>
  );
}
