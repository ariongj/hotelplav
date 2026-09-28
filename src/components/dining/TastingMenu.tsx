"use client";

import { useId, useState, type ReactNode } from "react";

import styles from "./ChefsTasting.module.css";
import { DEFAULT_TASTING_MENU, TASTING_MENU_KEYS, TASTING_MENUS } from "./content";

const NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

/**
 * Menu switch and course lists. All three lists are rendered (the inactive
 * ones hidden) so every menu is in the HTML. `children` — prices and the
 * reserve button — render below the courses and reveal together with them.
 */
export function TastingMenu({ children }: { children: ReactNode }) {
  const [menu, setMenu] = useState(DEFAULT_TASTING_MENU);
  const baseId = useId();

  return (
    <>
      <div data-reveal="up" className={styles.options} role="group" aria-label="Choose a menu">
        {TASTING_MENU_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            className={styles.option}
            aria-pressed={key === menu}
            aria-controls={`${baseId}-${key}`}
            onClick={() => setMenu(key)}
          >
            {key}
          </button>
        ))}
      </div>

      <div data-reveal="up" className={styles.menu}>
        {TASTING_MENU_KEYS.map((key) => (
          <ol
            key={key}
            id={`${baseId}-${key}`}
            className={styles.courses}
            aria-label={`${key} menu`}
            hidden={key !== menu}
          >
            {TASTING_MENUS[key].map((course, index) => (
              <li key={course} className={styles.course}>
                <span className={styles.dish}>{course}</span>
                <span className={styles.numeral} aria-hidden="true">
                  {NUMERALS[index] ?? index + 1}
                </span>
              </li>
            ))}
          </ol>
        ))}
        {children}
      </div>
    </>
  );
}
