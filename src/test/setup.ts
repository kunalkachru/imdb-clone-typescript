import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

const localStorageStore = new Map<string, string>();

const localStorageMock: Storage = {
  get length() {
    return localStorageStore.size;
  },
  clear: () => {
    localStorageStore.clear();
  },
  getItem: (key: string) => localStorageStore.get(key) ?? null,
  key: (index: number) => Array.from(localStorageStore.keys())[index] ?? null,
  removeItem: (key: string) => {
    localStorageStore.delete(key);
  },
  setItem: (key: string, value: string) => {
    localStorageStore.set(key, value);
  },
};

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
  writable: true,
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

afterEach(() => {
  cleanup();
});
