import { useCallback, useEffect, useRef } from 'react';
import type { MapLayerMouseEvent } from 'react-map-gl';

export const useRegionHoverState = (map: mapboxgl.Map | null, layerId: string) => {
  const hoveredStateId = useRef<string | null>(null);

  const handleMouseEnter = useCallback((e: MapLayerMouseEvent) => {
    if (!map) return;
    map.getCanvas().style.cursor = 'pointer';
    
    const feature = e.features?.[0];
    if (feature?.id) {
      // Clear previous hover state if exists
      if (hoveredStateId.current !== null) {
        map.setFeatureState(
          { source: 'region-navigation', id: hoveredStateId.current },
          { hover: false }
        );
      }
      
      // Set new hover state
      hoveredStateId.current = feature.id as string;
      map.setFeatureState(
        { source: 'region-navigation', id: hoveredStateId.current },
        { hover: true }
      );
    }
  }, [map]);

  const handleMouseLeave = useCallback((e: MapLayerMouseEvent) => {
    if (!map) return;
    map.getCanvas().style.cursor = '';
    
    if (hoveredStateId.current !== null) {
      map.setFeatureState(
        { source: 'region-navigation', id: hoveredStateId.current },
        { hover: false }
      );
      hoveredStateId.current = null;
    }
  }, [map]);

  useEffect(() => {
    if (!map) return;

    map.on('mouseenter', layerId, handleMouseEnter);
    map.on('mouseleave', layerId, handleMouseLeave);

    return () => {
      if (hoveredStateId.current !== null) {
        map.setFeatureState(
          { source: 'region-navigation', id: hoveredStateId.current },
          { hover: false }
        );
      }
      map.off('mouseenter', layerId, handleMouseEnter);
      map.off('mouseleave', layerId, handleMouseLeave);
    };
  }, [map, layerId, handleMouseEnter, handleMouseLeave]);
}; 