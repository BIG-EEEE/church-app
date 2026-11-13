import { registerSW as register } from 'virtual:pwa-register';
import { canUseServiceWorker } from './lib/platform';

/** Registers the offline service worker on the web build only. A Capacitor shell skips it. */
export function registerSW() {
  if (canUseServiceWorker) register({ immediate: true });
}
