// Tiny typed key-value store. Sync API over localStorage today.
// Native upgrade path: swap the two functions below for @capacitor/preferences if iOS eviction matters.
const PREFIX = 'church:';

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* private mode or quota: the app still works, it just will not remember */
  }
}
