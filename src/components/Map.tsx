import { useRef, useEffect, Children, cloneElement } from 'react';
import mapboxgl from 'mapbox-gl';
import type { MapProps } from '../types/map.types';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapComponent = ({ children }: MapProps) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);

    useEffect(() => {
        if (!mapContainer.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            center: [-97.125, 21.875], // Centered on your data point
            zoom: 6,
            accessToken: import.meta.env.VITE_MAPBOX_TOKEN
        });

        return () => {
            map.current?.remove();
        };
    }, []);

    return (
        <div ref={mapContainer} style={{ width: '100vw', height: '100vh' }}>
            {map.current && Children.map(children, child =>
                cloneElement(child as React.ReactElement, { map: map.current })
            )}
        </div>
    );
};

export default MapComponent;
