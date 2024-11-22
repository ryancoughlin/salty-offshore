import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Point } from 'mapbox-gl';
import type { Coordinate } from '../types/core';
import { DATASET_CONFIGS } from '../types/datasets';

interface DataPoint {
  distance: number;
  value: number;
}

const SEARCH_RADIUS = 10;

export const useDatasetCalculation = (
  datasetKey: string,
  cursorPosition: Coordinate | null,
  mapRef: mapboxgl.Map | null
) => {
  const [value, setValue] = useState<number | null>(null);
  const config = DATASET_CONFIGS[datasetKey];
  
  const layerId = useMemo(() => 'data-layer', []);

  const calculateValue = useCallback(
    (point: Point, features: mapboxgl.MapboxGeoJSONFeature[], map: mapboxgl.Map) => {
      const nearestPoints = features
        .map(feature => {
          let value: number | null = null;
          
          // Try each possible property key until we find a valid value
          for (const key of config.propertyKeys) {
            const propValue = feature.properties?.[key];
            if (typeof propValue === 'number' && isFinite(propValue)) {
              value = propValue;
              break;
            }
          }
          
          if (value === null) return null;
          
          const featurePoint = map.project(feature.geometry.coordinates);
          return {
            distance: Math.sqrt(
              Math.pow(point.x - featurePoint.x, 2) + 
              Math.pow(point.y - featurePoint.y, 2)
            ),
            value,
          };
        })
        .filter((point): point is DataPoint => 
          point !== null && isFinite(point.value)
        )
        .sort((a, b) => a.distance - b.distance);

      if (nearestPoints.length === 0) return null;
      if (nearestPoints.length === 1) return nearestPoints[0].value;

      const weights = nearestPoints.map(p => 1 / Math.max(p.distance, 0.1));
      const totalWeight = weights.reduce((sum, w) => sum + w, 0);
      const interpolated = nearestPoints.reduce(
        (sum, p, i) => sum + p.value * weights[i], 
        0
      ) / totalWeight;

      return isFinite(interpolated) ? interpolated : null;
    },
    [config.propertyKeys]
  );

  useEffect(() => {
    if (!mapRef || !cursorPosition || !layerId) {
      setValue(null);
      return;
    }

    try {
      if (!mapRef.getLayer(layerId)) {
        setValue(null);
        return;
      }

      const point = mapRef.project([
        cursorPosition.longitude,
        cursorPosition.latitude,
      ]);

      const features = mapRef.queryRenderedFeatures(
        [
          [point.x - SEARCH_RADIUS, point.y - SEARCH_RADIUS],
          [point.x + SEARCH_RADIUS, point.y + SEARCH_RADIUS],
        ],
        { layers: [layerId] }
      );

      const calculatedValue = calculateValue(point, features, mapRef);
      setValue(calculatedValue);
    } catch (error) {
      console.error(`Error calculating ${config.displayName}:`, error);
      setValue(null);
    }
  }, [mapRef, layerId, cursorPosition, calculateValue, config.displayName]);

  return value;
}; 