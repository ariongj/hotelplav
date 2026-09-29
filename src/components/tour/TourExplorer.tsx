"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { PanoViewer, projectToView, type PanoHandle, type PanoView } from "@/components/pano/PanoViewer";
import type { PoiId } from "@/components/resort3d/pois";
import { ResortMap, type MapFocus } from "@/components/resort3d/ResortMap";
import type { ViewId } from "@/components/resort3d/resortEngine";
import { cx } from "@/lib/cx";

import { BookingDrawer, DEFAULT_NIGHTS } from "./BookingDrawer";
import { sceneIndex, sceneIndexFromHash, sceneLabel, scenes, type Hotspot, type SceneId, type TourOffer } from "./content";
import { GuideCard } from "./GuideCard";
import { guideMinutes, guideStops, type GuideStop } from "./guide";
import { preloadPanoramas } from "./preload";
import { SceneDetails } from "./SceneDetails";
import { SceneRail } from "./SceneRail";
import { SpacesGrid } from "./SpacesGrid";
import styles from "./TourExplorer.module.css";
import { useGuidedTour } from "./useGuidedTour";

/** Degrees per second, after 3.5 s without interaction. */
const AUTOROTATE = 1.6;
/** How long an info hotspot's note stays up. */
const CAPTION_MS = 7000;
/** Room left above the viewer for the fixed nav when scrolling to it (matches html scroll-padding-top). */
const NAV_CLEARANCE = 84;

/** "map": the illustrated 3D map of the hotel and lake. "space": the 360° panoramas. */
type Mode = "map" | "space";

/** A hotspot button and the direction it is pinned to. */
type Pin = { el: HTMLButtonElement; yaw: number; pitch: number };

/** The map place a guide stop is about — none for the wide views. */
function stopPlace(stop: GuideStop): PoiId | null {
  if (stop.kind !== "map" || stop.view === "overview" || stop.view === "hero") return null;
  return stop.view;
}

/**
 * The interactive tour: a stage that shows either the 3D map or the
 * 360° spaces (with hotspots, caption and booking drawer), a guided tour that
 * moves between the two, then the scene rail, the current space's details and
 * the "Four spaces" grid.
 */
export function TourExplorer() {
  const [mode, setMode] = useState<Mode>("map");
  const [spaceMounted, setSpaceMounted] = useState(false);
  const [mapFocus, setMapFocus] = useState<MapFocus>({ id: "overview", nonce: 0 });
  const [place, setPlace] = useState<PoiId | null>(null);
  const [index, setIndex] = useState(0);
  const [caption, setCaption] = useState<{ note: string } | null>(null);
  const [booking, setBooking] = useState<{ offer: TourOffer; id: number } | null>(null);
  const [nights, setNights] = useState(DEFAULT_NIGHTS);

  const viewerRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const guideCardRef = useRef<HTMLDivElement>(null);
  const guideButtonRef = useRef<HTMLButtonElement>(null);
  const panoRef = useRef<PanoHandle>(null);
  /** Mirror `mode` and `index` for event handlers and the frame loop. */
  const modeRef = useRef<Mode>("map");
  const indexRef = useRef(0);
  const pins = useRef<(Pin | null)[]>([]);
  const bookingCount = useRef(0);
  const warmed = useRef(false);
  const stopPreload = useRef<(() => void) | null>(null);

  const scene = scenes[index];

  const scrollToViewer = useCallback(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    const top = viewer.getBoundingClientRect().top + window.scrollY - NAV_CLEARANCE;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: Math.max(0, top), behavior: reduce ? "auto" : "smooth" });
  }, []);

  const showMode = useCallback((next: Mode) => {
    modeRef.current = next;
    setMode(next);
    if (next === "space") setSpaceMounted(true);
  }, []);

  /** Switch 360° space (wrapping around); `scroll` also brings the stage into view. */
  const openSpace = useCallback(
    (target: number, scroll = false) => {
      const next = ((target % scenes.length) + scenes.length) % scenes.length;
      showMode("space");
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
      if (scroll) scrollToViewer();
    },
    [showMode, scrollToViewer],
  );

  const flyMap = useCallback(
    (id: ViewId) => {
      showMode("map");
      // A drawer or note left open in the hidden 360° layer would reappear later.
      setBooking(null);
      setCaption(null);
      setMapFocus((focus) => ({ id, nonce: focus.nonce + 1 }));
    },
    [showMode],
  );

  const onGuideStop = useCallback(
    (stop: GuideStop) => {
      setPlace(null);
      if (stop.kind === "map") flyMap(stop.view);
      else openSpace(sceneIndex(stop.scene));
    },
    [flyMap, openSpace],
  );

  const guide = useGuidedTour(guideStops, onGuideStop);
  const { start: startGuide, pause: pauseGuide, active: touring } = guide;

  function startTour() {
    scrollToViewer();
    startGuide();
  }

  function chooseMode(next: Mode) {
    if (touring) pauseGuide();
    showMode(next);
  }

  function enterSpace(id: SceneId) {
    setPlace(null);
    if (touring) pauseGuide();
    openSpace(sceneIndex(id));
  }

  /** The visitor picks a space themselves: the guide stops moving the stage. */
  function userOpenSpace(target: number, scroll = false) {
    if (touring) pauseGuide();
    openSpace(target, scroll);
  }

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
      stopPreload.current = preloadPanoramas(others);
    }
  }, []);

  // Leaving the page stops the warm-up before the next multi-megabyte panorama.
  useEffect(() => () => stopPreload.current?.(), []);

  function onHotspot(hotspot: Hotspot) {
    if (touring) pauseGuide();
    if (hotspot.kind === "nav") {
      openSpace(sceneIndex(hotspot.target));
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

  // ← / → switch 360° spaces from anywhere on the page, except in form fields
  // and inside the viewer itself, where the arrows look around.
  // (During the guided tour the guide takes the arrow keys first.)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      if (modeRef.current !== "space") return;
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      const target = e.target;
      if (target instanceof Element && target.closest("[data-pano]")) return;
      if (target instanceof HTMLElement && (/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) || target.isContentEditable)) {
        return;
      }
      openSpace(indexRef.current + (e.key === "ArrowRight" ? 1 : -1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openSpace]);

  // Deep links: /tour#guided-tour starts the guide; #room, #chapel, #scene-2 …
  // open that 360° space.
  useEffect(() => {
    const hash = window.location.hash.toLowerCase();
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (hash === "#guided-tour") {
      timer = setTimeout(() => {
        scrollToViewer();
        startGuide();
      }, 60);
    } else {
      const target = sceneIndexFromHash(hash);
      if (target >= 0) timer = setTimeout(() => openSpace(target, true), 60);
    }
    return () => clearTimeout(timer);
  }, [openSpace, scrollToViewer, startGuide]);

  // The 360° viewer's fullscreen hides the guide card: hold the tour until it's back.
  useEffect(() => {
    if (!touring) return;
    const onChange = () => {
      if (document.fullscreenElement) pauseGuide();
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, [touring, pauseGuide]);

  // The booking drawer takes the stage's attention (and its space on tablets);
  // the paused guide card comes back when it closes.
  const guideCardShown = touring && !booking;

  // On phones the card docks under the stage, and the stage leaves room for it
  // (--guide-h). Keeps the tallest height seen at this width, so the stage
  // doesn't resize with every stop's text.
  useEffect(() => {
    const stage = stageRef.current;
    const card = guideCardRef.current;
    if (!guideCardShown || !stage || !card || typeof ResizeObserver === "undefined") return;
    let width = 0;
    let tallest = 0;
    const ro = new ResizeObserver(() => {
      if (card.offsetWidth !== width) {
        width = card.offsetWidth;
        tallest = 0;
      }
      if (card.offsetHeight > tallest) {
        tallest = card.offsetHeight;
        stage.style.setProperty("--guide-h", `${tallest}px`);
      }
    });
    ro.observe(card);
    return () => {
      ro.disconnect();
      stage.style.removeProperty("--guide-h");
    };
  }, [guideCardShown]);

  const guidePlace = touring ? stopPlace(guide.stop) : null;
  const nextScene = scenes[(index + 1) % scenes.length];
  // No snow on the summer lake stop.
  const snow = !(touring && guide.stop.kind === "map" && guide.stop.view === "lake");

  return (
    <>
      {/* The nav's scroll anchor: it turns solid once the stage has scrolled away. */}
      <div className={styles.band} data-nav-anchor>
        <div className={styles.toolbar}>
          <div className={styles.modes} role="group" aria-label="Choose a view">
            <button
              type="button"
              className={cx(styles.mode, mode === "map" && styles.modeOn)}
              aria-pressed={mode === "map"}
              onClick={() => chooseMode("map")}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path
                  d="M1.8 3.6 5.6 2l4.8 1.8L14.2 2.2v10.2l-3.8 1.6-4.8-1.8-3.8 1.6zM5.6 2v10.2M10.4 3.8V14"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
              3D map
            </button>
            <button
              type="button"
              className={cx(styles.mode, mode === "space" && styles.modeOn)}
              aria-pressed={mode === "space"}
              onClick={() => chooseMode("space")}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <ellipse cx="8" cy="8" rx="6.4" ry="2.9" stroke="currentColor" strokeWidth="1.3" fill="none" />
                <path d="M8 1.6v2.2M8 12.2v2.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                <circle cx="8" cy="8" r="1.3" fill="currentColor" />
              </svg>
              360&deg; spaces
            </button>
          </div>
          <p className={styles.toolbarNote}>
            Explore freely &mdash; or take the {guideStops.length}-stop guided tour, about {guideMinutes} min.
          </p>
          <button
            ref={guideButtonRef}
            type="button"
            className={cx(styles.guideButton, touring && styles.guideButtonActive)}
            onClick={touring ? guide.exit : startTour}
          >
            {touring ? (
              <>
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                  <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                End guided tour
              </>
            ) : (
              <>
                <span className={styles.playDisc} aria-hidden="true">
                  <svg width="10" height="10" viewBox="0 0 14 14">
                    <path d="M3.5 1.8v10.4L12 7z" fill="currentColor" />
                  </svg>
                </span>
                Start guided tour
              </>
            )}
          </button>
        </div>

        {/* The guide card overlays the stage on larger screens and docks below it on phones. */}
        <div ref={stageRef} className={cx(styles.stage, guideCardShown && styles.touring)}>
          <section ref={viewerRef} className={styles.viewer} aria-label="Virtual tour">
            <div className={styles.layer} hidden={mode !== "map"}>
              <ResortMap
                focus={mapFocus}
                touring={touring}
                snow={snow}
                selected={touring ? guidePlace : place}
                onSelect={(id) => {
                  setPlace(id);
                  flyMap(id);
                }}
                onCloseSelected={() => setPlace(null)}
                onEnter360={enterSpace}
              />
            </div>

            <div className={styles.layer} hidden={mode !== "space"}>
              {spaceMounted && (
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
                        className={cx(
                          styles.hotspot,
                          hotspot.kind === "book" && styles.hotspotBook,
                          hotspot.kind === "info" && styles.hotspotInfo,
                        )}
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
              )}
            </div>

            {/* Announces scene changes, e.g. from the arrow keys. */}
            <p className="visually-hidden" aria-live="polite">
              {mode === "space" ? sceneLabel(scene) : ""}
            </p>
          </section>

          {guideCardShown && (
            <GuideCard
              ref={guideCardRef}
              returnFocusRef={guideButtonRef}
              stop={guide.stop}
              index={guide.index}
              total={guide.total}
              isLast={guide.isLast}
              playing={guide.playing}
              voice={guide.voice}
              voiceAvailable={guide.voiceAvailable}
              runKey={guide.runKey}
              duration={guide.duration}
              onBack={guide.back}
              onNext={guide.next}
              onTogglePlay={guide.togglePlay}
              onToggleVoice={guide.toggleVoice}
              onExit={guide.exit}
            />
          )}
        </div>
      </div>

      <SceneRail
        scenes={scenes}
        current={index}
        active={mode === "space"}
        onSelect={(i) => userOpenSpace(i)}
        onStep={(delta) => userOpenSpace(index + delta)}
      />
      <SceneDetails scene={scene} next={nextScene} onNext={() => userOpenSpace(index + 1, true)} />
      <SpacesGrid scenes={scenes} onEnter={(i) => userOpenSpace(i, true)} />
    </>
  );
}
