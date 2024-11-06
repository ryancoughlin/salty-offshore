import { useEffect } from "react";
import { useRegionDatasets } from "./useRegionDatasets";
import useMapStore from "../store/useMapStore";
import type { Region } from "../types/api";

export const usePrefetchRegionData = (region: Region | null) => {
  const { getRegionData } = useRegionDatasets();
  const { fetchLayerData } = useMapStore();

  useEffect(() => {
    if (!region) return;

    const prefetchData = async () => {
      const regionData = getRegionData(region.id);
      if (!regionData) return;

      regionData.datasets.forEach((dataset) => {
        dataset.dates.forEach((dateEntry) => {
          fetchLayerData(dataset, dateEntry.date);
        });
      });
    };

    prefetchData();
  }, [region, getRegionData, fetchLayerData]);
};
