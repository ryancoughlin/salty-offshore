import { useState } from 'react';
import { formatCoordinates } from '../../utils/formatCoordinates';
import type { Coordinate } from '../../types/core';

interface GeographicInspectorProps {
  cursorPosition: Coordinate | null;
}

export const GeographicInspector: React.FC<GeographicInspectorProps> = ({
  cursorPosition
}) => {
  const [format, setFormat] = useState<'DD' | 'DMS' | 'DMM'>('DMS');
  
  if (!cursorPosition) {
    return null;
  }

  const formattedCoordinates = formatCoordinates(
    [cursorPosition.longitude, cursorPosition.latitude],
    format
  );

  return (
    <div className="flex-col justify-center items-start gap-2 flex">
      <span className="subtle-heading">
        Location
      </span>
      <button
        onClick={() => setFormat(f => f === 'DD' ? 'DMS' : f === 'DMS' ? 'DMM' : 'DD')}
        className="text-white text-base font-medium font-sans hover:text-primary-300 transition-colors"
      >
        {formattedCoordinates}
      </button>
    </div>
  );
};
  