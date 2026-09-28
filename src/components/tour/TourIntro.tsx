import styles from "./TourIntro.module.css";

/** Dark page header above the virtual tour stage. */
export function TourIntro() {
  return (
    <section className={styles.intro}>
      <div className={styles.inner}>
        <div className={styles.heading}>
          <div className={styles.eyebrow} data-reveal="up">
            Virtual Tour &middot; 3D &amp; 360&deg;
          </div>
          <h1 className={styles.title} data-reveal="up" data-delay="80">
            Be there,
            <br />
            <em>before you arrive.</em>
          </h1>
        </div>
        <p className={styles.lead} data-reveal="up" data-delay="140">
          Fly over the resort in 3D, then step inside four of its spaces in full 360&deg;. Drag to look around, pinch
          to move closer &mdash; or take the guided tour and let us show you around.
        </p>
      </div>
    </section>
  );
}
