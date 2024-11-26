import { useCallback, useRef } from 'react';
import type { MapLayerMouseEvent } from 'react-map-gl';
import type { Coordinate } from '../types/core';

const MIN_DISTANCE_CHANGE = 0.00001; // Minimum change in coordinates to trigger an update
const THROTTLE_MS = 16; // ~60fps

export const useMapCursor = (
  setCursorPosition: (position: Coordinate | null) => void,
  updateMousePosition: (position: [number, number] | null) => void,
  isToolActive: boolean,
  activeTool: 'distance' | null
) => {
  const lastUpdate = useRef<number>(0);
  const lastPosition = useRef<Coordinate | null>(null);

  const hasPositionChanged = (newPos: Coordinate) => {
    if (!lastPosition.current) return true;
    
    const latDiff = Math.abs(newPos.latitude - lastPosition.current.latitude);
    const lngDiff = Math.abs(newPos.longitude - lastPosition.current.longitude);
    
    return latDiff > MIN_DISTANCE_CHANGE || lngDiff > MIN_DISTANCE_CHANGE;
  };

  const handleMouseMove = useCallback((event: MapLayerMouseEvent) => {
    const now = performance.now();
    if (now - lastUpdate.current < THROTTLE_MS) return;

    const newPosition = {
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat
    };

    if (isToolActive && activeTool === 'distance') {
      updateMousePosition([newPosition.longitude, newPosition.latitude]);
    } else if (hasPositionChanged(newPosition)) {
      setCursorPosition(newPosition);
      lastPosition.current = newPosition;
    }

    lastUpdate.current = now;
  }, [isToolActive, activeTool, updateMousePosition, setCursorPosition]);

  return handleMouseMove;
}; 