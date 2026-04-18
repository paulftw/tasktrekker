import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// relay-test-utils calls `jest.fn()` internally; vitest's `vi` is API-compatible.
(globalThis as unknown as { jest: typeof vi }).jest = vi;
