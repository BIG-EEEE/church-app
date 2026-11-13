// Single place that knows whether we run in a browser/PWA or inside a native shell (Capacitor).
// The rest of the app asks this module; it never touches `window.Capacitor` directly.
type CapacitorGlobal = { isNativePlatform?: () => boolean; getPlatform?: () => string };
const cap = (globalThis as { Capacitor?: CapacitorGlobal }).Capacitor;

export const isNative = Boolean(cap?.isNativePlatform?.());
export const platform: 'web' | 'ios' | 'android' = isNative ? ((cap?.getPlatform?.() as 'ios' | 'android') ?? 'web') : 'web';

/** Service workers are for the web build only. Native shells bundle assets and must not register one. */
export const canUseServiceWorker = !isNative && 'serviceWorker' in navigator;

/** Asset URL relative to the app root, so the same build runs on Vercel and inside Capacitor. */
export const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
