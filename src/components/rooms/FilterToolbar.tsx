"use client";

import { useId } from "react";

import { cx } from "@/lib/cx";
import { euro, plural } from "@/lib/format";

import {
  AMENITY_FILTERS,
  BED_FILTERS,
  GUEST_FILTERS,
  PRICE_FILTER,
  SORT_OPTIONS,
  TYPE_FILTERS,
  VIEW_FILTERS,
} from "./content";
import { pickOption } from "./filters";
import styles from "./FilterToolbar.module.css";
import { useRoomsBooking } from "./RoomsBooking";

export function FilterToolbar() {
  const { filters, updateFilters, toggleAmenity, clearFilters, visibleRooms } = useRoomsBooking();
  const amenitiesLabel = useId();

  return (
    <section id="results" className={styles.section}>
      <div className={styles.inner}>
        <h2 className="visually-hidden">Browse rooms and suites</h2>

        <div className={styles.toolbar}>
          <div className={styles.segmented} role="group" aria-label="Room type">
            {TYPE_FILTERS.map((type) => (
              <button
                key={type}
                type="button"
                className={styles.segment}
                aria-pressed={filters.type === type}
                onClick={() => updateFilters({ type })}
              >
                {type}
              </button>
            ))}
          </div>

          <SelectFilter
            label="Guests"
            options={GUEST_FILTERS}
            value={filters.guests}
            onChange={(guests) => updateFilters({ guests })}
          />
          <SelectFilter label="Bed" options={BED_FILTERS} value={filters.bed} onChange={(bed) => updateFilters({ bed })} />
          <SelectFilter
            label="View"
            options={VIEW_FILTERS}
            value={filters.view}
            onChange={(view) => updateFilters({ view })}
          />

          <label className={cx(styles.field, styles.priceField)}>
            <span className={styles.label}>
              Nightly rate <span className={styles.priceValue}>Up to {euro(filters.maxPrice)}</span>
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

          <SelectFilter
            label="Sort"
            className={styles.sortField}
            options={SORT_OPTIONS}
            value={filters.sort}
            onChange={(sort) => updateFilters({ sort })}
          />
        </div>

        <div className={styles.chipsRow}>
          <div className={styles.chips} role="group" aria-labelledby={amenitiesLabel}>
            <span id={amenitiesLabel} className={cx(styles.label, styles.chipsLabel)}>
              Amenities
            </span>
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
            <button type="button" className={styles.clear} onClick={clearFilters}>
              Clear<span className="visually-hidden"> all filters</span>
            </button>
          </div>
          <span className={styles.count} role="status">
            {plural(visibleRooms.length, "stay")}
          </span>
        </div>
      </div>
    </section>
  );
}

type SelectFilterProps<T extends string> = {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  /** Sizing class; defaults to the standard select width. */
  className?: string;
};

function SelectFilter<T extends string>({ label, options, value, onChange, className }: SelectFilterProps<T>) {
  return (
    <label className={cx(styles.field, className ?? styles.selectField)}>
      <span className={styles.label}>{label}</span>
      <select
        className={styles.select}
        value={value}
        onChange={(event) => onChange(pickOption(options, event.target.value, options[0]))}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
