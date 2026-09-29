"use client";

import { useEffect, useId, useRef, useState } from "react";

import { cx } from "@/lib/cx";
import { euro, plural } from "@/lib/format";
import ui from "@/styles/ui.module.css";

import {
  AMENITY_FILTERS,
  BED_FILTERS,
  BROWSE_HEADING_ID,
  GUEST_FILTERS,
  PRICE_FILTER,
  SORT_LABELS,
  SORT_OPTIONS,
  TYPE_FILTERS,
  VIEW_FILTERS,
} from "./content";
import { isFiltered, panelFilterCount, pickOption } from "./filters";
import styles from "./FilterToolbar.module.css";
import { useRoomsBooking } from "./RoomsBooking";
import { scrollBehavior } from "./scroll";

/**
 * "Find your room": a heading, then a bar that sticks under the nav while the
 * grid scrolls — room type, sort and a "Filters" button that opens the rest
 * (guests, bed, view, price, amenities) in a panel under the bar.
 */
export function FilterToolbar() {
  const { filters, updateFilters, toggleAmenity, clearFilters, visibleRooms } = useRoomsBooking();
  const [open, setOpen] = useState(false);
  const headRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const amenitiesLabel = useId();

  const panelCount = panelFilterCount(filters);
  const anyActive = isFiltered(filters);
  const stays = plural(visibleRooms.length, "stay");

  // Opening the panel takes focus into it — it comes after the rest of the bar in the DOM.
  useEffect(() => {
    if (open) panelRef.current?.querySelector<HTMLElement>("button, input")?.focus();
  }, [open]);

  // The panel closes on Escape (focus back on "Filters") or a click outside the bar.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    const onPointer = (event: PointerEvent) => {
      if (event.target instanceof Node && !stickyRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  /** When the bar is stuck deep in the grid, bring the top of the (now different) list back into view. */
  function showTopOfList() {
    const head = headRef.current;
    if (!head || head.getBoundingClientRect().bottom >= 0) return;
    // After the re-render: a shorter list would otherwise cut the smooth scroll short.
    requestAnimationFrame(() => head.scrollIntoView({ behavior: scrollBehavior(), block: "start" }));
  }

  function closePanel() {
    setOpen(false);
    toggleRef.current?.focus();
    showTopOfList();
  }

  return (
    <>
      <div ref={headRef} className={styles.head} data-reveal="up">
        <div>
          <p className={ui.eyebrow}>Rooms &amp; suites</p>
          <h2 id={BROWSE_HEADING_ID} className={cx(ui.h2, styles.title)}>
            Find <em>your</em> room
          </h2>
        </div>
        <p className={styles.count} role="status">
          <strong>{stays}</strong> {anyActive ? "match your filters" : "to choose from"}
        </p>
      </div>

      <div ref={stickyRef} className={styles.sticky}>
        <div className={styles.bar}>
          <button
            ref={toggleRef}
            type="button"
            className={styles.filtersButton}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((current) => !current)}
          >
            <span className={styles.slidersIcon} aria-hidden="true" />
            Filters
            {panelCount > 0 && (
              <span className={styles.badge}>
                {panelCount}
                <span className="visually-hidden"> active</span>
              </span>
            )}
          </button>

          <div className={styles.segmented} role="group" aria-label="Room type">
            {TYPE_FILTERS.map((type) => (
              <button
                key={type}
                type="button"
                className={styles.segment}
                aria-pressed={filters.type === type}
                onClick={() => {
                  updateFilters({ type });
                  showTopOfList();
                }}
              >
                {type}
              </button>
            ))}
          </div>

          <label className={styles.sort}>
            <span className={styles.sortLabel}>Sort</span>
            <select
              className={styles.sortSelect}
              value={filters.sort}
              onChange={(event) => {
                updateFilters({ sort: pickOption(SORT_OPTIONS, event.target.value, SORT_OPTIONS[0]) });
                showTopOfList();
              }}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {SORT_LABELS[option]}
                </option>
              ))}
            </select>
          </label>

          {anyActive && (
            <button
              type="button"
              className={styles.clear}
              onClick={() => {
                clearFilters();
                // This button goes away once nothing is filtered; keep focus in the bar.
                toggleRef.current?.focus();
              }}
            >
              Clear<span className="visually-hidden"> all filters</span>
            </button>
          )}
        </div>

        <div ref={panelRef} id={panelId} className={styles.panel} hidden={!open}>
          <ChipGroup
            label="Guests"
            options={GUEST_FILTERS}
            value={filters.guests}
            onChange={(guests) => updateFilters({ guests })}
          />
          <ChipGroup label="Bed" options={BED_FILTERS} value={filters.bed} onChange={(bed) => updateFilters({ bed })} />
          <ChipGroup
            label="View"
            options={VIEW_FILTERS}
            value={filters.view}
            onChange={(view) => updateFilters({ view })}
          />

          <label className={styles.group}>
            <span className={styles.groupHead}>
              <span className={ui.label}>Nightly rate</span>
              <span className={styles.priceValue}>Up to {euro(filters.maxPrice)}</span>
            </span>
            <input
              type="range"
              className={styles.range}
              min={PRICE_FILTER.min}
              max={PRICE_FILTER.max}
              step={PRICE_FILTER.step}
              value={filters.maxPrice}
              aria-valuetext={`Up to ${euro(filters.maxPrice)} a night`}
              onChange={(event) => updateFilters({ maxPrice: Number(event.target.value) })}
            />
          </label>

          <div className={styles.group} role="group" aria-labelledby={amenitiesLabel}>
            <span id={amenitiesLabel} className={ui.label}>
              Amenities
            </span>
            <div className={styles.chips}>
              {AMENITY_FILTERS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  className={styles.chip}
                  aria-pressed={filters.amenities.includes(value)}
                  onClick={() => toggleAmenity(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.panelFoot}>
            <button type="button" className={styles.clearAll} onClick={clearFilters}>
              Clear all
            </button>
            <button type="button" className={styles.done} onClick={closePanel}>
              Show {stays}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

type ChipGroupProps<T extends string> = {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
};

/** One-of-several filter as a row of pressable chips. */
function ChipGroup<T extends string>({ label, options, value, onChange }: ChipGroupProps<T>) {
  const labelId = useId();
  return (
    <div className={styles.group} role="group" aria-labelledby={labelId}>
      <span id={labelId} className={ui.label}>
        {label}
      </span>
      <div className={styles.chips}>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={styles.chip}
            aria-pressed={value === option}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
