import { useState, useEffect, useCallback, useMemo } from "react";
import type { APIResponse, Region, Dataset } from "../types/api";

export const useRegionDatasets = () => {
  const [data, setData] = useState<APIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Memoize the fetch function to prevent recreation on each render
  const fetchRegionDatasets = useCallback(async () => {
    try {
      const response = await fetch("http://157.245.10.94/metadata.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json();
      return jsonData;
    } catch (err) {
      throw err instanceof Error ? err : new Error("Failed to fetch region datasets");
    }
  }, []);

  // Handle data fetching
  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      setLoading(true);
      try {
        const jsonData = await fetchRegionDatasets();
        if (!ignore) {
          setData(jsonData);
          setError(null);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err : new Error("Failed to fetch region datasets"));
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
  }, [fetchRegionDatasets]);

  // Memoize getRegionData to prevent recreation unless data changes
  const getRegionData = useCallback((regionId: string): Region | null => {
    if (!data?.regions) return null;
    
    const regionData = data.regions.find((r) => r.id === regionId);
    if (!regionData) return null;

    return {
      ...regionData,
      datasets: regionData.datasets.map((dataset) => ({
        ...dataset,
        regionId,
      })),
    };
  }, [data]);

  // Memoize the return value to prevent unnecessary rerenders
  return useMemo(() => ({
    regionDatasets: data,
    getRegionData,
    loading,
    error,
  }), [data, getRegionData, loading, error]);
};
