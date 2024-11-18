import { useState, useEffect, useCallback, useMemo } from "react";
import type { Regions } from "../types/api";

export const useRegions = () => {
  const [data, setData] = useState<Regions | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Memoize the fetch function
  const fetchRegions = useCallback(async () => {
    try {
      const response = await fetch("http://157.245.10.94/regions.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json();
      return jsonData;
    } catch (err) {
      throw err instanceof Error ? err : new Error("Failed to fetch regions");
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      setLoading(true);
      try {
        const jsonData = await fetchRegions();
        if (!ignore) {
          setData(jsonData);
          setError(null);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err : new Error("Failed to fetch regions"));
          setData(null);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, [fetchRegions]);

  // Memoize the return value
  return useMemo(() => ({
    regions: data?.regions ?? [],
    loading,
    error,
  }), [data, loading, error]);
};
