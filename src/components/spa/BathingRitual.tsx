import { cx } from "@/lib/cx";
import ui from "@/styles/ui.module.css";

import styles from "./BathingRitual.module.css";
import { RITUAL_STEPS } from "./content";

/** The alpine bathing ritual (dark): four numbered steps. */
export function BathingRitual() {
  return (
    <section className={cx(ui.section, styles.ritual)}>
      <div className={styles.inner}>
        <div data-reveal="up" className={styles.head}>
          <div className={cx(ui.eyebrowLight, styles.eyebrow)}>The Alpine Bathing Ritual</div>
          <h2 className={styles.title}>
            Four steps, an hour,
            <br />
            and complete stillness
          </h2>
          <p className={styles.lead}>A circuit our bath master swears by. Follow it slowly, in order, twice.</p>
        </div>

        <ol className={styles.steps}>
          {RITUAL_STEPS.map((step, index) => (
            <li
              key={step.title}
              data-reveal="up"
              data-delay={index > 0 ? String(index * 80) : undefined}
              className={styles.step}
            >
              <div className={styles.number} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepText}>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
