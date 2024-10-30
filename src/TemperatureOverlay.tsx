import { useState, useEffect } from 'react';
import { useMap } from 'react-map-gl';
import type { Dataset } from './types/api';

interface TemperatureOverlayProps {
    dataUrl: string;
    dataset: Dataset;
}

export const TemperatureOverlay: React.FC<TemperatureOverlayProps> = ({
    dataUrl,
    dataset
}) => {
    const { current: map } = useMap();
    const [temperature, setTemperature] = useState<number | null>(null);
    const [position, setPosition] = useState<[number, number] | null>(null);

    useEffect(() => {
        if (!map) return;

        const handleMouseMove = (e: mapboxgl.MapMouseEvent) => {
            setPosition([e.lngLat.lng, e.lngLat.lat]);
            // You'll need to implement the logic to get temperature
            // from your data.json based on coordinates
        };

        map.on('mousemove', handleMouseMove);
        return () => {
            map.off('mousemove', handleMouseMove);
        };
    }, [map]);

    if (!position || temperature === null) return null;

    return (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
            <div className="text-sm">
                <span className="font-medium">{temperature.toFixed(1)}°F</span>
                <div className="text-xs text-gray-500">
                    {position[0].toFixed(4)}, {position[1].toFixed(4)}
                </div>
            </div>
        </div>
    );
}; 