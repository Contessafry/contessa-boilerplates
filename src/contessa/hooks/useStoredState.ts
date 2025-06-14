/** @format */

import { useState, useEffect, useMemo, useRef } from "react";

/**
 * Parameters for the useStoredState hook
 * @template T - The type of the stored value
 */
interface Params<T> {
  /** Unique key for storing the value in storage */
  key: string;
  /** Default value to use if no value is found in storage */
  value: T;
  /** Type of storage to use ('local' for localStorage or 'session' for sessionStorage) */
  type: "local" | "session";
}

/**
 * A React hook that persists state in localStorage or sessionStorage and syncs it across tabs.
 *
 * @template T - The type of the stored value
 * @param {Params<T>} params - The parameters object
 * @param {string} params.key - Unique key for storing the value
 * @param {T} params.value - Default value to use if no value is found in storage
 * @param {"local" | "session"} params.type - Type of storage to use
 *
 * @returns {[T, (value: T) => void, () => void]} A tuple containing:
 * - The current stored value
 * - A function to update the stored value
 * - A function to remove the stored value
 *
 * @example
 * ```tsx
 * const [count, setCount, removeCount] = useStoredState({
 *   key: 'counter',
 *   value: 0,
 *   type: 'local'
 * });
 *
 * // Update the value
 * setCount(5);
 *
 * // Remove the value from storage
 * removeCount();
 * ```
 *
 * @example
 * ```tsx
 * const [user, setUser, removeUser] = useStoredState({
 *   key: 'user',
 *   value: { name: '', age: 0 },
 *   type: 'session'
 * });
 *
 * // Update the user object
 * setUser({ name: 'John', age: 30 });
 * ```
 */

export const useStoredState = <T>({ key, value, type }: Params<T>) => {
  const storageMap = useMemo(
    () => ({
      local: localStorage,
      session: sessionStorage,
    }),
    []
  );
  const storage = storageMap[type];
  const previousValueRef = useRef<T | null>(null);

  const getStoredValue = (): T => {
    try {
      const item = storage.getItem(key);
      return item ? JSON.parse(item) : value;
    } catch (error) {
      console.error(`Unable to get ${key} from ${type} storage`, error);
      return value;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(getStoredValue);

  const removeStoredValue = () => {
    storage.removeItem(key);
    window.dispatchEvent(new Event(`${key}-changed`));
  };

  // Update state if value changes from other tabs or custom events
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === key) setStoredValue(getStoredValue());
    };
    const handleCustom = () => setStoredValue(getStoredValue());
    window.addEventListener("storage", handleStorage);
    window.addEventListener(`${key}-changed`, handleCustom);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(`${key}-changed`, handleCustom);
    };
  }, [key, type]);

  // Update storage and notify other listeners only if value has changed
  useEffect(() => {
    const hasValueChanged = JSON.stringify(storedValue) !== JSON.stringify(previousValueRef.current);

    if (hasValueChanged)
      try {
        if (storedValue === null || storedValue === undefined) storage.removeItem(key);
        else storage.setItem(key, JSON.stringify(storedValue));

        window.dispatchEvent(new Event(`${key}-changed`));
        previousValueRef.current = storedValue;
      } catch (error) {
        console.error(`Unable to set ${key} to ${type} storage`, error);
      }
  }, [key, storage, storedValue, type]);

  return [storedValue, setStoredValue, removeStoredValue] as const;
};
