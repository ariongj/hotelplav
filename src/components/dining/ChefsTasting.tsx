import { cx } from "@/lib/cx";
import ui from "@/styles/ui.module.css";

import styles from "./ChefsTasting.module.css";
import { TASTING_PRICES } from "./content";
import { TastingMenu } from "./TastingMenu";

/** Gjethja's chef's menu (dark) — the course list switches between three paths. */
export function ChefsTasting() {
  return (
    <section id="tasting" className={cx(ui.section, styles.tasting)}>
      <div className={styles.inner}>
        <div data-reveal="up" className={styles.head}>
          <div className={cx(ui.eyebrowLight, styles.eyebrow)}>Gjethja · The Chef&apos;s Menu</div>
          <h2 className={styles.title}>
            A menu that changes
            <br />
            with the mountain
          </h2>
          <p className={styles.lead}>Six courses, written each week. Choose the path that suits your table.</p>
        </div>

        <TastingMenu>
          <div className={styles.footer}>
            <dl className={styles.prices}>
              {TASTING_PRICES.map((price) => (
                <div key={price.label}>
                  <dt className={styles.priceLabel}>{price.label}</dt>
                  <dd className={styles.priceValue}>{price.value}</dd>
                </div>
              ))}
            </dl>
            <a href="#reserve" className={ui.btnGold}>
              Reserve at Gjethja
            </a>
          </div>
        </TastingMenu>
      </div>
    </section>
  );
}
