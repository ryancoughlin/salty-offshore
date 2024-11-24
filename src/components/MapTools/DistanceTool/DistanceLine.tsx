import { Layer, Source } from 'react-map-gl';
import * as turf from '@turf/turf';

interface DistanceLineProps {
  points: [number, number][];
  isTemporary?: boolean;
  lineId: string;
}

export const DistanceLine: React.FC<DistanceLineProps> = ({ points, isTemporary, lineId }) => {
  if (points.length < 2) {
    return null;
  }

  const lineString = turf.lineString(points);
  
  return (
    <Source type="geojson" data={lineString}>
      <Layer
        id={`distance-line-shadow-${lineId}`}
        type="line"
        paint={{
          'line-color': '#000000',
          'line-width': 3,
          'line-opacity': 0.1,
          'line-blur': 2,
        }}
      />
      <Layer
        id={`distance-line-${lineId}`}
        type="line"
        paint={{
          'line-color': isTemporary ? '#4299e1' : '#ffffff',
          'line-width': 2,
          'line-dasharray': isTemporary ? [2, 2] : [1],
        }}
      />
    </Source>
  );
}; 