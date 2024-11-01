import { useState, useEffect, useCallback, useRef } from 'react';
import type { Dataset } from './types/api';
import type { Coordinate } from './types/core';
import { FloatingTooltip } from './components/FloatingTooltip';

interface TemperatureOverlayProps {
    dataset: Dataset;
    cursorPosition: Coordinate;
    mapRef: mapboxgl.Map | null;
    visibleDatasets: Set<string>;
    color?: string;
}

export const TemperatureOverlay: React.FC<TemperatureOverlayProps> = ({
    dataset,
    cursorPosition,
    mapRef,
    visibleDatasets,
    color
}) => {
    const [temperature, setTemperature] = useState<number | null>(null);
    const lastQueryTime = useRef<number>(0);
    const lastValidData = useRef<{ temp: number; position: Coordinate } | null>(null);

    // Core temperature calculation
    const queryTemperature = useCallback((map: mapboxgl.Map, point: mapboxgl.Point) => {
        const now = Date.now();
        if (now - lastQueryTime.current < 32) return; // ~30fps throttle
        lastQueryTime.current = now;

        const features = map.queryRenderedFeatures(
            [[point.x - 15, point.y - 15], [point.x + 15, point.y + 15]],
            { layers: [`${dataset.id}-data`] }
        );

        const value = features[0]?.properties?.value;

        if (typeof value === 'number') {
            const temp = (value * (dataset.scale || 1)) + (dataset.offset || 0);
            lastValidData.current = { temp, position: cursorPosition };
            setTemperature(temp);
        } else if (lastValidData.current) {
            // Keep showing temperature if within range
            const distance = Math.hypot(
                cursorPosition.lng - lastValidData.current.position.lng,
                cursorPosition.lat - lastValidData.current.position.lat
            );

            setTemperature(distance < 0.01 ? lastValidData.current.temp : null);
        }
    }, [dataset.id, dataset.scale, dataset.offset, cursorPosition]);

    useEffect(() => {
        if (!mapRef || !cursorPosition || !visibleDatasets.has(dataset.id)) {
            setTemperature(null);
            return;
        }

        const point = mapRef.project(cursorPosition);
        queryTemperature(mapRef, point);
    }, [mapRef, dataset.id, cursorPosition, visibleDatasets, queryTemperature]);

    if (!temperature) return null;

    return (
        <FloatingTooltip
            dataset={dataset}
            temperature={temperature}
            color={color}
        />
    );
}; 