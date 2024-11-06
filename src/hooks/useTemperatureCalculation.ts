import { useState, useEffect, useMemo, useCallback } from "react";
import type { Point } from "mapbox-gl";
import type { Dataset } from "../types/api";
import type { Coordinate } from "../types/core";

interface TemperaturePoint {
  distance: number;
  temp: number;
}

const SEARCH_RADIUS = 10;
const MIN_VALID_TEMP = -273.15;

const isValidTemperature = (value: number): boolean => {
  return !isNaN(value) && isFinite(value) && value > MIN_VALID_TEMP;
};

const calculateDistance = (point1: Point, point2: Point): number => {
  const dx = point1.x - point2.x;
  const dy = point1.y - point2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const useTemperatureCalculation = (
  dataset: Dataset,
  cursorPosition: Coordinate | null,
  mapRef: mapboxgl.Map | null
) => {
  const [temperature, setTemperature] = useState<number | null>(null);

  const layerId = useMemo(() => `${dataset.id}-data`, [dataset.id]);

  const calculateTemperature = useCallback(
    (
      point: Point,
      features: mapboxgl.MapboxGeoJSONFeature[],
      map: mapboxgl.Map
    ): number | null => {
      const nearestPoints = features
        .map((feature) => {
          const temp =
            feature.properties?.temperature ??
            feature.properties?.temp ??
            feature.properties?.value;

          if (typeof temp !== "number" || !isValidTemperature(temp))
            return null;

          const featurePoint = map.project([
            feature.geometry.coordinates[0],
            feature.geometry.coordinates[1],
          ]);

          return {
            distance: calculateDistance(point, featurePoint),
            temp,
          };
        })
        .filter(
          (point): point is TemperaturePoint =>
            point !== null && isValidTemperature(point.temp)
        )
        .sort((a, b) => a.distance - b.distance);

      if (nearestPoints.length === 0) return null;
      if (nearestPoints.length === 1) return nearestPoints[0].temp;

      const weights = nearestPoints.map((p) => 1 / Math.max(p.distance, 0.1));
      const totalWeight = weights.reduce((sum, w) => sum + w, 0);

      const interpolated =
        nearestPoints.reduce((sum, p, i) => sum + p.temp * weights[i], 0) /
        totalWeight;

      return isValidTemperature(interpolated) ? interpolated : null;
    },
    []
  );

  useEffect(() => {
    if (!mapRef || !cursorPosition || !layerId) {
      setTemperature(null);
      return;
    }

    try {
      if (!mapRef.getLayer(layerId)) {
        setTemperature(null);
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

      const calculatedTemp = calculateTemperature(point, features, mapRef);
      setTemperature(calculatedTemp);
    } catch (error) {
      console.error("Error calculating temperature:", error);
      setTemperature(null);
    }
  }, [mapRef, layerId, cursorPosition, calculateTemperature]);

  return temperature;
};
