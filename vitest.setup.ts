import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// relay-test-utils calls `jest.fn()` internally; vitest's `vi` is API-compatible.
(globalThis as unknown as { jest: typeof vi }).jest = vi;

// Suppress noisy Radix UI / act warnings that are effectively false positives in this environment
const originalError = console.error;
console.error = (...args) => {
  const msg = args.join(' ');
  if (
    msg.includes('was not wrapped in act(...)') ||
    msg.includes('FocusScope') ||
    msg.includes('DismissableLayer') ||
    msg.includes('Presence') ||
    msg.includes('PopperContent') ||
    msg.includes('Menu') ||
    msg.includes('suspended inside an act scope')
  ) {
    return;
  }
  originalError.call(console, ...args);
};
