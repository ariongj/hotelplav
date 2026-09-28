"use client";

import { useEffect, useImperativeHandle, useRef, type ReactNode, type Ref } from "react";

import { cx } from "@/lib/cx";

import { PanoEngine, type PanoScene, type PanoView } from "./panoEngine";
import styles from "./PanoViewer.module.css";

export type { PanoScene, PanoView } from "./panoEngine";
export { projectToView } from "./panoEngine";

export type PanoHandle = {
  /** Switch panorama and/or camera; cross-fades when the image changes. */
  setScene(scene: Partial<PanoScene>): void;
  /** Ease the camera toward a direction (degrees). */
  lookAt(target: { yaw?: number; pitch?: number; fov?: number }): void;
  getView(): PanoView | null;
};

type PanoViewerProps = PanoScene & {
  /** Auto-rotation in degrees per second after 3.5 s idle; 0 turns it off. */
  autorotate?: number;
  /**
   * "none": every drag turns the view (full-screen tour).
   * "pan-y": vertical swipes still scroll the page (inline teasers).
   */
  touchAction?: "none" | "pan-y";
  className?: string;
  /** Called after each rendered frame — use for hotspot positioning. */
  onFrame?: (view: PanoView) => void;
  /** Overlay content (e.g. hotspots) drawn above the panorama. */
  children?: ReactNode;
  ref?: Ref<PanoHandle>;
};

/**
 * 360° equirectangular viewer: drag to look, pinch/double-tap to zoom,
 * ctrl+wheel zoom, fullscreen, auto-rotate. Changing `src` (or yaw/pitch/
 * fov/label) switches scene.
 */
export function PanoViewer({
  src,
  yaw,
  pitch,
  fov,
  label = "",
  autorotate = 1.6,
  touchAction = "none",
  className,
  onFrame,
  children,
  ref,
}: PanoViewerProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snapRef = useRef<HTMLImageElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<PanoEngine | null>(null);
  const initialScene = useRef<PanoScene>({ src, yaw, pitch, fov, label });
  const autorotateRef = useRef(autorotate);

  useEffect(() => {
    const engine = new PanoEngine(
      {
        host: hostRef.current!,
        wrap: wrapRef.current!,
        canvas: canvasRef.current!,
        snap: snapRef.current!,
        label: labelRef.current!,
        hint: hintRef.current!,
        loader: loaderRef.current!,
        error: errorRef.current!,
      },
      initialScene.current,
      autorotateRef.current,
    );
    engineRef.current = engine;
    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  // Declarative scene changes.
  useEffect(() => {
    const engine = engineRef.current;
    const first = initialScene.current;
    if (!engine) return;
    if (src === first.src && yaw === first.yaw && pitch === first.pitch && fov === first.fov) return;
    initialScene.current = { src, yaw, pitch, fov, label };
    engine.setScene({ src, yaw, pitch, fov, label });
  }, [src, yaw, pitch, fov, label]);

  useEffect(() => {
    engineRef.current?.setAutorotate(autorotate);
  }, [autorotate]);

  useEffect(() => {
    if (engineRef.current) engineRef.current.onFrame = onFrame ?? null;
  }, [onFrame]);

  useImperativeHandle(
    ref,
    () => ({
      setScene: (scene) => engineRef.current?.setScene(scene),
      lookAt: (target) => engineRef.current?.lookAt(target),
      getView: () => engineRef.current?.view ?? null,
    }),
    [],
  );

  return (
    <div
      ref={hostRef}
      className={cx(styles.host, className)}
      role="region"
      aria-roledescription="360° panorama"
      aria-label={label ? `360° view — ${label}` : "360° view"}
    >
      <div ref={wrapRef} className={styles.wrap} style={{ touchAction }}>
        <canvas ref={canvasRef} className={styles.canvas} />
        {/* Snapshot of the previous scene for the cross-fade (data URL). */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={snapRef} className={styles.snap} alt="" />
        {children}
        <div className={styles.chip}>
          <span className={styles.badge}>360&deg;</span>
          <span ref={labelRef} className={styles.label}>
            {label}
          </span>
        </div>
        <div ref={hintRef} className={styles.hint}>
          Drag to look around
        </div>
        <div className={styles.controls}>
          <button type="button" className={styles.control} title="Zoom out" aria-label="Zoom out" onClick={() => engineRef.current?.zoomBy(12)}>
            &minus;
          </button>
          <button type="button" className={styles.control} title="Zoom in" aria-label="Zoom in" onClick={() => engineRef.current?.zoomBy(-12)}>
            +
          </button>
          <button type="button" className={styles.control} title="Fullscreen" aria-label="Fullscreen" onClick={() => engineRef.current?.toggleFullscreen()}>
            <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M1 5V1h4M9 1h4v4M13 9v4H9M5 13H1V9" stroke="currentColor" fill="none" strokeWidth="1.6" />
            </svg>
          </button>
        </div>
        <div ref={loaderRef} className={styles.loader}>
          <div className={styles.spinner} />
          <div className={styles.loaderText}>Loading 360&deg; view</div>
        </div>
        <div ref={errorRef} className={styles.error} role="alert">
          Couldn&rsquo;t load this panorama
        </div>
      </div>
    </div>
  );
}
