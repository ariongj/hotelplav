/*
 * Warms the browser cache with the other scenes' panoramas once the first one
 * is showing, so a scene switch cross-fades straight away instead of holding
 * the previous frame while several megabytes download. (In the prototype the
 * "Four spaces" thumbnails were the full-size panoramas, which had the same
 * effect; those thumbnails are now small optimised images.)
 */

const requested = new Set<string>();

function warm(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    // Same request mode as the viewer's loader, so its request is a cache hit.
    img.crossOrigin = "anonymous";
    img.addEventListener("load", () => resolve(), { once: true });
    img.addEventListener("error", () => resolve(), { once: true });
    img.src = src;
  });
}

/**
 * Fetches the panoramas one at a time — not at all when the visitor asks to
 * save data. Returns a function that stops before the next one.
 */
export function preloadPanoramas(srcs: readonly string[]): () => void {
  let stopped = false;
  const { connection } = navigator as Navigator & { connection?: { saveData?: boolean } };
  if (!connection?.saveData) {
    void (async () => {
      for (const src of srcs) {
        if (stopped) return;
        if (requested.has(src)) continue;
        requested.add(src);
        await warm(src);
      }
    })();
  }
  return () => {
    stopped = true;
  };
}
