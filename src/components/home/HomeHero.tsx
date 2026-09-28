"use client";

import { useEffect, useRef, type CSSProperties } from "react";

import { Photo } from "@/components/ui/Photo";

import { heroActs, heroImages, snowflakes } from "./content";
import styles from "./HomeHero.module.css";

/*
 * Cinematic opening: a 400vh section with a sticky 100vh stage. Scroll
 * progress (0–1) drives four photographic acts — arrival, lobby, suite,
 * view — through cross-fades and slow push-ins. Styles are written straight
 * to the DOM on each animation frame; nothing re-renders while scrolling.
 */

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const seg = (p: number, a: number, b: number) => Math.max(0, Math.min(1, (p - a) / (b - a)));
/** 0 → fade in (a–b) → hold → fade out (c–d) → 0 */
const win = (p: number, a: number, b: number, c: number, d: number) => {
  if (p <= a || p >= d) return 0;
  if (p < b) return ease(seg(p, a, b));
  if (p > c) return 1 - ease(seg(p, c, d));
  return 1;
};

type Layers = Record<string, HTMLElement | undefined>;

function applyHero(p: number, el: Layers, reduceMotion: boolean) {
  const tf = (value: string) => (reduceMotion ? "none" : value);
  const set = (key: string, opacity: number, transform?: string) => {
    const node = el[key];
    if (!node) return;
    node.style.opacity = String(opacity);
    node.style.visibility = opacity > 0.001 ? "visible" : "hidden";
    if (transform !== undefined) node.style.transform = tf(transform);
  };

  const push = ease(seg(p, 0, 0.34));
  set("exterior", 1 - seg(p, 0.24, 0.32), `scale(${1.04 + push * 0.13})`);
  set("snow", 1 - seg(p, 0.22, 0.3));
  set("lobby", win(p, 0.24, 0.33, 0.54, 0.62), `scale(${1.14 - ease(seg(p, 0.24, 0.6)) * 0.14})`);
  set("suite", win(p, 0.54, 0.62, 0.79, 0.86), `scale(${1.12 - ease(seg(p, 0.54, 0.86)) * 0.12})`);
  set("suiteOverlay", win(p, 0.6, 0.67, 0.77, 0.82), `translateY(${(1 - ease(seg(p, 0.6, 0.7))) * 26}px)`);
  set("view", seg(p, 0.79, 0.88), `scale(${1.08 - ease(seg(p, 0.79, 1)) * 0.08})`);

  const text = (key: string, a: number, b: number, c: number, d: number) =>
    set(key, win(p, a, b, c, d), `translateY(${(1 - ease(seg(p, a, b))) * 26 - seg(p, c, d) * 16}px)`);
  text("tArrival", -0.1, -0.02, 0.17, 0.24);
  text("tLobby", 0.29, 0.35, 0.5, 0.57);
  text("tSuite", 0.585, 0.65, 0.745, 0.8);
  text("tView", 0.855, 0.92, 1.4, 1.5);

  set("cue", 1 - seg(p, 0, 0.06));
  if (el.progress) el.progress.style.transform = `scaleX(${p})`;

  let act = 0;
  heroActs.forEach((a, i) => {
    if (p >= a.at) act = i;
  });
  if (el.stageName) el.stageName.textContent = `${String(act + 1).padStart(2, "0")} — ${heroActs[act].name}`;
  el.chapters?.querySelectorAll("button").forEach((dot, i) => dot.toggleAttribute("data-active", i === act));
}

export function HomeHero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const layers: Layers = {};
    hero.querySelectorAll<HTMLElement>("[data-layer]").forEach((node) => {
      layers[node.dataset.layer!] = node;
    });
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");

    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight || 800;
      const total = Math.max(1, hero.offsetHeight - vh);
      const p = Math.max(0, Math.min(1, -hero.getBoundingClientRect().top / total));
      applyHero(p, layers, reduceMotion.matches);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reduceMotion.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduceMotion.removeEventListener("change", schedule);
    };
  }, []);

  const jumpTo = (index: number) => {
    const hero = heroRef.current;
    if (!hero) return;
    const total = Math.max(1, hero.offsetHeight - (window.innerHeight || 800));
    window.scrollTo({ top: hero.offsetTop + (heroActs[index].at + 0.015) * total, behavior: "smooth" });
  };

  return (
    <section ref={heroRef} className={styles.hero} data-nav-anchor data-nav-offset="55vh" aria-label="Welcome">
      <div className={styles.stage}>
        {/* Act 01 — arrival */}
        <div
          data-layer="exterior"
          className={styles.layer}
          style={{ zIndex: 3, transformOrigin: "52% 58%", transform: "scale(1.04)" }}
        >
          <Photo src={heroImages.exterior.src} alt={heroImages.exterior.alt} eager />
          <div className={styles.shadeExterior} />
        </div>

        <div data-layer="snow" className={styles.snow} aria-hidden="true">
          {snowflakes.map(([left, size, alpha, blur, fall, fallDelay, sway, swayDelay]) => (
            <span
              key={left}
              className={styles.flake}
              style={
                {
                  left: `${left}%`,
                  width: size,
                  height: size,
                  background: `rgba(255, 253, 248, ${alpha})`,
                  filter: `blur(${blur}px)`,
                  animationDuration: `${fall}s, ${sway}s`,
                  animationDelay: `${fallDelay}s, ${swayDelay}s`,
                } as CSSProperties
              }
            />
          ))}
        </div>

        <div data-layer="lobby" className={styles.layer} style={{ zIndex: 4, opacity: 0, visibility: "hidden" }}>
          <Photo src={heroImages.lobby.src} alt={heroImages.lobby.alt} />
          <div className={styles.shadeLobby} />
        </div>

        <div data-layer="suite" className={styles.layer} style={{ zIndex: 5, opacity: 0, visibility: "hidden" }}>
          <Photo src={heroImages.suite.src} alt={heroImages.suite.alt} />
          <div className={styles.shadeSuite} />
          <div data-layer="suiteOverlay" className={styles.suiteOverlay} style={{ opacity: 0 }}>
            <span>Linen</span>
            <span>Lighting</span>
            <span>Comfort</span>
          </div>
        </div>

        <div data-layer="view" className={styles.layer} style={{ zIndex: 6, opacity: 0, visibility: "hidden" }}>
          <Photo src={heroImages.view.src} alt={heroImages.view.alt} />
          <div className={styles.shadeView} />
        </div>

        {/* Text overlays */}
        <div data-layer="tArrival" className={styles.textCenter}>
          <div className={styles.kicker}>Brezovica · Sharr Mountains</div>
          <h1 className={styles.title}>
            A Five-Star Stay,
            <br />
            <em>Crafted Around You.</em>
          </h1>
          <div className={styles.titleRule} />
        </div>
        <div data-layer="tLobby" className={styles.textBottom} style={{ opacity: 0, visibility: "hidden" }}>
          <div className={styles.kickerSmall}>The Lobby</div>
          <h2 className={styles.actTitle}>
            Warmth, the moment
            <br />
            you step inside.
          </h2>
        </div>
        <div data-layer="tSuite" className={styles.textBottom} style={{ opacity: 0, visibility: "hidden" }}>
          <div className={styles.kickerSmall}>Your Suite</div>
          <h2 className={styles.actTitle}>
            A room that remembers
            <br />
            how you like to wake.
          </h2>
        </div>
        <div data-layer="tView" className={styles.textBottomView} style={{ opacity: 0, visibility: "hidden" }}>
          <div className={styles.kickerSmall}>The View</div>
          <h2 className={styles.viewTitle}>
            And then,
            <br />
            the mountains.
          </h2>
          <a href="#book" className={styles.viewCta}>
            Reserve your stay
          </a>
        </div>

        <div className={styles.vignette} />

        <div data-layer="chapters" className={styles.chapters}>
          {heroActs.map((act, i) => (
            <button
              key={act.name}
              type="button"
              className={styles.chapter}
              title={act.name}
              aria-label={`Jump to ${act.name}`}
              data-active={i === 0 ? "" : undefined}
              onClick={() => jumpTo(i)}
            />
          ))}
        </div>

        <div data-layer="cue" className={styles.cue} aria-hidden="true">
          <span>Scroll</span>
          <span className={styles.cueLine} />
        </div>
        <div data-layer="stageName" className={styles.stageName} aria-hidden="true">
          01 — Arrival
        </div>
        <div className={styles.progressTrack} aria-hidden="true">
          <div data-layer="progress" className={styles.progressFill} />
        </div>
      </div>
    </section>
  );
}
