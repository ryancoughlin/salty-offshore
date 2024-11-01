import { useState, useEffect, useCallback } from 'react';
import { TemperatureOverlay } from '../../TemperatureOverlay';
import { formatCoordinates } from '../../utils/formatCoordinates';
import type { Coordinate } from '../../types/core';

interface GeographicInspectorProps {
    mapRef: mapboxgl.Map | null;
    datasets: Dataset[];
    visibleLayers: Set<string>;
}

export const GeographicInspector: React.FC<GeographicInspectorProps> = ({
    mapRef,
    datasets,
    visibleLayers
}) => {
    const [cursorPosition, setCursorPosition] = useState<Coordinate | null>(null);
    const [format, setFormat] = useState<'DD' | 'DMS' | 'DMM'>('DMS');

    useEffect(() => {
        if (!mapRef) return;

        const handleMouseMove = (e: mapboxgl.MapMouseEvent) => {
            setCursorPosition([e.lngLat.lng, e.lngLat.lat]);
        };

        const handleMouseLeave = () => {
            setCursorPosition(null);
        };

        mapRef.on('mousemove', handleMouseMove);
        mapRef.on('mouseleave', handleMouseLeave);

        return () => {
            mapRef.off('mousemove', handleMouseMove);
            mapRef.off('mouseleave', handleMouseLeave);
        };
    }, [mapRef]);

    return (
        <div className="absolute bottom-4 left-4 flex flex-col gap-2">
            {/* Coordinate Display */}
            <div
                className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 z-10 cursor-pointer"
                onClick={() => setFormat(f => f === 'DD' ? 'DMS' : f === 'DMS' ? 'DMM' : 'DD')}
                role="button"
                tabIndex={0}
                aria-label="Toggle coordinate format"
            >
                <div className="text-xs text-gray-500 flex justify-between items-center">
                    <span>Coordinates</span>
                    <span className="text-gray-400">{format}</span>
                </div>
                <div className="text-sm font-medium text-gray-900">
                    {cursorPosition
                        ? formatCoordinates(cursorPosition, format)
                        : 'Move mouse over map'
                    }
                </div>
            </div>

            {/* Temperature Overlays */}
            {cursorPosition && datasets
                .filter(d => d.category === 'sst')
                .map(dataset => (
                    <TemperatureOverlay
                        key={dataset.id}
                        dataset={dataset}
                        cursorPosition={cursorPosition}
                        mapRef={mapRef}
                        visibleLayers={visibleLayers}
                    />
                ))}
        </div>
    );
};  