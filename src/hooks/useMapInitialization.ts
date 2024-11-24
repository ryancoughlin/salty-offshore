import { useCallback, useState } from "react";
import type { RefObject } from "react";
import type { MapRef } from "react-map-gl";
import type { Map as MapboxMap } from "mapbox-gl";

export const useMapInitialization = (
  mapRef: RefObject<MapRef>,
  setMapRef: (map: MapboxMap) => void
) => {
  const [mapLoaded, setMapLoaded] = useState(false);

  const handleMapLoad = useCallback((event: { target: MapboxMap }) => {
    const map = event.target;
    setMapRef(map);
    setMapLoaded(true);
  }, [setMapRef]);

  return {
    mapLoaded,
    handleMapLoad
  };
};