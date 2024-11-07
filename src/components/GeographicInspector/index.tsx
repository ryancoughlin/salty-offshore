import { useRef, useEffect } from 'react';
import { MapLayerMouseEvent } from 'react-map-gl';

const GeographicInspector: React.FC<{ map: mapboxgl.Map }> = ({ map }) => {
  const coordinatesRef = useRef<{ lng: number; lat: number }>({ lng: 0, lat: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MapLayerMouseEvent) => {
      const { lng, lat } = event.lngLat;
      coordinatesRef.current = { lng, lat };
      console.log(`Longitude: ${lng}, Latitude: ${lat}`);
    };

    map.on('mousemove', handleMouseMove);

    return () => {
      map.off('mousemove', handleMouseMove);
    };
  }, [map]);

  return null; // No UI component, just logging
};

export default GeographicInspector;  