import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapProps {
    selectedRegion: Region | null;
}

const Map: React.FC<MapProps> = ({ selectedRegion }) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);

    useEffect(() => {
        if (!mapContainer.current) return;
        
        // Initialize the map
        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';
        
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/satellite-v9',
            center: [-70, 40], // North Atlantic
            zoom: 5
        });

        // Cleanup on unmount
        return () => {
            map.current?.remove();
        };
    }, []);

    return (
        <div ref={mapContainer} className="w-full h-full" />
    );
};

export default Map;
