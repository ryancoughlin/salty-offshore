import { useState, useEffect } from 'react';
import type { Dataset } from '../../types/api';
import type { Coordinate } from '../../types/core';

interface TemperatureOverlayProps {
    dataset: Dataset;
    cursorPosition: Coordinate;
    mapRef: mapboxgl.Map | null;
}

export const TemperatureOverlay: React.FC<TemperatureOverlayProps> = ({
    dataset,
    cursorPosition,
    mapRef
}) => {
    const [temperature, setTemperature] = useState<number | null>(null);

    useEffect(() => {
        if (!mapRef || !cursorPosition) return;

        // Convert cursor position to pixel coordinates for querying
        const point = mapRef.project(cursorPosition);

        // Query all supported layer types
        const layerIds = dataset.supportedLayers.map(layer => `${dataset.id}-${layer}`);

        console.log('Querying layers:', {
            layerIds,
            cursorPosition,
            point
        });

        // Try each layer type
        for (const layerId of layerIds) {
            const features = mapRef.queryRenderedFeatures(
                [
                    [point.x - 2, point.y - 2],
                    [point.x + 2, point.y + 2]
                ],
                { layers: [layerId] }
            );

            // Debug logging
            console.log('Temperature query:', {
                layerId,
                featuresFound: features.length,
                firstFeature: features[0]?.properties
            });

            if (features.length && features[0].properties) {
                const value = features[0].properties.temperature ||
                    features[0].properties.temp ||
                    features[0].properties.value;

                if (typeof value === 'number') {
                    const tempValue = (value * (dataset.scale || 1)) + (dataset.offset || 0);
                    setTemperature(tempValue);
                    return;
                }
            }
        }

        // No data found in any layer
        setTemperature(null);
    }, [mapRef, dataset, cursorPosition]);

    if (temperature === null) return null;

    return (
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3">
            <div className="text-xs text-gray-500">
                Sea Surface Temperature
            </div>
            <div className="text-sm font-medium text-gray-900">
                {`${temperature.toFixed(1)}°F`}
            </div>
        </div>
    );
}; 