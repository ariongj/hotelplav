"use client";

import { useId, useState, type KeyboardEvent } from "react";

import styles from "./ChefsTasting.module.css";
import { DEFAULT_TASTING_MENU, TASTING_MENU_KEYS, TASTING_MENUS, TASTING_NOTES, type TastingMenuKey } from "./content";

/**
 * Tab card for the three menu paths (WAI-ARIA tabs: arrow keys, Home and
 * End move between tabs). Every panel is in the HTML; the inactive ones are
 * hidden.
 */
export function TastingMenu() {
  const [menu, setMenu] = useState<TastingMenuKey>(DEFAULT_TASTING_MENU);
  const baseId = useId();
  const tabId = (key: TastingMenuKey) => `${baseId}-tab-${key}`;
  const panelId = (key: TastingMenuKey) => `${baseId}-panel-${key}`;

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const index = TASTING_MENU_KEYS.indexOf(menu);
    const last = TASTING_MENU_KEYS.length - 1;
    const moves: Record<string, number> = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    const next: TastingMenuKey | undefined = TASTING_MENU_KEYS[moves[event.key] ?? -1];
    if (!next) return;
    event.preventDefault();
    setMenu(next);
    document.getElementById(tabId(next))?.focus();
  }

  return (
    <div className={styles.card}>
      <div className={styles.tabs} role="tablist" aria-label="Choose a menu">
        {TASTING_MENU_KEYS.map((key) => {
          const selected = key === menu;
          return (
            <button
              key={key}
              id={tabId(key)}
              type="button"
              role="tab"
              className={styles.tab}
              aria-selected={selected}
              aria-controls={panelId(key)}
              tabIndex={selected ? 0 : -1}
              onClick={() => setMenu(key)}
              onKeyDown={onKeyDown}
            >
              {key}
            </button>
          );
        })}
      </div>

      {TASTING_MENU_KEYS.map((key) => (
        <div
          key={key}
          id={panelId(key)}
          role="tabpanel"
          aria-labelledby={tabId(key)}
          tabIndex={0}
          hidden={key !== menu}
          className={styles.panel}
        >
          <p className={styles.note}>{TASTING_NOTES[key]}</p>
          <ol className={styles.courses}>
            {TASTING_MENUS[key].map((course, index) => {
              const [dish, ...sides] = course.split(" · ");
              return (
                <li key={course} className={styles.course}>
                  <span className={styles.number} aria-hidden="true">
                    {index + 1}
                  </span>
                  <span className={styles.dish}>
                    {dish}
                    {sides.length > 0 && <span className={styles.sides}>{sides.join(", ")}</span>}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      ))}
    </div>
  );
}
