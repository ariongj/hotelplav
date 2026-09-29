import { cx } from "@/lib/cx";
import ui from "@/styles/ui.module.css";

import { PROVENANCE } from "./content";
import styles from "./DiningStatement.module.css";

/** "At the table": the kitchen's idea on the left, where the produce comes from on the right. */
export function DiningStatement() {
  return (
    <section className={styles.statement} aria-labelledby="dining-statement-title">
      <div className={styles.inner}>
        <div data-reveal="up">
          <div className={cx(ui.eyebrow, styles.eyebrow)}>At the table</div>
          <h2 id="dining-statement-title" className={styles.title}>
            Cooked the way <em>the mountains</em> taught us
          </h2>
          <p className={styles.text}>
            Plav eats well and simply: cornmeal and kajmak, cicvara and burek, trout from clear water and honey from the
            high pastures. Our kitchen starts there — then plates it with quiet precision, and serves it with the lake in
            view.
          </p>
        </div>

        <ul className={styles.cards}>
          {PROVENANCE.map((item, index) => (
            <li
              key={item.title}
              className={styles.item}
              data-reveal="up"
              data-delay={index > 0 ? String(index * 80) : undefined}
            >
              <div className={styles.card}>
                <span className={styles.index} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className={styles.kicker}>{item.kicker}</div>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardText}>{item.text}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
