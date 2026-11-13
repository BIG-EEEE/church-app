# Turning this into a native app (Capacitor)

The web build is already structured for this. The upgrade is a few commands, not a rewrite.

## Why it is small

- `npm run build` produces `dist/`. Capacitor takes that folder as `webDir`.
- All asset URLs go through `assetUrl()` in `src/lib/platform.ts`. Nothing is hardcoded to a server.
- `src/lib/platform.ts` is the only place that asks "are we native?". The service worker registers only on the web
  (`canUseServiceWorker`), so the native shell never registers one.
- Storage goes through `src/lib/storage.ts`. localStorage works inside the native WebView. If iOS eviction is a
  concern, swap those two functions for `@capacitor/preferences`.
- Layout already respects `env(safe-area-inset-*)` and `viewport-fit=cover`.
- The Bible ships inside `dist/bible/`, so the native app has it offline from the first launch, with no cache needed.

## Steps

```
npm i @capacitor/core @capacitor/cli
npx cap init "Church App" org.example.church --web-dir dist
npm i @capacitor/android @capacitor/ios
npm run build
npx cap add android
npx cap add ios        # needs a Mac with Xcode
npx cap sync
npx cap open android
```

`capacitor.config.ts`:

```ts
import type { CapacitorConfig } from '@capacitor/cli';
const config: CapacitorConfig = {
  appId: 'org.example.church',
  appName: 'Church App',
  webDir: 'dist',
  server: { androidScheme: 'https' }, // pin it so web storage origins stay stable
};
export default config;
```

Then add `@capacitor/status-bar`, `@capacitor/splash-screen` and `@capacitor/push-notifications` as needed.

## Watch out for

- Service workers: reports exist of "Failed to register a ServiceWorker" inside Capacitor Android. We avoid it by not
  registering one when `isNative` is true. Verify on a device.
- Build order: always `npm run build` before `npx cap sync`, or the app ships stale files.
- Store review needs a real name, icon, privacy policy and (for Apple) an account. Public-domain Bible text needs no
  licence, but keep the attribution in About.

Sources:
- https://noqta.tn/en/tutorials/capacitor-react-mobile-app-ios-android-2026
- https://forum.ionicframework.com/t/fresh-project-android-shows-white-screen/237122
- https://vite-pwa-org.netlify.app/guide/service-worker-precache
