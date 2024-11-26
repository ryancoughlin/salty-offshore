import { useCallback, useState } from "react";
import type { RefObject } from "react";
import type { MapRef } from "react-map-gl";
import type { Map as MapboxMap } from "mapbox-gl";
import buoyIcon from '../assets/buoy.png';

export const useMapInitialization = (
  mapRef: RefObject<MapRef>,
  setMapRef: (map: MapboxMap) => void
) => {
  const [mapLoaded, setMapLoaded] = useState(false);

  const handleMapLoad = useCallback((event: { target: MapboxMap }) => {
    const map = event.target;
    setMapRef(map);
    setMapLoaded(true);
    
    // Load buoy icon image
    map.loadImage(buoyIcon, (error, image) => {
      if (error) throw error;
      if (image && !map.hasImage('buoy-icon')) {
        map.addImage('buoy-icon', image);
      }
    });
  }, [setMapRef]);

  return {
    mapLoaded,
    handleMapLoad
  };
};