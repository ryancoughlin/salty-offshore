import { useState, useEffect } from 'react';
import type { Dataset } from './types/api';
import type { Coordinate } from './types/core';

interface TemperatureOverlayProps {
    dataset: Dataset;
    cursorPosition: Coordinate;
    mapRef: mapboxgl.Map | null;
    visibleLayers: Set<string>;
}

export const TemperatureOverlay: React.FC<TemperatureOverlayProps> = ({
    dataset,
    cursorPosition,
    mapRef,
    visibleLayers
}) => {
    const [temperature, setTemperature] = useState<number | null>(null);
    const [isSourceReady, setIsSourceReady] = useState(false);

    useEffect(() => {
        if (!mapRef || !cursorPosition) return;

        // Early return if layer isn't visible or isn't SST
        if (!visibleLayers.has(dataset.id) || dataset.category !== 'sst') {
            setTemperature(null);
            setIsSourceReady(false);
            return;
        }

        const layerId = `${dataset.id}-data`;
        const sourceId = `${dataset.id}-data-source`;

        // Handle source data loading
        const handleSourceData = (e: mapboxgl.MapDataEvent) => {
            if (e.sourceId !== sourceId) return;

            // Only consider source ready when it's fully loaded with content
            if (e.isSourceLoaded && e.sourceDataType === 'content') {
                setIsSourceReady(true);
                queryTemperature();
            }
        };

        // Query temperature at current cursor position
        const queryTemperature = () => {
            const point = mapRef.project(cursorPosition);

            // Increase buffer size significantly for better hit detection
            const buffer = 10; // pixels
            const features = mapRef.queryRenderedFeatures(
                [
                    [point.x - buffer, point.y - buffer],
                    [point.x + buffer, point.y + buffer]
                ],
                { layers: [layerId] }
            );

            // Enhanced debug logging
            console.log('Temperature query:', {
                dataset: dataset.id,
                point,
                bufferSize: buffer,
                featuresFound: features.length,
                queryBox: {
                    topLeft: [point.x - buffer, point.y - buffer],
                    bottomRight: [point.x + buffer, point.y + buffer]
                },
                value: features[0]?.properties?.value,
                scale: dataset.scale,
                offset: dataset.offset
            });

            if (!features.length) {
                console.log('No features found in query area');
                setTemperature(null);
                return;
            }

            const value = features[0].properties?.value;
            if (typeof value !== 'number') {
                console.log('Invalid temperature value:', value);
                setTemperature(null);
                return;
            }

            // Calculate temperature and log the calculation
            const tempValue = (value * (dataset.scale || 1)) + (dataset.offset || 0);
            console.log('Temperature calculation:', {
                rawValue: value,
                scale: dataset.scale || 1,
                offset: dataset.offset || 0,
                finalTemp: tempValue
            });

            setTemperature(tempValue);
        };

        // Add source data event listener
        mapRef.on('sourcedata', handleSourceData);

        // Initial query if source is already loaded
        if (mapRef.isSourceLoaded(sourceId)) {
            setIsSourceReady(true);
            queryTemperature();
        }

        // Cleanup
        return () => {
            mapRef.off('sourcedata', handleSourceData);
        };
    }, [mapRef, dataset, cursorPosition, visibleLayers]);

    // Only show temperature UI when we have both a valid temperature and the source is ready
    console.log('Temperature overlay render:', { isSourceReady, temperature });
    console.log('Checking render conditions:', { isSourceReady, temperature });
    if (!isSourceReady) {
        console.log('Source not ready yet');
        return null;
    }
    if (temperature === null) {
        console.log('No temperature data available');
        return null;
    }

    return (
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3">
            <div className="text-xs text-gray-500">
                {dataset.name || 'Sea Surface Temperature'}
            </div>
            <div className="text-sm font-medium text-gray-900">
                {`${temperature.toFixed(1)}°F`}
            </div>
        </div>
    );
}; 