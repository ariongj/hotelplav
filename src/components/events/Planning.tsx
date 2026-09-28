import Link from "next/link";

import styles from "./Planning.module.css";
import { eventsEnquiryHref, planningSteps, staggerDelays, stepNumber } from "./content";

export function Planning() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header} data-reveal="up">
          <div className={styles.eyebrow}>How it works</div>
          <h2 className={styles.title}>One planner, three steps.</h2>
        </div>

        <ol className={styles.steps}>
          {planningSteps.map((step, i) => (
            <li key={step.title} className={styles.step} data-reveal="up" data-delay={staggerDelays[i]}>
              <div className={styles.number}>{stepNumber(i)}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepText}>{step.text}</p>
            </li>
          ))}
        </ol>

        <div className={styles.actions} data-reveal="up" data-delay="220">
          <Link href={eventsEnquiryHref} className={styles.ctaGold}>
            Begin with a conversation
          </Link>
          <Link href="/tour" className={styles.ctaOutline}>
            Tour the spaces in 360&deg;
          </Link>
        </div>
      </div>
    </section>
  );
}
