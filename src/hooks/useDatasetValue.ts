import { useState, useEffect, useCallback, useDebugValue } from 'react';
import type { Point } from 'mapbox-gl';
import type { Coordinate } from '../types/core';
import { DatasetValueKey } from '../types/datasets';

interface ValuePoint {
  distance: number;
  value: number;
}

const SEARCH_RADIUS = 32;
const MIN_VALID_VALUE = -273.15;

const isValidValue = (value: number): boolean => {
  return !isNaN(value) && isFinite(value) && value > MIN_VALID_VALUE;
};

const calculateDistance = (point1: Point, point2: Point): number => {
  const dx = point1.x - point2.x;
  const dy = point1.y - point2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const calculateInterpolatedValue = (nearestPoints: ValuePoint[], weights: number[]) => {
  const SIMILARITY_THRESHOLD = 0.5;
  
  const groupedPoints = nearestPoints.reduce((groups, point) => {
    const group = groups.find(g => 
      Math.abs(g.value - point.value) <= SIMILARITY_THRESHOLD
    );
    
    if (group) {
      group.points.push(point);
      group.totalWeight += weights[nearestPoints.indexOf(point)];
    } else {
      groups.push({
        value: point.value,
        points: [point],
        totalWeight: weights[nearestPoints.indexOf(point)]
      });
    }
    return groups;
  }, [] as Array<{value: number; points: ValuePoint[]; totalWeight: number}>);

  const dominantGroup = groupedPoints.reduce((max, group) => 
    group.totalWeight > max.totalWeight ? group : max
  );

  return dominantGroup.value;
};

export const useDatasetValue = (
  cursorPosition: Coordinate | null,
  mapRef: mapboxgl.Map | null,
  valueKey: DatasetValueKey
) => {
  const [value, setValue] = useState<number | null>(null);

  useDebugValue(value !== null ? `${value.toFixed(2)}` : 'No value');

  const calculateValue = useCallback(
    (point: Point, features: mapboxgl.MapboxGeoJSONFeature[], map: mapboxgl.Map) => {
      const nearestPoints = features
        .map(feature => {
          const featureValue = feature.properties?.[valueKey];
          
          if (!isValidValue(featureValue)) return null;
          
          const featurePoint = map.project(feature.geometry.coordinates);
          return {
            distance: calculateDistance(point, featurePoint),
            value: featureValue,
          };
        })
        .filter((point): point is ValuePoint => 
          point !== null && isValidValue(point.value)
        )
        .sort((a, b) => a.distance - b.distance);

      if (nearestPoints.length === 0) return null;
      if (nearestPoints.length === 1) return nearestPoints[0].value;

      const weights = nearestPoints.map(p => 1 / Math.max(p.distance, 0.1));
      const interpolated = calculateInterpolatedValue(nearestPoints, weights);

      return isValidValue(interpolated) ? interpolated : null;
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
      console.error('Error calculating value:', error);
      setValue(null);
    }
  }, [mapRef, cursorPosition, calculateValue]);

  return value;
}; 