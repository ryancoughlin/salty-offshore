import { useRef, useEffect } from 'react';
import { MapLayerMouseEvent } from 'react-map-gl';

interface GeographicInspectorProps {
  map?: mapboxgl.Map | null;
}

const GeographicInspector: React.FC<GeographicInspectorProps> = ({ map }) => {
  const coordinatesRef = useRef<{ lng: number; lat: number }>({ lng: 0, lat: 0 });

  useEffect(() => {
    if (!map) return;

    const handleMouseMove = (event: MapLayerMouseEvent) => {
      const { lng, lat } = event.lngLat;
      coordinatesRef.current = { lng, lat };
    };

    try {
      map.on('mousemove', handleMouseMove);
    } catch (error) {
      console.error('Failed to attach map event listener:', error);
    }

    return () => {
      if (map && map.off) {
        try {
          map.off('mousemove', handleMouseMove);
        } catch (error) {
          console.error('Failed to remove map event listener:', error);
        }
      }
    };
  }, [map]);

  return null;
};

export default GeographicInspector;
  