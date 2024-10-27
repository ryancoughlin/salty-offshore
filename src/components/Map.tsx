import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { DataLayer } from '../types';

interface MapProps {
  layers: DataLayer[];
}

const Map: React.FC<MapProps> = ({ layers }) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);

    useEffect(() => {
        if (!mapContainer.current) return;

        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/satellite-v9',
            center: [-70, 40], // Default to North Atlantic
            zoom: 5
        });

        return () => {
            map.current?.remove();
        };
    }, []);

    // Effect to handle layer visibility
    useEffect(() => {
        const mapInstance = map.current;
        if (!mapInstance) return;

        layers.forEach(layer => {
            const mapLayer = mapInstance.getLayer(layer.id);
            if (mapLayer) {
                mapInstance.setLayoutProperty(
                    layer.id,
                    'visibility',
                    layer.visible ? 'visible' : 'none'
                );
            }
        });
    }, [layers]);

    return (
        <div ref={mapContainer} className="flex-1" />
    );
};

export default Map;
