/* eslint-disable no-console */
import { useState, useEffect } from 'react';

// Custom hook to handle session storage in a type-safe manner
export function useSessionStorage<T>(
  key: string,
  initialValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Failed to retrieve from sessionStorage', error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error('Failed to save to sessionStorage', error);
    }
  }, [key, storedValue]);

  // Cleanup session storage on page left
  useEffect(() => {
    const handleCleanSessionStorage = () => {
      sessionStorage.removeItem(key);
    };

    return () => {
      handleCleanSessionStorage();
    };
  }, [key]);

  return [storedValue, setStoredValue];
}
