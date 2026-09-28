"use client";

import { useState } from "react";

import { Photo } from "@/components/ui/Photo";
import { cx } from "@/lib/cx";
import { euro, plural } from "@/lib/format";

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
  "Price ↑": (a, b) => a.price - b.price,
  "Price ↓": (a, b) => b.price - a.price,
  // Longest first.
  Duration: (a, b) => b.minutes - a.minutes,
};

/** The menu in recommended order; ties in the other sorts keep this order. */
const BY_RANK = [...TREATMENTS].sort(COMPARE.Recommended);

/** Category filter, sort and the card grid. */
export function TreatmentMenu() {
  const [filter, setFilter] = useState<Filter>("All");
  const [sort, setSort] = useState<TreatmentSort>("Recommended");

  const visible = BY_RANK.filter((t) => filter === "All" || t.category === filter).sort(COMPARE[sort]);

  return (
    <>
      <div className={styles.toolbar}>
        <div className={styles.chips} role="group" aria-label="Filter by category">
          {FILTERS.map((option) => (
            <button
              key={option}
              type="button"
              className={styles.chip}
              aria-pressed={option === filter}
              onClick={() => setFilter(option)}
            >
              {option}
            </button>
          ))}
        </div>
        <div className={styles.tools}>
          <span className={styles.count} aria-live="polite">
            {plural(visible.length, "treatment")}
          </span>
          <label className={styles.sort}>
            <span className={styles.sortLabel}>Sort</span>
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

      <div className={styles.grid}>
        {visible.map((treatment) => (
          <TreatmentCard key={treatment.id} treatment={treatment} />
        ))}
        {visible.length === 0 && (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>No treatments in that category</p>
            <p className={styles.emptyText}>Try another category, or view them all.</p>
            <button type="button" className={styles.emptyButton} onClick={() => setFilter("All")}>
              View all
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function TreatmentCard({ treatment }: { treatment: Treatment }) {
  return (
    <article className={cx(styles.card, treatment.dark && styles.dark)}>
      <div className={styles.media}>
        <Photo
          src={treatment.image}
          alt={treatment.name}
          sizes="(max-width: 790px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {treatment.badge && <span className={styles.badge}>{treatment.badge}</span>}
        <span className={styles.duration}>{treatment.duration}</span>
      </div>
      <div className={styles.body}>
        <div className={styles.category}>{treatment.kicker ?? treatment.category}</div>
        <div className={styles.titleRow}>
          <h3 className={styles.name}>{treatment.name}</h3>
          <span className={styles.price}>{euro(treatment.price)}</span>
        </div>
        <p className={styles.text}>{treatment.description}</p>
        <a href="#book" className={styles.book}>
          Book<span className="visually-hidden"> {treatment.name}</span>
        </a>
      </div>
    </article>
  );
}
