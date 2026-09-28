"use client";

import { useEffect, useRef, useState, type ComponentProps } from "react";

import { cx } from "@/lib/cx";

import { PanoViewer } from "./PanoViewer";
import styles from "./PanoViewer.module.css";

type LazyPanoViewerProps = ComponentProps<typeof PanoViewer> & {
  /** How far outside the viewport to start loading. */
  rootMargin?: string;
};

/**
 * Mounts the 360° viewer only when it approaches the viewport, so pages with
 * an inline teaser don't download a multi-megabyte panorama up front.
 */
export function LazyPanoViewer({ rootMargin = "400px", className, ...props }: LazyPanoViewerProps) {
  const placeholderRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = placeholderRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [rootMargin]);

  if (visible) return <PanoViewer className={className} {...props} />;
  return <div ref={placeholderRef} className={cx(styles.host, styles.placeholder, className)} aria-hidden="true" />;
}
