"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";

import type { SceneId } from "@/components/tour/content";
import { cx } from "@/lib/cx";

import { getPoi, pois, type PoiId } from "./pois";
import type { PinPosition, ResortEngine, ViewId } from "./resortEngine";
import styles from "./ResortMap.module.css";

export type MapFocus = { id: ViewId; nonce: number };

type ResortMapProps = {
  /** Where the camera should be; a new object (nonce) flies there again. */
  focus: MapFocus;
  /** A guided tour is running: gentle orbit, explore controls hidden. */
  touring?: boolean;
  /** Highlighted place; in explore mode its card is shown. */
  selected?: PoiId | null;
  onSelect?: (id: PoiId) => void;
  onCloseSelected?: () => void;
  onEnter360?: (scene: SceneId) => void;
  /** Overlays drawn above the map (e.g. the guide card). */
  children?: ReactNode;
  className?: string;
};

/**
 * Illustrative 3D map of the resort. three.js and the scene are loaded on
 * mount (code-split), so pages without the map never download them.
 */
export function ResortMap({
  focus,
  touring = false,
  selected = null,
  onSelect,
  onCloseSelected,
  onEnter360,
  children,
  className,
}: ResortMapProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const pinRefs = useRef<Partial<Record<PoiId, HTMLButtonElement | null>>>({});
  const engineRef = useRef<ResortEngine | null>(null);
  const focusRef = useRef(focus);
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");
  const [interacted, setInteracted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let engine: ResortEngine | null = null;

    const placePins = (pins: PinPosition[]) => {
      for (const pin of pins) {
        const el = pinRefs.current[pin.id];
        if (!el) continue;
        el.style.setProperty("--px", `${pin.x.toFixed(2)}%`);
        el.style.setProperty("--py", `${pin.y.toFixed(2)}%`);
        el.style.setProperty("--po", pin.visible ? "1" : "0");
        el.style.setProperty("--pe", pin.visible ? "auto" : "none");
      }
    };

    import("./resortEngine")
      .then(({ ResortEngine }) => {
        const host = hostRef.current;
        if (cancelled || !host) return;
        if (!ResortEngine.isSupported()) {
          setStatus("failed");
          return;
        }
        engine = new ResortEngine(host, {
          reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
          onPins: placePins,
          onInteract: () => setInteracted(true),
        });
        engineRef.current = engine;
        if (focusRef.current.id !== "overview") engine.flyTo(focusRef.current.id);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("failed");
      });

    return () => {
      cancelled = true;
      engine?.dispose();
      engineRef.current = null;
    };
  }, []);

  // Fly whenever the requested focus changes.
  useEffect(() => {
    focusRef.current = focus;
    engineRef.current?.flyTo(focus.id);
  }, [focus]);

  useEffect(() => {
    engineRef.current?.setTourMode(touring);
  }, [touring, status]);

  const card = !touring && selected ? getPoi(selected) : null;

  return (
    <div className={cx(styles.map, className)}>
      <div
        ref={hostRef}
        className={styles.canvas}
        role="img"
        aria-label="Illustrated 3D map of the resort: the hotel, spa, dining terrace, chapel, lake and ski lift in the Sharr valley"
      />

      {status === "ready" && (
        <div className={cx(styles.pins, touring && styles.pinsTouring)}>
          {pois.map((poi) => (
            <button
              key={poi.id}
              ref={(el) => {
                pinRefs.current[poi.id] = el;
              }}
              type="button"
              className={cx(styles.pin, selected === poi.id && styles.pinActive)}
              aria-label={`${poi.name}: show on the map`}
              aria-pressed={selected === poi.id}
              tabIndex={touring ? -1 : undefined}
              onClick={() => onSelect?.(poi.id)}
            >
              <span className={styles.pinLabel}>{poi.name}</span>
              <span className={styles.pinDot} aria-hidden="true" />
            </button>
          ))}
        </div>
      )}

      {card && (
        <div className={styles.card} role="dialog" aria-label={card.name}>
          <button type="button" className={styles.cardClose} aria-label="Close" onClick={onCloseSelected}>
            &times;
          </button>
          <div className={styles.cardKicker}>On the map</div>
          <h3 className={styles.cardTitle}>{card.name}</h3>
          <p className={styles.cardText}>{card.blurb}</p>
          <div className={styles.cardActions}>
            {card.scene && (
              <button type="button" className={styles.cardPrimary} onClick={() => onEnter360?.(card.scene!)}>
                Step inside &middot; 360&deg;
              </button>
            )}
            <Link href={card.link.href} className={styles.cardLink}>
              {card.link.label} &rarr;
            </Link>
          </div>
        </div>
      )}

      {status === "ready" && !touring && (
        <>
          <div className={cx(styles.hint, interacted && styles.hintHidden)} aria-hidden="true">
            Drag to explore &middot; pinch or scroll to zoom
          </div>
          <div className={styles.controls}>
            <button type="button" className={styles.control} aria-label="Zoom out" onClick={() => engineRef.current?.zoomBy(1.25)}>
              &minus;
            </button>
            <button type="button" className={styles.control} aria-label="Zoom in" onClick={() => engineRef.current?.zoomBy(0.8)}>
              +
            </button>
            <button
              type="button"
              className={styles.control}
              aria-label="Show the whole valley"
              title="Show the whole valley"
              onClick={() => {
                onCloseSelected?.();
                engineRef.current?.flyTo("overview");
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <path d="M2.5 7a4.5 4.5 0 1 0 1.3-3.2M2.5 1.5v2.8h2.8" stroke="currentColor" fill="none" strokeWidth="1.5" />
              </svg>
            </button>
          </div>
        </>
      )}

      {status === "loading" && (
        <div className={styles.loader}>
          <div className={styles.spinner} />
          <div className={styles.loaderText}>Building the valley</div>
        </div>
      )}

      {status === "failed" && (
        <div className={styles.failed} role="alert">
          <p>The 3D map needs WebGL, which is switched off in this browser.</p>
          <button type="button" className={styles.cardPrimary} onClick={() => onEnter360?.("hall")}>
            Open the 360&deg; spaces
          </button>
        </div>
      )}

      {children}
    </div>
  );
}
