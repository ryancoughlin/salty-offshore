import { useState, useEffect } from "react";

// Generic custom hook for persisted state
function usePersistedState<T>(key: string, defaultValue: T) {
  // Initialize state with persisted data or default value
  const [state, setState] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error("Error loading persisted state:", error);
      return defaultValue;
    }
  });

  // Sync with localStorage whenever state changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error("Error persisting state:", error);
    }
  }, [key, state]);

  return [state, setState] as const;
}

export default usePersistedState;
