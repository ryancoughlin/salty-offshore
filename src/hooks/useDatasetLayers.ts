import { useState, useEffect } from "react";
import type { Dataset } from "../types/api";
import type { FeatureCollection } from "geojson";
import type { ISODateString } from "../types/date";

interface LayerData {
  data?: FeatureCollection;
  contours?: FeatureCollection;
  image?: string;
}

export const useDatasetLayers = (
  dataset: Dataset | null,
  selectedDate: ISODateString | null
) => {
  console.log("useDatasetLayers INIT:", { dataset, selectedDate });

  const [layerData, setLayerData] = useState<LayerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  console.log("useDatasetLayers initial state:", { layerData, loading, error });

  useEffect(() => {
    console.log("useDatasetLayers effect START:", {
      datasetId: dataset?.id,
      selectedDate,
      datesCount: dataset?.dates?.length,
    });

    if (!dataset) {
      console.log("No dataset provided");
      return;
    }

    if (!selectedDate) {
      console.log("No selectedDate provided");
      return;
    }

    if (!Array.isArray(dataset.dates)) {
      console.log("Dataset dates is not an array:", dataset.dates);
      return;
    }

    const dateEntry = dataset.dates.find((d) => d.date === selectedDate);
    console.log("Found dateEntry:", dateEntry);

    if (!dateEntry) {
      console.log("No matching date entry found");
      return;
    }

    console.log("Available layers:", dateEntry.layers);

    const fetchData = async () => {
      console.log("fetchData START");
      setLoading(true);

      try {
        const results: LayerData = {};

        if (dateEntry.layers.data) {
          console.log("Fetching data layer:", dateEntry.layers.data);
          const dataResponse = await fetch(dateEntry.layers.data);
          results.data = await dataResponse.json();
        }

        if (dateEntry.layers.contours) {
          console.log("Fetching contours layer:", dateEntry.layers.contours);
          const contoursResponse = await fetch(dateEntry.layers.contours);
          results.contours = await contoursResponse.json();
        }

        if (dateEntry.layers.image) {
          console.log("Setting image layer:", dateEntry.layers.image);
          results.image = dateEntry.layers.image;
        }

        console.log("Setting layerData:", results);
        setLayerData(results);
      } catch (err) {
        console.error("Error in fetchData:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to fetch layer data")
        );
      } finally {
        console.log("fetchData END");
        setLoading(false);
      }
    };

    fetchData();
  }, [dataset, selectedDate]);

  console.log("useDatasetLayers returning:", { layerData, loading, error });

  return { layerData, loading, error };
};
