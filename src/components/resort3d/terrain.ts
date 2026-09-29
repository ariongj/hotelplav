/*
 * Procedural terrain for the illustrative 3D map of Plav Hotel on Lake Plav. Pure maths (no
 * three.js) so it is cheap to import and deterministic: the same valley is
 * generated on every visit.
 *
 * Orientation (illustrative, not to scale): x runs along the valley and −z
 * climbs away from the water. The hotel sits at the foot of the high ground
 * behind it, facing across the lake; no compass direction is implied.
 */

export const WORLD_SIZE = 260;
export const WATER_LEVEL = 0.35;

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

function hash(x: number, y: number): number {
  let h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967295;
}

function valueNoise(x: number, y: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi);
  const b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1);
  const d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

/** Fractal noise in roughly −1…1. */
export function fbm(x: number, y: number, octaves = 5): number {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < octaves; i++) {
    sum += amp * (valueNoise(x * freq, y * freq) * 2 - 1);
    freq *= 2.03;
    amp *= 0.5;
  }
  return sum;
}

type Peak = { x: number; z: number; h: number; r: number };

const PEAKS: readonly Peak[] = [
  { x: -46, z: -106, h: 40, r: 30 },
  { x: 8, z: -122, h: 54, r: 34 },
  { x: 64, z: -102, h: 38, r: 27 },
  { x: -100, z: -74, h: 28, r: 28 },
  { x: 106, z: -56, h: 24, r: 26 },
  { x: -72, z: 106, h: 13, r: 34 },
  { x: 62, z: 112, h: 11, r: 30 },
];

/** Lake Plav: an ellipse in front of the hotel (a dip below the water line). */
export const LAKE = { x: 2, z: 40, rx: 36, rz: 21 };

/** Distance from the lake centre in lake radii (1 = the shoreline). */
export function lakeDistance(x: number, z: number): number {
  return Math.hypot((x - LAKE.x) / LAKE.rx, (z - LAKE.z) / LAKE.rz);
}

/** Flat building plots: centre, half extents, blend distance. */
export type Pad = { x: number; z: number; hw: number; hd: number; blend: number };

export const PADS: Record<"hotel" | "chapel" | "trailHead" | "viewpoint", Pad> = {
  hotel: { x: 8, z: -7, hw: 30, hd: 15, blend: 9 },
  chapel: { x: -38, z: -20, hw: 8, hd: 10, blend: 7 },
  trailHead: { x: 46, z: -28, hw: 6, hd: 6, blend: 6 },
  viewpoint: { x: 82, z: -104, hw: 6, hd: 6, blend: 6 },
};

function rawHeight(x: number, z: number): number {
  // High ground behind the hotel, low hills across the water, rising at both ends.
  const behind = Math.pow(smoothstep(-22, -125, z), 1.25) * 44;
  const across = smoothstep(54, 130, z) * 15;
  const ends = smoothstep(82, 130, Math.abs(x)) * 22;
  let h = behind + across + ends;

  for (const p of PEAKS) {
    const d2 = ((x - p.x) ** 2 + (z - p.z) ** 2) / (p.r * p.r);
    h += p.h * Math.exp(-d2);
  }

  // Rougher rock the higher the ground; the valley floor stays gentle.
  const alpine = clamp01(h / 26);
  const ridged = 1 - Math.abs(fbm(x * 0.021, z * 0.021, 4));
  h += fbm(x * 0.035, z * 0.035) * (1.1 + alpine * 6) + ridged * ridged * alpine * 7;

  h -= 5.6 * Math.exp(-((lakeDistance(x, z) / 0.78) ** 2));

  return h;
}

/** Distance outside a pad's rectangle (0 inside). */
function padDistance(pad: Pad, x: number, z: number): number {
  const dx = Math.max(0, Math.abs(x - pad.x) - pad.hw);
  const dz = Math.max(0, Math.abs(z - pad.z) - pad.hd);
  return Math.hypot(dx, dz);
}

const padLevels = new Map<Pad, number>();

export function padLevel(pad: Pad): number {
  let level = padLevels.get(pad);
  if (level === undefined) {
    level = Math.max(WATER_LEVEL + 0.8, rawHeight(pad.x, pad.z));
    padLevels.set(pad, level);
  }
  return level;
}

/** Ground height at (x, z), with building plots levelled. */
export function heightAt(x: number, z: number): number {
  let h = rawHeight(x, z);
  for (const pad of Object.values(PADS)) {
    const d = padDistance(pad, x, z);
    if (d >= pad.blend) continue;
    const w = 1 - smoothstep(0, pad.blend, d);
    h += (padLevel(pad) - h) * w;
  }
  return h;
}

/** Deterministic pseudo-random sequence (mulberry32). */
export function random(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** True when (x, z) is on (or next to) a building plot or in the lake. */
export function isReserved(x: number, z: number, margin = 3): boolean {
  if (lakeDistance(x, z) < 1 + margin / LAKE.rz) return true;
  return Object.values(PADS).some((pad) => padDistance(pad, x, z) < margin);
}
