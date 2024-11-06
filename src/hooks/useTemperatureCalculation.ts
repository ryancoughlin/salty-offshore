import { useState, useEffect } from "react";
import type { Point } from "mapbox-gl";
import type { Dataset } from "../types/api";
import type { Coordinate } from "../types/core";

interface TemperaturePoint {
  distance: number;
  temp: number;
}

const isValidTemperature = (value: number): boolean => {
  return !isNaN(value) && isFinite(value) && value > -273.15; // Basic physics check
};

const calculateDistance = (point1: Point, point2: Point): number => {
  return Math.sqrt(
    Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
  );
};

const getTemperatureFromFeature = (
  feature: mapboxgl.MapboxGeoJSONFeature
): number | null => {
  const temp =
    feature.properties?.temperature ??
    feature.properties?.temp ??
    feature.properties?.value;

  return typeof temp === "number" && isValidTemperature(temp) ? temp : null;
};

const interpolateTemperature = (points: TemperaturePoint[]): number | null => {
  if (points.length === 0) return null;

  // If we have only one point, return it directly
  if (points.length === 1) return points[0].temp;

  const totalWeight = points.reduce(
    (sum, p) => sum + 1 / Math.max(p.distance, 0.1),
    0
  );

  const interpolated =
    points.reduce(
      (sum, p) => sum + p.temp * (1 / Math.max(p.distance, 0.1)),
      0
    ) / totalWeight;

  return isValidTemperature(interpolated) ? interpolated : null;
};

export const useTemperatureCalculation = (
  dataset: Dataset,
  cursorPosition: Coordinate | null,
  mapRef: mapboxgl.Map | null
) => {
  const [temperature, setTemperature] = useState<number | null>(null);

  useEffect(() => {
    if (!mapRef || !cursorPosition) {
      setTemperature(null);
      return;
    }

    const layerId = `${dataset.id}-data`;
    if (!mapRef.getLayer(layerId)) {
      setTemperature(null);
      return;
    }

    try {
      const point = mapRef.project([
        cursorPosition.longitude,
        cursorPosition.latitude,
      ]);
      const searchRadius = 20;
      const features = mapRef.queryRenderedFeatures(
        [
          [point.x - searchRadius, point.y - searchRadius],
          [point.x + searchRadius, point.y + searchRadius],
        ],
        { layers: [layerId] }
      );

      if (!features.length) {
        setTemperature(null);
        return;
      }

      const nearestPoints = features
        .map((feature) => {
          const temp = getTemperatureFromFeature(feature);
          if (temp === null) return null;

          return {
            distance: calculateDistance(
              point,
              mapRef.project([
                feature.geometry.coordinates[0],
                feature.geometry.coordinates[1],
              ])
            ),
            temp,
          };
        })
        .filter(
          (point): point is TemperaturePoint =>
            point !== null && isValidTemperature(point.temp)
        )
        .sort((a, b) => a.distance - b.distance);

      const calculatedTemp = interpolateTemperature(nearestPoints);
      setTemperature(calculatedTemp);
    } catch (error) {
      console.error("Error calculating temperature:", error);
      setTemperature(null);
    }
  }, [mapRef, dataset.id, cursorPosition]);

  return temperature;
};
