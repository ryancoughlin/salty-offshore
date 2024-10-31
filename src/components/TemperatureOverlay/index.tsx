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

        // Query the GeoJSON layer at cursor position with a small buffer
        const features = mapRef.queryRenderedFeatures(
            [
                [point.x - 2, point.y - 2], // Add small buffer for easier querying
                [point.x + 2, point.y + 2]
            ],
            {
                layers: [`${dataset.id}-data`] // Query only our SST data layer
            }
        );

        // Debug logging
        console.log('Temperature query:', {
            point,
            layerId: `${dataset.id}-data`,
            featuresFound: features.length,
            firstFeature: features[0]?.properties
        });

        // No data at this point
        if (!features.length || !features[0].properties?.value) {
            setTemperature(null);
            return;
        }

        // Calculate temperature using dataset scale and offset
        const rawValue = features[0].properties.value;
        const tempValue = (rawValue * (dataset.scale || 1)) + (dataset.offset || 0);

        setTemperature(tempValue);
    }, [mapRef, dataset, cursorPosition]);

    // Only render if we have temperature data
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