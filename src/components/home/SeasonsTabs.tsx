"use client";

import { useRef, useState, type KeyboardEvent } from "react";

import { Photo } from "@/components/ui/Photo";
import { PhotoCredit } from "@/components/ui/PhotoCredit";
import { cx } from "@/lib/cx";
import ui from "@/styles/ui.module.css";

import { seasons, type SeasonKey } from "./content";
import styles from "./sections.module.css";

const KEYS: readonly SeasonKey[] = ["summer", "winter"];
const LABELS: Record<SeasonKey, string> = { summer: "Summer", winter: "Winter" };

/** Summer / winter switcher: the same valley, two different holidays. */
export function SeasonsTabs() {
  const [active, setActive] = useState<SeasonKey>("summer");
  const tabRefs = useRef<Record<SeasonKey, HTMLButtonElement | null>>({ summer: null, winter: null });
  const season = seasons[active];

  function onKeyDown(event: KeyboardEvent) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const next = KEYS[(KEYS.indexOf(active) + 1) % KEYS.length];
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <>
      <div className={styles.seasonsHead}>
        <div>
          <div className={ui.eyebrow}>Two seasons</div>
          <h2 className={cx(ui.h2, styles.mt18)}>{season.title}</h2>
        </div>
        <div className={styles.seasonsSide}>
          <div className={styles.toggle} role="tablist" aria-label="Season" onKeyDown={onKeyDown}>
            {KEYS.map((key) => (
              <button
                key={key}
                ref={(node) => {
                  tabRefs.current[key] = node;
                }}
                type="button"
                role="tab"
                id={`season-tab-${key}`}
                aria-selected={active === key}
                aria-controls="season-panel"
                tabIndex={active === key ? 0 : -1}
                className={cx(styles.toggleButton, active === key && styles.toggleOn)}
                onClick={() => setActive(key)}
              >
                {key === "summer" ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                    <circle cx="8" cy="8" r="3.2" fill="currentColor" />
                    <path
                      d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.4 1.4M11.6 11.6 13 13M3 13l1.4-1.4M11.6 4.4 13 3"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                    <path
                      d="M8 1v14M2 4.5l12 7M2 11.5l12-7M6 2.2 8 3.6l2-1.4M6 13.8l2-1.4 2 1.4"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                )}
                {LABELS[key]}
              </button>
            ))}
          </div>
          <p className={cx(ui.lead, styles.seasonsLead)}>{season.lead}</p>
        </div>
      </div>

      <div
        id="season-panel"
        role="tabpanel"
        aria-labelledby={`season-tab-${active}`}
        className={styles.seasonGrid}
        key={active}
      >
        {season.items.map((item, i) => (
          <article key={item.title} className={styles.seasonCard} style={{ animationDelay: `${i * 70}ms` }}>
            <div className={styles.seasonPhoto}>
              <Photo
                src={item.image.src}
                alt={item.image.alt}
                position={item.image.position}
                sizes="(max-width: 700px) 50vw, (max-width: 1100px) 45vw, 300px"
              />
            </div>
            <div className={styles.seasonBody}>
              <h3 className={styles.seasonTitle}>{item.title}</h3>
              <p className={styles.seasonText}>{item.text}</p>
              <PhotoCredit credit={item.image.credit} tone="dark" className={styles.seasonCredit} />
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
