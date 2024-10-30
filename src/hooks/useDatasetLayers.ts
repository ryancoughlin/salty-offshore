import { useMemo, useState } from "react";
import type { Dataset } from "../types/api";

interface LayerUrls {
  image?: string;
  data?: string;
  contours?: string;
}

export const useDatasetLayers = (
  dataset: Dataset | null,
  selectedDate: string | null
): { layerUrls: LayerUrls | null; error: Error | null } => {
  const [error, setError] = useState<Error | null>(null);

  const layerUrls = useMemo(() => {
    if (!dataset || !selectedDate) return null;
    const dateEntry = dataset.dates.find((d) => d.date === selectedDate);
    if (!dateEntry) {
      setError(new Error(`No data found for date: ${selectedDate}`));
      return null;
    }
    return dateEntry.layers || null;
  }, [dataset, selectedDate]);

  return { layerUrls, error };
};
