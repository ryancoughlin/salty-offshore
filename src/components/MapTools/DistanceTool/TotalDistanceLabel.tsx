import React from 'react';
import { Marker } from 'react-map-gl';
import * as turf from '@turf/turf';

interface TotalDistanceLabelProps {
  points: [number, number][];
  totalDistance: number;
}

export const TotalDistanceLabel: React.FC<TotalDistanceLabelProps> = ({
  points,
  totalDistance
}) => {
  if (points.length < 2) return null;

  // Calculate the midpoint of the entire line
  const lineString = turf.lineString(points);
  const center = turf.center(lineString);

  return (
    <Marker 
      longitude={center.geometry.coordinates[0]}
      latitude={center.geometry.coordinates[1]}
      offset={[0, 30]} // Position below the line
    >
      <div className="bg-neutral-950 text-white px-2 py-1.5 rounded text-xs font-mono font-medium whitespace-nowrap pointer-events-none shadow-lg transform -translate-x-1/2">
        {totalDistance.toFixed(1)} mi
      </div>
    </Marker>
  );
}; 