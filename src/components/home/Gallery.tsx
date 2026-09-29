"use client";

import { useState } from "react";

import { Photo } from "@/components/ui/Photo";
import { PhotoCredit } from "@/components/ui/PhotoCredit";
import { cx } from "@/lib/cx";

import { gallery, galleryFilters, type GalleryCategory } from "./content";
import styles from "./sections.module.css";

export function Gallery() {
  const [filter, setFilter] = useState<GalleryCategory | "all">("all");

  return (
    <>
      <div className={styles.galleryChips} role="group" aria-label="Filter the gallery">
        {galleryFilters.map((chip) => (
          <button
            key={chip.key}
            type="button"
            className={cx(styles.galleryChip, filter === chip.key && styles.galleryChipOn)}
            aria-pressed={filter === chip.key}
            onClick={() => setFilter(chip.key)}
          >
            {chip.label}
          </button>
        ))}
      </div>
      <div className={styles.galleryGrid}>
        {gallery
          .filter((item) => filter === "all" || item.category === filter)
          .map((item) => (
            <figure key={item.src} className={styles.galleryItem}>
              <div style={{ aspectRatio: item.ratio }}>
                <Photo
                  src={item.src}
                  alt={item.alt}
                  position={item.position}
                  sizes="(max-width: 600px) 50vw, (max-width: 1100px) 33vw, 300px"
                />
              </div>
              <figcaption className={styles.galleryCaption}>
                {galleryFilters.find((chip) => chip.key === item.category)?.label}
              </figcaption>
            </figure>
          ))}
      </div>
      <div className={styles.galleryCredits}>
        {gallery
          .filter((item) => item.credit)
          .map((item) => (
            <PhotoCredit key={item.src} credit={item.credit} tone="dark" />
          ))}
      </div>
    </>
  );
}
