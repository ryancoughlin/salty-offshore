import { useState, useEffect } from "react";
import type { Region } from "../types/api";
import type { LayerType } from "../types/core";

interface LayerDataResult {
  path: string | null;
  loading: boolean;
  error: Error | null;
}

export function useLayerData(
  region: Region,
  datasetId: string,
  layerType: LayerType,
  selectedDate: string | null
): LayerDataResult {
  const [path, setPath] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchLayerData() {
      try {
        const data = await api.getRegionData(region.id);
        const dataset = data[datasetId];

        if (!dataset) {
          throw new Error(`Dataset ${datasetId} not found`);
        }

        const dateEntry = selectedDate
          ? dataset.dates.find((d) => d.date === selectedDate)
          : dataset.dates[0];

        if (!dateEntry) {
          throw new Error("No data available for selected date");
        }

        const layerPath = dateEntry.layers[layerType];
        if (!layerPath) {
          throw new Error(`Layer type ${layerType} not available`);
        }

        setPath(layerPath);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch layer data")
        );
      } finally {
        setLoading(false);
      }
    }

    fetchLayerData();
  }, [region.id, datasetId, layerType, selectedDate]);

  return { path, loading, error };
}
