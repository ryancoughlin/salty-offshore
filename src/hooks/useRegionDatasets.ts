import { useState, useEffect, useCallback } from "react";
import type { APIResponse, Region } from "../types/api";

export const useRegionDatasets = () => {
  const [data, setData] = useState<APIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRegionDatasets = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://157.245.10.94/metadata.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        setData(jsonData);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to fetch region datasets")
        );
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRegionDatasets();
  }, []);

  const getRegionData = useCallback(
    (regionId: string) => {
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
    },
    [data]
  );

  return {
    regionDatasets: data,
    getRegionData,
    loading,
    error,
  };
};
