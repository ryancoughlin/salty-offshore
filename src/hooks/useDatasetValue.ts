import { useState, useEffect, useCallback, useDebugValue } from 'react';
import type { Point } from 'mapbox-gl';
import type { Coordinate } from '../types/core';
import { DatasetValueKey } from '../types/datasets';

const SEARCH_RADIUS = 16;
const MIN_VALID_VALUE = -273.15;

const isValidValue = (value: number): boolean => {
  return !isNaN(value) && isFinite(value) && value > MIN_VALID_VALUE;
};

const calculateDistance = (point1: Point, point2: Point): number => {
  const dx = point1.x - point2.x;
  const dy = point1.y - point2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const useDatasetValue = (
  cursorPosition: Coordinate | null,
  mapRef: mapboxgl.Map | null,
  valueKey: DatasetValueKey
) => {
  const [value, setValue] = useState<number | null>(null);

  useDebugValue(value !== null ? `${value.toFixed(2)}` : 'No value');

  const findNearestPoint = useCallback(
    (point: Point, features: mapboxgl.MapboxGeoJSONFeature[], map: mapboxgl.Map) => {
      if (!features.length) return null;

      let nearestPoint = null;
      let minDistance = Infinity;

      for (const feature of features) {
        const featureValue = feature.properties?.[valueKey];
        if (!isValidValue(featureValue)) continue;

        const coordinates = 'coordinates' in feature.geometry 
          ? feature.geometry.coordinates as [number, number]
          : null;
          
        if (!coordinates) continue;
        
        const featurePoint = map.project(coordinates);
        const distance = calculateDistance(point, featurePoint);

        if (distance < minDistance) {
          minDistance = distance;
          nearestPoint = featureValue;
        }
      }

      return nearestPoint;
    },
    [valueKey]
  );

  useEffect(() => {
    if (!mapRef || !cursorPosition) {
      setValue(null);
      return;
    }

    const layerId = 'data-layer';

    try {
      if (!mapRef.getLayer(layerId)) {
        setValue(null);
        return;
      }

      const point = mapRef.project([
        cursorPosition.longitude,
        cursorPosition.latitude,
      ]);

      // Query features within the search radius
      const features = mapRef.queryRenderedFeatures(
        [
          [point.x - SEARCH_RADIUS, point.y - SEARCH_RADIUS],
          [point.x + SEARCH_RADIUS, point.y + SEARCH_RADIUS],
        ],
        { layers: [layerId] }
      );

      const nearestValue = findNearestPoint(point, features, mapRef);
      setValue(nearestValue);

    } catch (error) {
      console.error('Error finding nearest point:', error);
      setValue(null);
    }
  }, [mapRef, cursorPosition, findNearestPoint]);

  return value;
}; 