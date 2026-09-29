import { cx } from "@/lib/cx";
import ui from "@/styles/ui.module.css";

import styles from "./ChefsTasting.module.css";
import { LAKE_ROOM, TASTING_PRICES } from "./content";
import { TastingMenu } from "./TastingMenu";

/** The Lake Room's chef's menu on a dark lake-teal panel — a tab card switches between three paths. */
export function ChefsTasting() {
  return (
    <section id="tasting" className={cx(ui.section, styles.tasting)} aria-labelledby="tasting-title">
      <div className={styles.inner}>
        <div data-reveal="up">
          <div className={cx(ui.eyebrowLight, styles.eyebrow)}>{LAKE_ROOM} · The chef&apos;s menu</div>
          <h2 id="tasting-title" className={cx(ui.h2Light, styles.title)}>
            A menu that follows <em>the seasons</em>
          </h2>
          <p className={cx(ui.leadLight, styles.lead)}>
            Six courses, rewritten each week around what the water, the pastures and the forest are giving. Choose the
            path that suits your table.
          </p>

          <dl className={styles.prices}>
            {TASTING_PRICES.map((price) => (
              <div key={price.label} className={styles.price}>
                <dt className={styles.priceLabel}>{price.label}</dt>
                <dd className={styles.priceValue}>{price.value}</dd>
              </div>
            ))}
          </dl>

          <a href="#reserve" className={ui.btnGold}>
            Reserve at {LAKE_ROOM}
          </a>
        </div>

        <div data-reveal="up" data-delay="120" className={styles.menuCol}>
          <TastingMenu />
        </div>
      </div>
    </section>
  );
}
