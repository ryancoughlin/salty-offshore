import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useMapStore from "../store/useMapStore";
import { useRegions } from "./useRegions";
import { useRegionDatasets } from "./useRegionDatasets";

export const useUrlSync = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { regions } = useRegions();
  const { getRegionData } = useRegionDatasets();
  const mapStore = useMapStore();

  // Sync URL to state
  useEffect(() => {
    if (!regions.length) return;

    const syncFromUrl = async () => {
      const region = regions.find(r => r.id === params.regionId);
      if (!region) return;

      mapStore.selectRegion(region);
      const regionData = getRegionData(region.id);
      if (!regionData) return;

      if (params.datasetId) {
        const dataset = regionData.datasets.find(d => d.id === params.datasetId);
        dataset && mapStore.selectDataset(dataset);
        params.date && mapStore.selectDate(params.date);
      } else {
        mapStore.selectDefaultDataset(regionData);
      }
    };

    syncFromUrl();
  }, [regions, params]);

  // Sync state to URL
  useEffect(() => {
    const { selectedRegion, selectedDataset, selectedDate } = mapStore;
    const parts = [selectedRegion?.id, selectedDataset?.id, selectedDate].filter(Boolean);
    navigate(`/${parts.join("/")}`, { replace: true });
  }, [mapStore.selectedRegion?.id, mapStore.selectedDataset?.id, mapStore.selectedDate]);
};
