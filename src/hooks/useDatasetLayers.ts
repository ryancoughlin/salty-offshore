import { useState, useEffect } from "react";
import type { Dataset } from "../types/api";
import type { FeatureCollection } from "geojson";

interface LayerData {
  data?: FeatureCollection;
  contours?: FeatureCollection;
  image?: string;
}

export const useDatasetLayers = (dataset: Dataset, selectedDate: string) => {
  const [layerData, setLayerData] = useState<LayerData | null>(null);

  useEffect(() => {
    const dateEntry = dataset.dates.find((d) => d.date === selectedDate);
    if (!dateEntry) {
      setLayerData(null);
      return;
    }

    const fetchData = async () => {
      try {
        const [dataResponse, contoursResponse] = await Promise.all([
          dateEntry.layers.data ? fetch(dateEntry.layers.data) : null,
          dateEntry.layers.contours ? fetch(dateEntry.layers.contours) : null,
        ]);

        const data = dataResponse ? await dataResponse.json() : undefined;
        const contours = contoursResponse
          ? await contoursResponse.json()
          : undefined;

        setLayerData({
          data,
          contours,
          image: dateEntry.layers.image,
        });
      } catch (error) {
        console.error("Error fetching layer data:", error);
        setLayerData(null);
      }
    };

    fetchData();
  }, [dataset, selectedDate]);

  return { layerData };
};
