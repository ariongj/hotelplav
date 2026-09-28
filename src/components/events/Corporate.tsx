import Link from "next/link";

import { Photo } from "@/components/ui/Photo";
import { cx } from "@/lib/cx";
import ui from "@/styles/ui.module.css";

import styles from "./Corporate.module.css";
import { corporatePoints, eventsEnquiryHref, images, stepNumber } from "./content";

export function Corporate() {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        <div className={styles.media} data-reveal="left">
          <Photo src={images.corporate.src} alt={images.corporate.alt} sizes="(max-width: 770px) 100vw, 50vw" />
        </div>
        <div data-reveal="right">
          <div className={cx(ui.eyebrow, styles.eyebrow)}>Retreats &amp; corporate</div>
          <h2 className={styles.title}>
            Better decisions
            <br />
            at 1,100 metres
          </h2>
          <p className={styles.lead}>
            Offsites, board weeks and product launches &mdash; a boardroom for twenty with daylight on three sides,
            breakout lounges by the fire, and the mountain itself for everything in between.
          </p>
          <ol className={styles.points}>
            {corporatePoints.map((point, i) => (
              <li key={point} className={styles.point}>
                <span className={styles.number}>{stepNumber(i)}</span>
                <span className={styles.pointText}>{point}</span>
              </li>
            ))}
          </ol>
          <Link href={eventsEnquiryHref} className={ui.btnGold}>
            Request a proposal
          </Link>
        </div>
      </div>
    </section>
  );
}
