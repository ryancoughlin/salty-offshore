import { useMemo } from "react";
import type { Dataset, DateEntry } from "../types/api";
import type { ISODateString } from "../types/date";

export const useDateFiltering = (dataset: Dataset): ISODateString[] => {
  return useMemo(() => {
    if (!dataset?.dates) {
      return [];
    }

    return dataset.dates
      .filter(
        (entry: DateEntry) => entry.date && Object.keys(entry.layers).length > 0
      )
      .map((entry: DateEntry) => entry.date)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  }, [dataset]);
};
