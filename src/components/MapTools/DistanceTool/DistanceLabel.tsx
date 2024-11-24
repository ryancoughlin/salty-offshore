import React from 'react';
import { Marker } from 'react-map-gl';

interface DistanceLabelProps {
  end: [number, number];
  distance: number;
}

export const DistanceLabel: React.FC<DistanceLabelProps> = ({
  end,
  distance
}) => {
  return (
    <Marker 
      longitude={end[0]} 
      latitude={end[1]}
      offset={[0, 20]} // Position below the point
    >
      <div className="bg-black/75 text-white px-2 py-1 rounded text-sm whitespace-nowrap pointer-events-none transform -translate-x-1/2 shadow-lg">
        {distance.toFixed(1)} mi
      </div>
    </Marker>
  );
}; 