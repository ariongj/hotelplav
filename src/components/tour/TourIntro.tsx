import styles from "./TourIntro.module.css";

/** Dark page header above the 360° viewer. */
export function TourIntro() {
  return (
    <section className={styles.intro}>
      <div className={styles.inner}>
        <div className={styles.heading}>
          <div className={styles.eyebrow} data-reveal="up">
            360&deg; Virtual Tour
          </div>
          <h1 className={styles.title} data-reveal="up" data-delay="80">
            Be there,
            <br />
            <em>before you arrive.</em>
          </h1>
        </div>
        <p className={styles.lead} data-reveal="up" data-delay="140">
          Step inside four spaces of the resort in full 360&deg;. Drag to look around, pinch or double-tap to move
          closer &mdash; as if you were standing there.
        </p>
      </div>
    </section>
  );
}
