import { Photo } from "@/components/ui/Photo";

import { HEADER_IMAGE } from "./content";
import styles from "./RoomsHeader.module.css";

export function RoomsHeader() {
  return (
    <section className={styles.header} data-nav-anchor>
      <Photo src={HEADER_IMAGE.src} alt={HEADER_IMAGE.alt} sizes="100vw" eager />
      <div className={styles.shade} aria-hidden="true" />
      <div className={styles.content}>
        <p className={styles.kicker}>Accommodation</p>
        <h1 className={styles.title}>Rooms &amp; Suites</h1>
        <p className={styles.intro}>
          Forty-two rooms and suites, each framed around the Sharr Mountains and finished with a warmth entirely your
          own.
        </p>
      </div>
    </section>
  );
}
