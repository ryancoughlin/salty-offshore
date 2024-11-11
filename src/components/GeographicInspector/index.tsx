import { useState, useCallback, memo } from 'react';
import { formatCoordinates } from '../../utils/formatCoordinates';
import type { Coordinate } from '../../types/core';

type CoordinateFormat = 'DD' | 'DMS' | 'DMM';

interface GeographicInspectorProps {
    cursorPosition: Coordinate | null;
}

export const GeographicInspector = memo<GeographicInspectorProps>(({
    cursorPosition
}) => {
    const [format, setFormat] = useState<CoordinateFormat>('DMS');

    const handleFormatToggle = useCallback(() => {
        setFormat(currentFormat =>
            currentFormat === 'DD' ? 'DMS' :
                currentFormat === 'DMS' ? 'DMM' : 'DD'
        );
    }, []);

    if (!cursorPosition) return null;

    const formattedCoordinates = formatCoordinates(
        [cursorPosition.longitude, cursorPosition.latitude],
        format
    );

    return (
        <div className="flex flex-col justify-center items-start flex-grow-0 flex-shrink-0 relative gap-1">
            <span className="opacity-50 text-xs font-medium font-mono uppercase text-white">
                Location
            </span>
            <button
                className="text-xl font-semibold text-white hover:text-blue-300 transition-colors"
                onClick={handleFormatToggle}
                aria-label={`Location coordinates: ${formattedCoordinates}. Click to change format.`}
            >
                {formattedCoordinates}
            </button>
        </div>
    );
});

GeographicInspector.displayName = 'GeographicInspector';
  