"use client";

import { useState } from "react";

import { Photo } from "@/components/ui/Photo";
import { cx } from "@/lib/cx";
import { euro, plural } from "@/lib/format";
import ui from "@/styles/ui.module.css";

import { BookLink } from "./BookLink";
import {
  TREATMENT_CATEGORIES,
  TREATMENT_SORTS,
  TREATMENTS,
  type Treatment,
  type TreatmentCategory,
  type TreatmentSort,
} from "./content";
import styles from "./Treatments.module.css";

type Filter = "All" | TreatmentCategory;

const FILTERS: readonly Filter[] = ["All", ...TREATMENT_CATEGORIES];

const COMPARE: Record<TreatmentSort, (a: Treatment, b: Treatment) => number> = {
  Recommended: (a, b) => a.rank - b.rank,
  "Lowest price": (a, b) => a.price - b.price,
  "Highest price": (a, b) => b.price - a.price,
  "Longest first": (a, b) => b.minutes - a.minutes,
};

/** The menu in recommended order; ties in the other sorts keep this order. */
const BY_RANK = [...TREATMENTS].sort(COMPARE.Recommended);

/** Category pills, sort, and the cards — a swipeable row on phones, a grid above. */
export function TreatmentMenu() {
  const [filter, setFilter] = useState<Filter>("All");
  const [sort, setSort] = useState<TreatmentSort>("Recommended");

  const visible = BY_RANK.filter((t) => filter === "All" || t.category === filter).sort(COMPARE[sort]);

  return (
    <div data-reveal="up" data-delay="80">
      <div className={styles.toolbar}>
        <div className={styles.pills} role="group" aria-label="Filter by category">
          {FILTERS.map((option) => (
            <button
              key={option}
              type="button"
              className={styles.pill}
              aria-pressed={option === filter}
              onClick={() => setFilter(option)}
            >
              {option === "All" ? "All treatments" : option}
            </button>
          ))}
        </div>
        <div className={styles.tools}>
          <span className={styles.count} aria-live="polite">
            {plural(visible.length, "treatment")}
          </span>
          <label className={styles.sort}>
            <span className={styles.sortLabel}>Sort by</span>
            <select
              className={styles.sortSelect}
              value={sort}
              onChange={(event) => {
                const next = TREATMENT_SORTS.find((option) => option === event.target.value);
                if (next) setSort(next);
              }}
            >
              {TREATMENT_SORTS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {visible.length > 0 ? (
        <>
          <ul className={styles.list} aria-label="Treatments">
            {visible.map((treatment) => (
              <li key={treatment.id} className={styles.item}>
                <TreatmentCard treatment={treatment} />
              </li>
            ))}
          </ul>
          {visible.length > 1 && (
            <p className={styles.swipeHint} aria-hidden="true">
              Swipe for more <span>&rarr;</span>
            </p>
          )}
        </>
      ) : (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>No treatments in that category</p>
          <p className={styles.emptyText}>Try another category, or view them all.</p>
          <button type="button" className={ui.btnGold} onClick={() => setFilter("All")}>
            View all treatments
          </button>
        </div>
      )}
    </div>
  );
}

function TreatmentCard({ treatment }: { treatment: Treatment }) {
  return (
    <article className={cx(styles.card, treatment.dark && styles.dark)}>
      <div className={styles.media}>
        {/* A mood photo, not a picture of the treatment: the heading below names it. */}
        <Photo
          src={treatment.image}
          alt=""
          sizes="(max-width: 719px) 84vw, (max-width: 1099px) 50vw, 420px"
          className={styles.photo}
        />
        {treatment.badge && <span className={styles.badge}>{treatment.badge}</span>}
        <span className={styles.duration}>{treatment.duration}</span>
      </div>
      <div className={styles.body}>
        <div className={styles.category}>{treatment.kicker ?? treatment.category}</div>
        <h3 className={styles.name}>{treatment.name}</h3>
        <p className={styles.text}>{treatment.description}</p>
        <div className={styles.footer}>
          <span className={styles.price}>
            <span className="visually-hidden">Price: </span>
            {euro(treatment.price)}
          </span>
          <BookLink treatment={treatment.name} className={cx(treatment.dark ? ui.btnGold : ui.btnOutline, styles.book)}>
            Book<span className="visually-hidden"> {treatment.name}</span>
          </BookLink>
        </div>
      </div>
    </article>
  );
}
