import { useState, useEffect } from 'react';
import type { Dataset } from '../../types/api';
import type { Coordinate } from '../../types/core';

interface WaterTemperatureDisplayProps {
    dataset: Dataset;
    cursorPosition: Coordinate;
    mapRef: mapboxgl.Map | null;
}

export const WaterTemperatureDisplay: React.FC<WaterTemperatureDisplayProps> = ({
    dataset,
    cursorPosition,
    mapRef
}) => {
    const [temperature, setTemperature] = useState<number | null>(null);

    useEffect(() => {
        if (!mapRef || !cursorPosition) return;

        const layerId = `${dataset.id}-data`;

        // Check if the layer exists before querying
        if (!mapRef.getLayer(layerId)) {
            setTemperature(null);
            return;
        }

        const point = mapRef.project([cursorPosition.longitude, cursorPosition.latitude]);

        // Increase search radius to find nearby points
        const searchRadius = 20;
        try {
            const features = mapRef.queryRenderedFeatures(
                [
                    [point.x - searchRadius, point.y - searchRadius],
                    [point.x + searchRadius, point.y + searchRadius]
                ],
                {
                    layers: [layerId]
                }
            );

            if (features.length) {
                // Find the nearest points and interpolate
                const nearestPoints = features
                    .map(feature => {
                        const coords = mapRef.project([
                            feature.geometry.coordinates[0],
                            feature.geometry.coordinates[1]
                        ]);
                        const distance = Math.sqrt(
                            Math.pow(point.x - coords.x, 2) +
                            Math.pow(point.y - coords.y, 2)
                        );
                        return {
                            distance,
                            temp: feature.properties?.temperature ||
                                feature.properties?.temp ||
                                feature.properties?.value
                        };
                    })
                    .filter(point => typeof point.temp === 'number')
                    .sort((a, b) => a.distance - b.distance);

                if (nearestPoints.length > 0) {
                    // Use inverse distance weighting for interpolation
                    const totalWeight = nearestPoints.reduce((sum, p) =>
                        sum + (1 / Math.max(p.distance, 0.1)), 0);

                    const interpolatedTemp = nearestPoints.reduce((sum, p) =>
                        sum + (p.temp * (1 / Math.max(p.distance, 0.1))), 0) / totalWeight;

                    setTemperature(interpolatedTemp);
                    return;
                }
            }
            setTemperature(null);
        } catch (error) {
            console.warn('Error querying map features:', error);
            setTemperature(null);
        }
    }, [mapRef, dataset, cursorPosition]);

    return (
        <div className="flex flex-col justify-center items-start gap-1 w-20">
            <span className="opacity-50 text-xs font-medium font-mono uppercase text-white">
                Water temp
            </span>
            <span className="text-base font-semibold text-white">
                {temperature !== null ? `${temperature.toFixed(2)}°F` : '--'}
            </span>
        </div>
    );
}; 