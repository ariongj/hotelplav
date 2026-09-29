import Link from "next/link";

import { cx } from "@/lib/cx";
import ui from "@/styles/ui.module.css";

import styles from "./Planning.module.css";
import { chapelTourHref, eventsEnquiryHref, planningSteps, staggerDelays, stepNumber } from "./content";

export function Planning() {
  return (
    <section className={styles.section} aria-labelledby="planning-title">
      <div className={styles.container}>
        <div className={styles.header} data-reveal="up">
          <p className={ui.eyebrow}>How it works</p>
          <h2 id="planning-title" className={cx(ui.h2, styles.title)}>
            One planner, <em>three steps</em>
          </h2>
        </div>

        <ol className={styles.timeline}>
          {planningSteps.map((step, i) => (
            <li key={step.title} className={styles.step} data-reveal="up" data-delay={staggerDelays[i]}>
              <span className={styles.node} aria-hidden="true">
                {stepNumber(i)}
              </span>
              <div className={styles.card}>
                <p className={styles.stepKicker}>Step {i + 1}</p>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepText}>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className={styles.actions} data-reveal="up" data-delay="220">
          <Link href={eventsEnquiryHref} className={ui.btnGold}>
            Begin with a conversation
          </Link>
          <Link href={chapelTourHref} className={ui.btnOutline}>
            Tour the chapel in 360&deg;
          </Link>
        </div>
      </div>
    </section>
  );
}
