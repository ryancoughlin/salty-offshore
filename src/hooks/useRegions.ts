import { useState, useEffect } from "react";
import type { Regions } from "../types/api";

export const useRegions = () => {
  const [data, setData] = useState<Regions | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRegions = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://157.245.10.94/regions.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        setData(jsonData);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch regions")
        );
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRegions();
  }, []);

  return {
    regions: data?.regions ?? [],
    loading,
    error,
  };
};
