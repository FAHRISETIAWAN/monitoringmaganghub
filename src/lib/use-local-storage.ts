"use client";

import { useCallback, useSyncExternalStore } from "react";

type Listener = () => void;

const listenersByKey = new Map<string, Set<Listener>>();
const cacheByKey = new Map<string, { raw: string | null; value: unknown }>();

function getListeners(key: string) {
  let listeners = listenersByKey.get(key);
  if (!listeners) {
    listeners = new Set();
    listenersByKey.set(key, listeners);
  }
  return listeners;
}

function readValue<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;

  let raw: string | null;
  try {
    raw = window.localStorage.getItem(key);
  } catch {
    raw = null;
  }

  const cached = cacheByKey.get(key);
  if (cached && cached.raw === raw) {
    return cached.value as T;
  }

  let value: T = defaultValue;
  if (raw) {
    try {
      value = JSON.parse(raw) as T;
    } catch {
      value = defaultValue;
    }
  }
  cacheByKey.set(key, { raw, value });
  return value;
}

function writeValue<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore unavailable storage
  }
  cacheByKey.delete(key);
  getListeners(key).forEach((listener) => listener());
}

function removeValue(key: string) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore unavailable storage
  }
  cacheByKey.delete(key);
  getListeners(key).forEach((listener) => listener());
}

/** Synchronizes React state with a localStorage key via useSyncExternalStore. */
export function useLocalStorageState<T>(key: string, defaultValue: T) {
  const subscribe = useCallback(
    (listener: Listener) => {
      const listeners = getListeners(key);
      listeners.add(listener);
      window.addEventListener("storage", listener);
      return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", listener);
      };
    },
    [key]
  );

  const getSnapshot = useCallback(
    () => readValue(key, defaultValue),
    [key, defaultValue]
  );
  const getServerSnapshot = useCallback(() => defaultValue, [defaultValue]);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const setValue = useCallback((next: T) => writeValue(key, next), [key]);
  const clearValue = useCallback(() => removeValue(key), [key]);

  return [value, setValue, clearValue] as const;
}
