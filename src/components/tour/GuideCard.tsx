import Link from "next/link";

import { cx } from "@/lib/cx";

import type { GuideStop } from "./guide";
import styles from "./GuideCard.module.css";

type GuideCardProps = {
  stop: GuideStop;
  index: number;
  total: number;
  isLast: boolean;
  playing: boolean;
  voice: boolean;
  voiceAvailable: boolean;
  /** Restarts the progress bar when it changes. */
  runKey: string;
  duration: number;
  onBack: () => void;
  onNext: () => void;
  onTogglePlay: () => void;
  onToggleVoice: () => void;
  onExit: () => void;
};

/** The narrator's card for the guided tour, docked over the stage. */
export function GuideCard({
  stop,
  index,
  total,
  isLast,
  playing,
  voice,
  voiceAvailable,
  runKey,
  duration,
  onBack,
  onNext,
  onTogglePlay,
  onToggleVoice,
  onExit,
}: GuideCardProps) {
  return (
    <div className={styles.card} role="region" aria-label="Guided tour">
      <div className={styles.head}>
        <span className={styles.count}>
          Guided tour &middot; {index + 1} / {total}
        </span>
        <button type="button" className={styles.exit} aria-label="End the guided tour" onClick={onExit}>
          &times;
        </button>
      </div>

      <div aria-live="polite" aria-atomic="true">
        <div className={styles.kicker}>{stop.kicker}</div>
        <h3 className={styles.title}>{stop.title}</h3>
        <p className={styles.text}>{stop.text}</p>
      </div>

      {stop.link && (
        <Link href={stop.link.href} className={styles.link}>
          {stop.link.label} &rarr;
        </Link>
      )}

      <div className={styles.controls}>
        <button type="button" className={styles.round} aria-label="Previous stop" disabled={index === 0} onClick={onBack}>
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M8.5 2.5 4 7l4.5 4.5" stroke="currentColor" strokeWidth="1.6" fill="none" />
          </svg>
        </button>
        <button
          type="button"
          className={cx(styles.round, styles.play)}
          aria-label={playing ? "Pause the tour" : "Play the tour"}
          onClick={onTogglePlay}
        >
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M4 2.5v9M10 2.5v9" stroke="currentColor" strokeWidth="2" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M4.5 2.5v9l7-4.5z" fill="currentColor" />
            </svg>
          )}
        </button>
        <button type="button" className={cx(styles.round, isLast && styles.finish)} aria-label={isLast ? "Finish the tour" : "Next stop"} onClick={onNext}>
          {isLast ? (
            "Done"
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M5.5 2.5 10 7l-4.5 4.5" stroke="currentColor" strokeWidth="1.6" fill="none" />
            </svg>
          )}
        </button>
        {voiceAvailable && (
          <button type="button" className={cx(styles.voice, voice && styles.voiceOn)} aria-pressed={voice} onClick={onToggleVoice}>
            <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M2.5 6v4h2.8L9 13V3L5.3 6z" fill="currentColor" />
              {voice && <path d="M11 5.2a3.6 3.6 0 0 1 0 5.6M12.8 3.4a6.2 6.2 0 0 1 0 9.2" stroke="currentColor" strokeWidth="1.3" fill="none" />}
            </svg>
            Voice {voice ? "on" : "off"}
          </button>
        )}
      </div>

      {!voice && !isLast && (
        <div className={styles.progress} aria-hidden="true">
          <span
            key={runKey}
            className={styles.progressFill}
            style={{ animationDuration: `${duration}ms`, animationPlayState: playing ? "running" : "paused" }}
          />
        </div>
      )}
    </div>
  );
}
