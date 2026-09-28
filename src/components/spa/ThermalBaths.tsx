import { Photo } from "@/components/ui/Photo";
import { cx } from "@/lib/cx";
import ui from "@/styles/ui.module.css";

import { BATH_FEATURES, BATH_STATS } from "./content";
import styles from "./ThermalBaths.module.css";

const BATHS_IMAGE =
  "https://static.wixstatic.com/media/f9d3d7_d9f5264f63fb46e8b4fa9c093c43dd22~mv2.jpg/v1/fill/w_1000,h_1200,al_c,q_85,enc_avif,quality_auto/f9d3d7_d9f5264f63fb46e8b4fa9c093c43dd22~mv2.jpg";

export function ThermalBaths() {
  return (
    <section className={styles.baths}>
      <div className={styles.grid}>
        <div data-reveal="left" className={styles.media}>
          <Photo
            src={BATHS_IMAGE}
            alt="Thermal baths — steam rising, low light"
            sizes="(max-width: 800px) 100vw, (max-width: 1400px) 50vw, 640px"
          />
        </div>

        <div data-reveal="right">
          <div className={cx(ui.eyebrow, styles.eyebrow)}>Aquarius Spa Center</div>
          <h2 className={styles.title}>
            Water, warmth
            <br />
            and quiet
          </h2>
          <p className={styles.text}>
            Swimming pools for adults and children, a special cold-water plunge, Finnish sauna and steam room — the
            latest in cosmetics and relaxation, open to all hotel guests daily.
          </p>
          <ul className={styles.features}>
            {BATH_FEATURES.map((feature) => (
              <li key={feature} className={styles.feature}>
                <span className={styles.diamond} aria-hidden="true">
                  &#9670;
                </span>
                {feature}
              </li>
            ))}
          </ul>
          <div className={styles.stats}>
            {BATH_STATS.map((stat) => (
              <div key={stat.label}>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
