/**
 * Tiny deterministic PRNG helpers used by the Dimension CRM mock data generators.
 * Everything is seeded so the generated dataset is byte-stable across builds and
 * identical on the server and the client (no hydration drift).
 */

export function createRandom(seed: number) {
  let state = seed >>> 0;

  return function random() {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Random = ReturnType<typeof createRandom>;

export function pick<T>(random: Random, items: readonly T[]): T {
  return items[Math.floor(random() * items.length) % items.length];
}

export function pickMany<T>(random: Random, items: readonly T[], count: number): T[] {
  const pool = [...items];
  const selected: T[] = [];

  for (let index = 0; index < count && pool.length > 0; index += 1) {
    const position = Math.floor(random() * pool.length) % pool.length;
    selected.push(pool[position]);
    pool.splice(position, 1);
  }

  return selected;
}

export function randomInt(random: Random, min: number, max: number): number {
  return min + Math.floor(random() * (max - min + 1));
}

export function randomFloat(random: Random, min: number, max: number, decimals = 2): number {
  const value = min + random() * (max - min);
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function chance(random: Random, probability: number): boolean {
  return random() < probability;
}

/** Weighted pick: `[value, weight]` tuples. */
export function weighted<T>(random: Random, entries: readonly (readonly [T, number])[]): T {
  const total = entries.reduce((sum, entry) => sum + entry[1], 0);
  let threshold = random() * total;

  for (const [value, weight] of entries) {
    threshold -= weight;
    if (threshold <= 0) return value;
  }

  return entries[entries.length - 1][0];
}

/** Fixed reference "today" so every generated record stays stable across builds. */
export const REFERENCE_DATE = new Date("2026-06-30T09:00:00.000Z");

const DAY_MS = 24 * 60 * 60 * 1000;

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_MS);
}

export function dateOffset(random: Random, minDays: number, maxDays: number): Date {
  return addDays(REFERENCE_DATE, randomInt(random, minDays, maxDays));
}

export function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function toIso(date: Date): string {
  return date.toISOString();
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function padId(prefix: string, index: number): string {
  return `${prefix}-${String(index).padStart(4, "0")}`;
}
