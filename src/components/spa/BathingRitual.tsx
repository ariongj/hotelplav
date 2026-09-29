import { cx } from "@/lib/cx";
import { euro } from "@/lib/format";
import ui from "@/styles/ui.module.css";

import styles from "./BathingRitual.module.css";
import { BookLink } from "./BookLink";
import { GUIDED_RITUAL_ID, RITUAL_STEPS, TREATMENTS } from "./content";

/** The guided version of the circuit, offered below the steps. */
const GUIDED = TREATMENTS.find((treatment) => treatment.id === GUIDED_RITUAL_ID);

/** The bathing ritual on dark lake-teal: four numbered steps on a timeline. */
export function BathingRitual() {
  return (
    <section className={cx(ui.section, styles.ritual)} aria-labelledby="ritual-title">
      <div className={styles.inner}>
        <div data-reveal="up" className={styles.head}>
          <div className={cx(ui.eyebrowLight, styles.eyebrow)}>The bathing ritual</div>
          <h2 id="ritual-title" className={cx(ui.h2Light, styles.title)}>
            Four steps, forty-five minutes, <em>complete stillness</em>
          </h2>
          <p className={cx(ui.leadLight, styles.lead)}>
            The circuit our bath master swears by. Take it slowly and in order — then go round once more.
          </p>
        </div>

        <ol className={styles.steps}>
          {RITUAL_STEPS.map((step, index) => (
            <li
              key={step.title}
              data-reveal="up"
              data-delay={index > 0 ? String(index * 80) : undefined}
              className={styles.step}
            >
              <span className={styles.marker} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className={styles.card}>
                <span className={styles.time}>{step.time}</span>
                <h3 className={styles.stepTitle}>
                  <span className="visually-hidden">Step {index + 1}: </span>
                  {step.title}
                </h3>
                <p className={styles.stepText}>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>

        {GUIDED && (
          <div data-reveal="up" className={styles.guided}>
            <p className={styles.guidedText}>
              <strong>Rather be guided?</strong> Our bath master leads the {GUIDED.name}: {GUIDED.duration},{" "}
              {euro(GUIDED.price)}.
            </p>
            <BookLink treatment={GUIDED.name} className={ui.btnCream}>
              Book the ritual
            </BookLink>
          </div>
        )}
      </div>
    </section>
  );
}
