import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useMapStore from "../store/useMapStore";
import { useRegions } from "./useRegions";
import { useRegionDatasets } from "./useRegionDatasets";

export const useUrlSync = () => {
  const navigate = useNavigate();
  const { regionId, datasetId, date } = useParams();
  const { regions } = useRegions();
  const { getRegionData } = useRegionDatasets();
  const {
    selectedRegion,
    selectedDataset,
    selectedDate,
    selectRegion,
    selectDataset,
    selectDate,
    selectDefaultDataset,
  } = useMapStore();

  // Sync URL to state
  useEffect(() => {
    if (!regions.length) return;

    if (regionId) {
      const region = regions.find((r) => r.id === regionId);
      if (!region) return;

      selectRegion(region);
      const regionData = getRegionData(region.id);
      if (!regionData) return;

      if (datasetId) {
        const dataset = regionData.datasets.find((d) => d.id === datasetId);
        if (dataset) {
          selectDataset(dataset);
          date && selectDate(date);
        }
      } else {
        selectDefaultDataset(regionData);
      }
    }
  }, [regions, regionId, datasetId, date]);

  // Sync state to URL
  useEffect(() => {
    const parts = [
      selectedRegion?.id,
      selectedDataset?.id,
      selectedDate,
    ].filter(Boolean);

    const newUrl = `/${parts.join("/")}`;
    navigate(newUrl, { replace: true });
  }, [selectedRegion?.id, selectedDataset?.id, selectedDate]);
};
