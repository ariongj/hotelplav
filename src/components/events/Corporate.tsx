import Link from "next/link";

import { PhotoCredit } from "@/components/ui/PhotoCredit";
import { Photo } from "@/components/ui/Photo";
import { cx } from "@/lib/cx";
import ui from "@/styles/ui.module.css";

import styles from "./Corporate.module.css";
import { corporatePoints, eventsEnquiryHref, images, stepNumber } from "./content";

export function Corporate() {
  return (
    <section className={styles.section} aria-labelledby="corporate-title">
      <div className={styles.grid}>
        <div className={styles.copy} data-reveal="left">
          <p className={ui.eyebrow}>Retreats &amp; corporate</p>
          <h2 id="corporate-title" className={cx(ui.h2, styles.title)}>
            Clearer heads, <em>by the lake</em>
          </h2>
          <p className={cx(ui.lead, styles.lead)}>
            Offsites, board weeks and product launches &mdash; a boardroom with daylight on three sides, two breakout
            salons by the fire, and the lake and mountains for everything in between.
          </p>

          <ol className={styles.points}>
            {corporatePoints.map((point, i) => (
              <li key={point.title} className={styles.point}>
                <span className={styles.number} aria-hidden="true">
                  {stepNumber(i)}
                </span>
                <div>
                  <h3 className={styles.pointTitle}>{point.title}</h3>
                  <p className={styles.pointText}>{point.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <Link href={eventsEnquiryHref} className={ui.btnGold}>
            Request a proposal
          </Link>
        </div>

        <div className={styles.visual} data-reveal="right">
          <div className={styles.media}>
            <Photo src={images.corporate.src} alt={images.corporate.alt} sizes="(max-width: 900px) 100vw, 50vw" />
            <PhotoCredit credit={images.corporate.credit} className={styles.credit} />
          </div>
          <div className={cx(ui.glass, styles.float)}>
            <span className={styles.floatValue}>20</span>
            <span className={styles.floatLabel}>
              seats in the boardroom,
              <br />
              daylight on three sides
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
