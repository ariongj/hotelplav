import styles from "./ContactIntro.module.css";

export function ContactIntro() {
  return (
    <section className={styles.intro} data-nav-anchor>
      <div className={styles.inner}>
        <div className={styles.heading}>
          <div className={styles.eyebrow} data-reveal="up">
            Contact
          </div>
          <h1 className={styles.title} data-reveal="up" data-delay="80">
            At your service,
            <br />
            <em>around the clock.</em>
          </h1>
        </div>
        <p className={styles.lead} data-reveal="up" data-delay="140">
          Reservations, occasions, or a question about the mountain &mdash; a person answers, not a machine.
        </p>
      </div>
    </section>
  );
}
