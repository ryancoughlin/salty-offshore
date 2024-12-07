import React, { useEffect, useRef } from 'react';
import { Marker } from 'react-map-gl';
import startFlag from '../../../assets/start_flag.png';
import endFlag from '../../../assets/end_flag.png';
import pointMarker from '../../../assets/point_marker.png';
import { useMapToolsStore } from '../../../store/mapToolsStore';

type MarkerType = 'start' | 'end' | 'point';

const MARKER_CONFIGS = {
  start: {
    icon: startFlag,
    size: 32,
    offset: [8, -8],
  },
  end: {
    icon: endFlag,
    size: 32,
    offset: [8, -8],
  },
  point: {
    icon: pointMarker,
    size: 16,
    offset: [0, 0],
  }
} as const;

interface CustomMarkerProps {
  coordinates: [number, number];
  type: MarkerType;
  isDraggable?: boolean;
  onDragStart?: () => void;
  onDrag?: (coordinates: [number, number]) => void;
  onDragEnd?: () => void;
}

export const CustomMarker: React.FC<CustomMarkerProps> = ({
  coordinates,
  type,
  isDraggable = false,
  onDragStart,
  onDrag,
  onDragEnd,
}) => {
  const markerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef<boolean>(false);
  const config = MARKER_CONFIGS[type];
  const { completePath, toggleTool } = useMapToolsStore();

  useEffect(() => {
    if (!markerRef.current || hasAnimated.current || !['start', 'end'].includes(type)) return;

    markerRef.current.style.transform = 'scale(0.1) translateY(100%)';
    requestAnimationFrame(() => {
      if (markerRef.current) {
        markerRef.current.style.transition = 'transform 0.3s ease-out';
        markerRef.current.style.transform = 'scale(1) translateY(0)';
        hasAnimated.current = true;
      }
    });
  }, [type]);

  const handleClick = () => {
    completePath();
    toggleTool('distance');
  };

  return (
    <Marker
      longitude={coordinates[0]}
      latitude={coordinates[1]}
      draggable={isDraggable}
      onDragStart={onDragStart}
      onDrag={e => onDrag?.([e.lngLat.lng, e.lngLat.lat])}
      onDragEnd={onDragEnd}
      anchor="center"
      offset={config.offset as [number, number]}
      onClick={handleClick}
    >
      <div
        ref={markerRef}
        className="relative origin-center transition-all duration-150"
        style={{
          width: config.size,
          height: config.size,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${config.icon})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
          }}
        />
      </div>
    </Marker>
  );
}; 