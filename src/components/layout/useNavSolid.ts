"use client";

import { useSyncExternalStore } from "react";

/*
 * The nav is transparent over each page's hero and turns solid (and the
 * sticky reserve bar slides in) once the visitor scrolls past it.
 *
 * Pages mark their hero with data-nav-anchor. The switch happens when the
 * anchor's bottom edge is within `data-nav-offset` of the top of the
 * viewport — px (default "90") or a viewport fraction such as "55vh".
 */

function subscribe(onChange: () => void) {
  let frame = 0;
  const schedule = () => {
    if (!frame) {
      frame = requestAnimationFrame(() => {
        frame = 0;
        onChange();
      });
    }
  };
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
  };
}

function isPastHero(): boolean {
  const vh = window.innerHeight || 800;
  const anchor = document.querySelector<HTMLElement>("[data-nav-anchor]");
  if (!anchor) return window.scrollY > vh * 0.6;
  const raw = anchor.dataset.navOffset ?? "90";
  const offset = raw.endsWith("vh") ? (parseFloat(raw) / 100) * vh : parseFloat(raw) || 90;
  return window.scrollY > anchor.offsetTop + anchor.offsetHeight - offset;
}

export function useNavSolid(): boolean {
  return useSyncExternalStore(subscribe, isPastHero, () => false);
}
