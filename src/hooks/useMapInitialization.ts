import { useCallback, useState } from "react";
import type { RefObject } from "react";
import type { MapRef } from "react-map-gl";

export const useMapInitialization = (
  mapRef: RefObject<MapRef>,
  setMapRef: (map: mapboxgl.Map | null) => void
) => {
  const [isStyleLoaded, setIsStyleLoaded] = useState(false);

  const handleMapLoad = useCallback(() => {
    setIsStyleLoaded(true);
    if (mapRef.current) {
      setMapRef(mapRef.current.getMap());
    }
  }, [mapRef, setMapRef]);

  return { isStyleLoaded, handleMapLoad };
};