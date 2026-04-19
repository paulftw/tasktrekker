'use client';

import { useSyncExternalStore } from 'react';

let cachedPlatform: 'mac' | 'windows' | 'mobile' | null = null;

function getPlatform() {
  if (typeof navigator === 'undefined') return null;
  if (cachedPlatform) return cachedPlatform;

  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  if (isMobile) {
    cachedPlatform = 'mobile';
    return cachedPlatform;
  }

  const isMac = /Mac OS X|Macintosh|MacIntel|MacPPC|Mac_PowerPC/i.test(navigator.userAgent);
  cachedPlatform = isMac ? 'mac' : 'windows';
  return cachedPlatform;
}

const emptySubscribe = () => () => {};

export function usePlatform() {
  // useSyncExternalStore safely handles the SSR hydration mismatch.
  // It returns null on the server/first-render, then immediately re-renders with the actual client value.
  return useSyncExternalStore(emptySubscribe, getPlatform, () => null);
}
