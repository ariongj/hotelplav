import Link from "next/link";

import { scenes } from "@/components/tour/content";
import { site } from "@/config/site";
import { contactHref } from "@/lib/contact-link";
import { cx } from "@/lib/cx";
import ui from "@/styles/ui.module.css";

import { CONCIERGE_HELP, TOUR_SCENE_IDS } from "./content";
import styles from "./SpaPlanning.module.css";

/** The tour scenes to link to, named as the tour names them. */
const TOUR_SCENES = TOUR_SCENE_IDS.flatMap((id) => scenes.filter((scene) => scene.id === id));

/**
 * Two cards to finish the page: the spa concierge (hands off to the contact
 * form with the spa topic selected) and deep links into the 360° tour.
 */
export function SpaPlanning() {
  return (
    <section className={styles.planning}>
      <div className={styles.grid}>
        <div data-reveal="up" className={styles.cell}>
          <div className={styles.concierge}>
            <div className={cx(ui.eyebrowLight, styles.eyebrow)}>Not sure where to start?</div>
            <h2 className={cx(styles.title, styles.titleLight)}>
              Let our therapists <em>design your day</em>
            </h2>
            <p className={cx(styles.text, styles.textLight)}>
              Tell us how you&apos;d like to feel — rested, restored, or ready for tomorrow&apos;s walk — and we&apos;ll
              put together the treatments and the time in the water.
            </p>
            <ul className={styles.checks}>
              {CONCIERGE_HELP.map((item) => (
                <li key={item} className={styles.check}>
                  {item}
                </li>
              ))}
            </ul>
            <div className={styles.actions}>
              <Link href={contactHref({ topic: "spa" })} className={ui.btnGold}>
                Speak with the spa
              </Link>
              <a href={`mailto:${site.email.spa}`} className={styles.mail}>
                {site.email.spa}
              </a>
            </div>
          </div>
        </div>

        <div data-reveal="up" data-delay="100" className={styles.cell}>
          <div className={styles.tour}>
            <div className={cx(ui.eyebrow, styles.eyebrow)}>360&deg; virtual tour</div>
            <h2 className={styles.title}>
              Arrive already <em>at ease</em>
            </h2>
            <p className={styles.text}>
              Walk the hotel in 360&deg; before you arrive — drag to look around each space.
            </p>
            <ul className={styles.links}>
              {TOUR_SCENES.map((scene) => (
                <li key={scene.id}>
                  <Link href={`/tour#${scene.id}`} className={styles.link}>
                    <span className={styles.linkName}>{scene.name}</span>
                    <span className={styles.linkCta}>
                      Enter 360&deg; <span aria-hidden="true">&rarr;</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
