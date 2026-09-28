"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { PanoViewer, projectToView, type PanoHandle, type PanoView } from "@/components/pano/PanoViewer";

import { BookingDrawer, DEFAULT_NIGHTS } from "./BookingDrawer";
import { sceneIndex, sceneIndexFromHash, sceneLabel, scenes, type Hotspot, type TourOffer } from "./content";
import { preloadPanoramas } from "./preload";
import { SceneDetails } from "./SceneDetails";
import { SceneRail } from "./SceneRail";
import { SpacesGrid } from "./SpacesGrid";
import styles from "./TourExplorer.module.css";

/** Degrees per second, after 3.5 s without interaction. */
const AUTOROTATE = 1.6;
/** How long an info hotspot's note stays up. */
const CAPTION_MS = 7000;
/** Room left above the viewer for the fixed nav when scrolling to it. */
const NAV_CLEARANCE = 72;

/** A hotspot button and the direction it is pinned to. */
type Pin = { el: HTMLButtonElement; yaw: number; pitch: number };

/**
 * The interactive tour: the 360° viewer with its hotspots, caption and
 * booking drawer, then the scene rail, the current scene's details and the
 * "Four spaces" grid — all following the current scene.
 */
export function TourExplorer() {
  const [index, setIndex] = useState(0);
  const [caption, setCaption] = useState<{ note: string } | null>(null);
  const [booking, setBooking] = useState<{ offer: TourOffer; id: number } | null>(null);
  const [nights, setNights] = useState(DEFAULT_NIGHTS);

  const viewerRef = useRef<HTMLElement>(null);
  const panoRef = useRef<PanoHandle>(null);
  /** Mirrors `index` for event handlers and the frame loop. */
  const indexRef = useRef(0);
  const pins = useRef<(Pin | null)[]>([]);
  const bookingCount = useRef(0);
  const warmed = useRef(false);

  const scene = scenes[index];

  /** Switch space (wrapping around); `scroll` also brings the viewer into view. */
  const go = useCallback((target: number, scroll = false) => {
    const next = ((target % scenes.length) + scenes.length) % scenes.length;
    if (next === indexRef.current && !scroll) return;
    setCaption(null);
    setBooking(null);
    if (next === indexRef.current) {
      // Re-entering the current space starts it again from its opening view.
      const { yaw, pitch, fov } = scenes[next];
      panoRef.current?.setScene({ yaw, pitch, fov });
    } else {
      indexRef.current = next;
      setIndex(next);
    }
    const viewer = viewerRef.current;
    if (scroll && viewer) {
      const top = viewer.getBoundingClientRect().top + window.scrollY - NAV_CLEARANCE;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: Math.max(0, top), behavior: reduce ? "auto" : "smooth" });
    }
  }, []);

  const closeBooking = useCallback(() => setBooking(null), []);

  // Runs after every rendered frame: pin the hotspots by writing CSS variables
  // straight onto them (no re-render), and once the first panorama shows,
  // start fetching the others.
  const onFrame = useCallback((view: PanoView) => {
    for (const pin of pins.current) {
      if (!pin) continue;
      const at = projectToView(view, pin.yaw, pin.pitch);
      const { style } = pin.el;
      if (!at) {
        style.setProperty("--ho", "0");
        style.setProperty("--hp", "none");
        continue;
      }
      style.setProperty("--hx", `${at.x.toFixed(2)}%`);
      style.setProperty("--hy", `${at.y.toFixed(2)}%`);
      style.setProperty("--ho", at.opacity < 1 ? at.opacity.toFixed(2) : "1");
      style.setProperty("--hp", "auto");
    }
    if (view.ready && !warmed.current) {
      warmed.current = true;
      const from = indexRef.current;
      const others = scenes.map((_, k) => scenes[(from + 1 + k) % scenes.length].src).slice(0, -1);
      void preloadPanoramas(others);
    }
  }, []);

  function onHotspot(hotspot: Hotspot) {
    if (hotspot.kind === "nav") {
      go(sceneIndex(hotspot.target));
      return;
    }
    panoRef.current?.lookAt({ yaw: hotspot.yaw, pitch: hotspot.pitch });
    if (hotspot.kind === "info") {
      setBooking(null);
      setCaption({ note: hotspot.note });
    } else {
      setCaption(null);
      bookingCount.current += 1;
      setBooking({ offer: hotspot.offer, id: bookingCount.current });
    }
  }

  // Tabbing onto a hotspot that is out of view turns the camera toward it.
  function revealHotspot(hotspot: Hotspot, el: HTMLElement) {
    const pano = panoRef.current;
    const view = pano?.getView();
    if (!pano || !view || !el.matches(":focus-visible")) return;
    if (!projectToView(view, hotspot.yaw, hotspot.pitch)) pano.lookAt({ yaw: hotspot.yaw, pitch: hotspot.pitch });
  }

  // An info note clears itself; a new note restarts the clock.
  useEffect(() => {
    if (!caption) return;
    const timer = setTimeout(() => setCaption(null), CAPTION_MS);
    return () => clearTimeout(timer);
  }, [caption]);

  // ← / → switch spaces from anywhere on the page, except in form fields.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      const target = e.target;
      if (target instanceof HTMLElement && (/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) || target.isContentEditable)) {
        return;
      }
      go(indexRef.current + (e.key === "ArrowRight" ? 1 : -1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  // Deep links (/tour#room, #chapel, #scene-2 …) open that space.
  useEffect(() => {
    const target = sceneIndexFromHash(window.location.hash);
    if (target < 0) return;
    const timer = setTimeout(() => go(target, true), 60);
    return () => clearTimeout(timer);
  }, [go]);

  return (
    <>
      <section ref={viewerRef} className={styles.viewer} data-nav-anchor>
        <PanoViewer
          ref={panoRef}
          className={styles.pano}
          src={scene.src}
          yaw={scene.yaw}
          pitch={scene.pitch}
          fov={scene.fov}
          label={sceneLabel(scene)}
          autorotate={AUTOROTATE}
          onFrame={onFrame}
        >
          <div className={styles.hotspots}>
            {scene.hotspots.map((hotspot, i) => (
              // Keyed by position: the buttons are reused across scenes, so a
              // focused hotspot keeps focus when it switches scene.
              <button
                key={i}
                ref={(el) => {
                  pins.current[i] = el ? { el, yaw: hotspot.yaw, pitch: hotspot.pitch } : null;
                }}
                type="button"
                className={styles.hotspot}
                aria-label={hotspot.label}
                aria-haspopup={hotspot.kind === "book" ? "dialog" : undefined}
                onClick={() => onHotspot(hotspot)}
                onFocus={(e) => revealHotspot(hotspot, e.currentTarget)}
              >
                <span className={styles.hotspotIcon} aria-hidden="true">
                  {hotspot.icon}
                </span>
                {hotspot.label}
              </button>
            ))}
          </div>

          <div className={styles.captionSlot} role="status">
            {caption && <div className={styles.caption}>{caption.note}</div>}
          </div>

          {booking && (
            <BookingDrawer
              key={booking.id}
              offer={booking.offer}
              scene={scene.name}
              nights={nights}
              onNights={setNights}
              onClose={closeBooking}
            />
          )}
        </PanoViewer>

        {/* Announces scene changes, e.g. from the arrow keys. */}
        <p className="visually-hidden" aria-live="polite">
          {sceneLabel(scene)}
        </p>
      </section>

      <SceneRail scenes={scenes} current={index} onSelect={go} onStep={(delta) => go(index + delta)} />
      <SceneDetails scene={scene} />
      <SpacesGrid scenes={scenes} onEnter={(i) => go(i, true)} />
    </>
  );
}
