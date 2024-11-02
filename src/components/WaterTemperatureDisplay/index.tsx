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

        // Convert cursor position to LngLat format that Mapbox expects
        const point = mapRef.project([cursorPosition.longitude, cursorPosition.latitude]);

        // Query all supported layer types
        const layerIds = dataset.supportedLayers.map(layer => `${dataset.id}-${layer}`);

        // Try each layer type
        for (const layerId of layerIds) {
            const features = mapRef.queryRenderedFeatures(
                [
                    [point.x - 2, point.y - 2],
                    [point.x + 2, point.y + 2]
                ],
                { layers: [layerId] }
            );

            if (features.length && features[0].properties) {
                const temperature = features[0].properties.temperature ||
                    features[0].properties.temp ||
                    features[0].properties.value;

                if (typeof temperature === 'number') {
                    setTemperature(temperature);
                    return;
                }
            }
        }
        setTemperature(null);
    }, [mapRef, dataset, cursorPosition]);

    return (
        <div className="flex flex-col justify-center items-start gap-1 w-20">
            <span className="opacity-50 text-xs font-medium font-mono uppercase text-white">
                Water temp
            </span>
            <span className="text-base font-semibold text-white">
                {temperature !== null ? `${temperature}°F` : 'N/A'}
            </span>
        </div>
    );
}; 