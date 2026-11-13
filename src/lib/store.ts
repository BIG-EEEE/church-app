import { useSyncExternalStore } from 'react';
import { load, save } from './storage';

/** Minimal persisted store: get / set / subscribe, plus a React hook. No dependency needed. */
export function createStore<T extends object>(key: string, initial: T) {
  let state: T = { ...initial, ...load<Partial<T>>(key, {}) };
  const subs = new Set<() => void>();
  return {
    get: () => state,
    set(patch: Partial<T> | ((s: T) => Partial<T>)) {
      state = { ...state, ...(typeof patch === 'function' ? patch(state) : patch) };
      save(key, state);
      subs.forEach((f) => f());
    },
    subscribe(f: () => void) { subs.add(f); return () => { subs.delete(f); }; },
  };
}

export function useStore<T extends object>(store: ReturnType<typeof createStore<T>>): T {
  return useSyncExternalStore(store.subscribe, store.get);
}
