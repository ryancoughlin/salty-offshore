import React, { useState, useCallback } from 'react';
import { MapLayerMouseEvent } from 'react-map-gl';

const SaltyMap: React.FC = () => {
    const [cursor, setCursor] = useState<{ lng: number; lat: number } | null>(null);

    const onMouseMove = useCallback((event: MapLayerMouseEvent) => {
        setCursor({
            lng: event.lngLat.lng,
            lat: event.lngLat.lat
        });
    }, []);

    return (
        // Add to Map component props:
        onMouseMove = { onMouseMove }
    );
};

export default SaltyMap; 