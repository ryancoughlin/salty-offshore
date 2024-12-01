import { useCallback, useState, useEffect } from "react";
import type { RefObject } from "react";
import type { MapRef } from "react-map-gl";
import { MAP_CONSTANTS } from '../constants/map';
import { useMapStore } from '../store/useMapStore';

export const useMapInitialization = (
  mapRef: RefObject<MapRef>,
  setMapRef: (ref: MapRef | null) => void
) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const { selectedRegion, initializeFromPreferences } = useMapStore();

  const handleMapLoad = useCallback(() => {
    if (!mapRef.current) return;
    setMapRef(mapRef.current);
    setMapLoaded(true);

    // Load preferences or default view
    if (!initializeFromPreferences()) {
      mapRef.current.flyTo(MAP_CONSTANTS.DEFAULT_VIEW);
    }
  }, [mapRef, setMapRef, initializeFromPreferences]);

  // Fit to region bounds when region changes
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !selectedRegion?.bounds) return;
    mapRef.current.fitBounds(selectedRegion.bounds, MAP_CONSTANTS.REGION_FIT);
  }, [mapLoaded, selectedRegion, mapRef]);

  return { mapLoaded, handleMapLoad };
};